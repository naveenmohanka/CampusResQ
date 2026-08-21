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
    <div className="clean-card p-5 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm">Active Campus Broadcast Alerts</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Campus Safety Alert Network (Module 2)</p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          icon={<Plus className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />}
        >
          New Broadcast
        </Button>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-[var(--text-muted)]">Loading active broadcast alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="py-6 text-center border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-subtle)]">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5 opacity-80" />
          <p className="text-xs font-semibold text-[var(--text-secondary)]">No Active Emergency Advisories</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">All campus zones operating under normal safety conditions.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-xl border transition-all ${
                alert.severity === 'critical'
                  ? 'bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200'
                  : alert.severity === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="mt-0.5 flex-shrink-0">
                    {alert.severity === 'critical' && <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400" />}
                    {alert.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                    {alert.severity === 'advisory' && <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs tracking-wide uppercase leading-tight truncate">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{alert.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-[var(--text-muted)]">
                      <span className="flex items-center gap-1 font-semibold text-[var(--text-secondary)]">
                        <MapPin className="w-3 h-3 text-violet-600 dark:text-violet-400" />
                        {alert.targetArea}
                      </span>
                      <span>•</span>
                      <span>Broadcasted {formatTimeAgo(alert.createdAt)}</span>
                      {alert.acknowledgedCount !== undefined && alert.acknowledgedCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-violet-600 dark:text-violet-400 font-mono">{alert.acknowledgedCount} delivered</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeactivate(alert.id)}
                  disabled={deactivatingId === alert.id}
                  className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
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
