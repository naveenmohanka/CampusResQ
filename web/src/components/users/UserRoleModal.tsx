import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UserProfile, UserRole } from '../../types/user';
import { updateUserRole } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import { ShieldCheck, ShieldAlert, GraduationCap } from 'lucide-react';

interface UserRoleModalProps {
  userToEdit: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UserRoleModal: React.FC<UserRoleModalProps> = ({
  userToEdit,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user: currentAdmin } = useAuth();
  const { showToast } = useNotification();
  const [selectedRole, setSelectedRole] = useState<UserRole>(userToEdit?.role || 'student');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (userToEdit) {
      setSelectedRole(userToEdit.role);
    }
  }, [userToEdit]);

  const handleRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToEdit || !currentAdmin) return;

    try {
      setLoading(true);
      await updateUserRole(userToEdit.id, selectedRole, currentAdmin.id, currentAdmin.name);

      showToast({
        type: 'success',
        title: 'Role Updated',
        message: `Updated permissions for ${userToEdit.name} to "${selectedRole.toUpperCase()}".`,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Failed to change role.',
      });
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'student' as UserRole,
      title: 'Student',
      desc: 'Can report emergencies and monitor personal reports via Android app.',
      icon: <GraduationCap className="w-5 h-5 text-emerald-400" />,
    },
    {
      id: 'mentor' as UserRole,
      title: 'Faculty / Mentor',
      desc: 'First responder assigned to guide and resolve student incidents.',
      icon: <ShieldCheck className="w-5 h-5 text-cyan-400" />,
    },
    {
      id: 'admin' as UserRole,
      title: 'Administrator',
      desc: 'Full access to Admin Web Dashboard, audit logs, and security oversight.',
      icon: <ShieldAlert className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update User Security Role">
      <form onSubmit={handleRoleChange} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">User Account</label>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
            <p className="text-sm font-semibold text-white">{userToEdit?.name}</p>
            <p className="text-xs text-slate-400">{userToEdit?.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-400">Select Security Role</label>
          {roles.map((r) => (
            <label
              key={r.id}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                selectedRole === r.id
                  ? 'bg-teal-500/10 border-teal-500/50 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.id}
                checked={selectedRole === r.id}
                onChange={() => setSelectedRole(r.id)}
                className="mt-1 text-teal-500 focus:ring-teal-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-white">{r.title}</span>
                  {r.icon}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{r.desc}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Save Role Change
          </Button>
        </div>
      </form>
    </Modal>
  );
};
