import React, { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Incident } from '../../types/incident';
import { UserProfile } from '../../types/user';
import { getResponders } from '../../services/userService';
import { assignMentorToIncident } from '../../services/incidentService';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';

interface AssignMentorModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AssignMentorModal: React.FC<AssignMentorModalProps> = ({
  incident,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [responders, setResponders] = useState<UserProfile[]>([]);
  const [selectedResponderId, setSelectedResponderId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFetching(true);
      getResponders()
        .then((data) => {
          setResponders(data);
          if (data.length > 0) {
            setSelectedResponderId(incident?.assignedTo || data[0].id);
          }
        })
        .finally(() => setFetching(false));
    }
  }, [isOpen, incident]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident || !selectedResponderId || !user) return;

    const responder = responders.find((m) => m.id === selectedResponderId);
    if (!responder) return;

    try {
      setLoading(true);
      await assignMentorToIncident(
        incident.id,
        responder.id,
        responder.name,
        responder.email,
        user.id,
        user.name
      );

      showToast({
        type: 'success',
        title: 'Responder Assigned',
        message: `Successfully assigned ${responder.name} to incident "${incident.title}".`,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Assignment Failed',
        message: err.message || 'Could not assign response team member.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Response Team Member / Responder">
      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
            Target Incident
          </label>
          <div className="p-3 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl">
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{incident?.title}</p>
            <p className="text-xs text-violet-600 dark:text-violet-400 font-mono mt-0.5">ID: #{incident?.id}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase mb-1">
            Select Authorized Responder
          </label>
          {fetching ? (
            <div className="p-3 text-xs text-[var(--text-muted)] animate-pulse">Loading responders list...</div>
          ) : responders.length === 0 ? (
            <div className="p-3 text-xs text-amber-700 dark:text-amber-300 bg-amber-500/10 rounded-xl border border-amber-500/20">
              No approved responders found. You can approve responder requests in the Users tab.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {responders.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedResponderId === m.id
                      ? 'bg-violet-500/10 border-violet-500/50 text-[var(--text-primary)]'
                      : 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="responder"
                      value={m.id}
                      checked={selectedResponderId === m.id}
                      onChange={() => setSelectedResponderId(m.id)}
                      className="text-violet-600 focus:ring-violet-500"
                    />
                    <div>
                      <p className="font-semibold text-sm">{m.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{m.department || m.email}</p>
                    </div>
                  </div>
                  <UserCheck className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
          <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={loading}
            disabled={fetching || responders.length === 0}
          >
            Confirm Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
