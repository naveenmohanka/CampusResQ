import React, { useState } from 'react';
import { useAlerts } from '../../hooks/useAlerts';
import { useAuth } from '../../hooks/useAuth';
import { deactivateCampusAlert, deleteCampusAlert } from '../../services/alertService';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { CreateAlertModal } from '../../components/alerts/CreateAlertModal';
import { Radio, AlertTriangle, AlertOctagon, Info, MapPin, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { formatDate, formatTimeAgo } from '../../utils/dateUtils';

export const AlertsPage: React.FC = () => {
  const { alerts, loading } = useAlerts(false);
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeactivate = async (alertId: string) => {
    try {
      await deactivateCampusAlert(alertId, user?.id || 'admin', user?.name || 'Admin');
      showToast({
        type: 'info',
        title: 'Alert Deactivated',
        message: 'Broadcast marked as inactive.',
      });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Failed to Deactivate', message: err.message });
    }
  };

  const handleDelete = async (alertId: string) => {
    if (!window.confirm('Delete this broadcast alert from records?')) return;
    try {
      await deleteCampusAlert(alertId);
      showToast({ type: 'success', title: 'Alert Removed', message: 'Broadcast deleted from database.' });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Delete Failed', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Campus Safety Alert Network
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono border border-amber-500/30">
              Module 2
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Broadcast emergency alerts, weather advisories, and zone lockdowns to all students and staff.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          icon={<Radio className="w-4 h-4 animate-pulse" />}
        >
          Create New Broadcast Alert
        </Button>
      </div>

      {/* Alerts Feed */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading broadcast records...</div>
      ) : alerts.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-80" />
          <h3 className="font-bold text-white text-base">No Broadcast Alerts</h3>
          <p className="text-xs text-slate-400 mt-1">No emergency broadcasts or advisories are currently posted.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`glass-panel p-5 rounded-2xl border transition-all ${
                !alert.active
                  ? 'border-slate-800/40 opacity-60 bg-slate-950/40'
                  : alert.severity === 'critical'
                  ? 'border-red-500/40 bg-red-950/20 shadow-glow-red'
                  : alert.severity === 'warning'
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : 'border-cyan-500/40 bg-cyan-950/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 mt-0.5">
                    {alert.severity === 'critical' && <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />}
                    {alert.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    {alert.severity === 'advisory' && <Info className="w-4 h-4 text-cyan-400" />}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        alert.severity === 'critical'
                          ? 'bg-red-950 text-red-300 border border-red-700'
                          : alert.severity === 'warning'
                          ? 'bg-amber-950 text-amber-300 border border-amber-700'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-medium">
                        Category: {alert.category.toUpperCase()}
                      </span>
                      {alert.active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                          LIVE BROADCAST
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-semibold">
                          EXPIRED / ENDED
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-white text-base tracking-tight">{alert.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{alert.message}</p>

                    <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 text-slate-300 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-teal-400" />
                        Target Zone: {alert.targetArea}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Published: {formatDate(alert.createdAt)} ({formatTimeAgo(alert.createdAt)})
                      </span>
                      {alert.createdByName && (
                        <>
                          <span>•</span>
                          <span>Author: {alert.createdByName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0">
                  {alert.active && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeactivate(alert.id)}
                    >
                      Deactivate
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(alert.id)}
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateAlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
