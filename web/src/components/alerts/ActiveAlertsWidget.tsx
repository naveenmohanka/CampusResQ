import React, { useState } from 'react';
import { useAlerts } from '../../hooks/useAlerts';
import { useAuth } from '../../hooks/useAuth';
import { deactivateCampusAlert } from '../../services/alertService';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../common/Button';
import { CreateAlertModal } from './CreateAlertModal';
import { Radio, AlertTriangle, AlertOctagon, Info, MapPin, Plus, CheckCircle2 } from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';

export const ActiveAlertsWidget: React.FC = () => {
  const { alerts, loading } = useAlerts(true);
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

  const handleDeactivate = async (alertId: string) => {
    try {
      setDeactivatingId(alertId);
      await deactivateCampusAlert(alertId, user?.id || 'admin', user?.name || 'Admin');
      showToast({
        type: 'info',
        title: 'Alert Deactivated',
        message: 'Broadcast has been ended and removed from active monitors.',
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Failed to Deactivate',
        message: err.message,
      });
    } finally {
      setDeactivatingId(null);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Active Campus Broadcast Alerts</h3>
            <p className="text-[11px] text-slate-400">Campus Safety Alert Network (Module 2)</p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-3.5 h-3.5 text-teal-400" />}
        >
          New Broadcast
        </Button>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-slate-500">Loading active broadcast alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="py-6 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5 opacity-80" />
          <p className="text-xs font-semibold text-slate-300">No Active Emergency Advisories</p>
          <p className="text-[11px] text-slate-500 mt-0.5">All campus zones operating under normal safety conditions.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border transition-all ${
                alert.severity === 'critical'
                  ? 'bg-red-950/40 border-red-500/40 text-red-100 shadow-glow-red'
                  : alert.severity === 'warning'
                  ? 'bg-amber-950/30 border-amber-500/30 text-amber-100'
                  : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5 flex-shrink-0">
                    {alert.severity === 'critical' && <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />}
                    {alert.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    {alert.severity === 'advisory' && <Info className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs tracking-wide uppercase leading-tight truncate">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-slate-300">
                        <MapPin className="w-3 h-3 text-teal-400" />
                        {alert.targetArea}
                      </span>
                      <span>•</span>
                      <span>Broadcasted {formatTimeAgo(alert.createdAt)}</span>
                      {alert.acknowledgedCount !== undefined && alert.acknowledgedCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-teal-400 font-mono">{alert.acknowledgedCount} delivered</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeactivate(alert.id)}
                  disabled={deactivatingId === alert.id}
                  className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors flex-shrink-0"
                >
                  {deactivatingId === alert.id ? 'Ending...' : 'End Alert'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateAlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
