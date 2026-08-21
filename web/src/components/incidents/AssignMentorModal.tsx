import React, { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Incident } from '../../types/incident';
import { UserProfile } from '../../types/user';
import { getMentors } from '../../services/userService';
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
  const [mentors, setMentors] = useState<UserProfile[]>([]);
  const [selectedMentorId, setSelectedMentorId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingMentors, setFetchingMentors] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFetchingMentors(true);
      getMentors()
        .then((data) => {
          setMentors(data);
          if (data.length > 0) {
            setSelectedMentorId(incident?.assignedTo || data[0].id);
          }
        })
        .finally(() => setFetchingMentors(false));
    }
  }, [isOpen, incident]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incident || !selectedMentorId || !user) return;

    const mentor = mentors.find((m) => m.id === selectedMentorId);
    if (!mentor) return;

    try {
      setLoading(true);
      await assignMentorToIncident(
        incident.id,
        mentor.id,
        mentor.name,
        mentor.email,
        user.id,
        user.name
      );

      showToast({
        type: 'success',
        title: 'Mentor Assigned',
        message: `Successfully assigned ${mentor.name} to incident "${incident.title}".`,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Assignment Failed',
        message: err.message || 'Could not assign mentor.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Faculty / Security Mentor">
      <form onSubmit={handleAssign} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Target Incident
          </label>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-sm font-semibold text-white truncate">{incident?.title}</p>
            <p className="text-xs text-teal-400 font-mono mt-0.5">ID: {incident?.id}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            Select Response Mentor
          </label>
          {fetchingMentors ? (
            <div className="p-3 text-xs text-slate-400 animate-pulse">Loading mentors list...</div>
          ) : mentors.length === 0 ? (
            <div className="p-3 text-xs text-amber-400 bg-amber-500/10 rounded-xl border border-amber-500/20">
              No mentors registered yet. You can change user roles in the Users tab.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {mentors.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedMentorId === m.id
                      ? 'bg-teal-500/10 border-teal-500/50 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="mentor"
                      value={m.id}
                      checked={selectedMentorId === m.id}
                      onChange={() => setSelectedMentorId(m.id)}
                      className="text-teal-500 focus:ring-teal-500"
                    />
                    <div>
                      <p className="font-semibold text-sm">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.department || m.email}</p>
                    </div>
                  </div>
                  <UserCheck className="w-4 h-4 text-teal-400" />
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={loading}
            disabled={fetchingMentors || mentors.length === 0}
          >
            Confirm Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
