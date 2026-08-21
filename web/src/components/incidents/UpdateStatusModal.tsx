import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Incident, IncidentStatus } from '../../types/incident';
import { updateIncidentStatus } from '../../services/incidentService';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';

interface UpdateStatusModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  incident,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [status, setStatus] = useState<IncidentStatus>(incident?.status || 'in_progress');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (incident) {
      setStatus(incident.status);
      setResolutionNotes(incident.resolutionNotes || '');
    }
  }, [incident]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident || !user) return;

    try {
      setLoading(true);
      await updateIncidentStatus(
        incident.id,
        status,
        user.id,
        user.name,
        status === 'resolved' ? resolutionNotes : undefined
      );

      showToast({
        type: 'success',
        title: 'Status Updated',
        message: `Incident marked as "${status.replace('_', ' ').toUpperCase()}".`,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update incident status.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Incident Status">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Current Incident
          </label>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-sm font-semibold text-white truncate">{incident?.title}</p>
            <p className="text-xs text-teal-400 font-mono mt-0.5">ID: {incident?.id}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            New Operational Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['reported', 'assigned', 'in_progress', 'resolved'] as IncidentStatus[]).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setStatus(s)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                  status === s
                    ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-glow-teal font-bold'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {status === 'resolved' && (
          <div className="animate-in fade-in space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              Resolution Action Summary / Medical Report Notes *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Detail actions taken to resolve the incident, dispatched personnel, medical reports, or disciplinary measures..."
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="w-full p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Apply Status Update
          </Button>
        </div>
      </form>
    </Modal>
  );
};
