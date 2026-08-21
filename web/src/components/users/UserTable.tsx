import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../types/user';
import { RoleBadge, ResponderApprovalBadge } from '../common/Badge';
import { formatDate, formatTimeAgo } from '../../utils/dateUtils';
import { Mail, Phone, Building, Check, X, ShieldAlert, Clock, UserCheck } from 'lucide-react';
import { approveResponderRequest, rejectResponderRequest, updateUserRole } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../common/Button';

interface UserTableProps {
  users: UserProfile[];
}

export const UserTable: React.FC<UserTableProps> = ({ users }) => {
  const { user: currentUser } = useAuth();
  const { showToast } = useNotification();

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingUser, setRejectingUser] = useState<UserProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const handleApprove = async (u: UserProfile) => {
    if (!currentUser) return;
    try {
      setProcessingId(u.id);
      await approveResponderRequest(u.id, currentUser.id, currentUser.name || 'Administrator');
      showToast({
        type: 'success',
        title: 'Responder Approved',
        message: `${u.name} has been approved as an authorized Response Team Member.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Approval Failed',
        message: err.message || 'Could not approve responder request.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!currentUser || !rejectingUser) return;
    try {
      setProcessingId(rejectingUser.id);
      await rejectResponderRequest(
        rejectingUser.id,
        currentUser.id,
        currentUser.name || 'Administrator',
        rejectionReason
      );
      showToast({
        type: 'info',
        title: 'Responder Request Rejected',
        message: `Request for ${rejectingUser.name} was rejected.`,
      });
      setRejectingUser(null);
      setRejectionReason('');
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Rejection Failed',
        message: err.message || 'Could not reject responder request.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!currentUser) return;
    try {
      setProcessingId(userId);
      await updateUserRole(userId, newRole, currentUser.id, currentUser.name || 'Administrator');
      showToast({
        type: 'success',
        title: 'Role Updated',
        message: `User role changed to ${newRole.toUpperCase()}.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Role Update Failed',
        message: err.message || 'Could not update user role.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      <div className="clean-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-subtle)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                <th className="py-4 px-6">User Profile</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Responder Approval Status</th>
                <th className="py-4 px-4">Contact & Dept</th>
                <th className="py-4 px-6 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-sm">
              {users.map((u) => {
                const isPending = u.responderApprovalStatus === 'pending';
                const isApproved = u.responderApprovalStatus === 'approved';
                const isRejected = u.responderApprovalStatus === 'rejected';
                const isBusy = processingId === u.id;

                return (
                  <tr key={u.id} className="hover:bg-[var(--bg-hover)] transition-colors group">
                    {/* 1. User Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-700 dark:text-violet-300 font-bold text-sm uppercase flex-shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {u.name}
                          </h4>
                          <p className="text-xs text-[var(--text-muted)] font-mono">UID: {u.id}</p>
                          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">Joined {formatDate(u.createdAt)}</p>
                        </div>
                      </div>
                    </td>

                    {/* 2. Role Badge & Role Switcher */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="space-y-1.5">
                        <RoleBadge role={u.role} />
                        <div>
                          <select
                            value={u.role}
                            disabled={isBusy}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className="px-2 py-0.5 text-[10px] bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-lg text-[var(--text-secondary)] focus:outline-none focus:border-violet-500"
                          >
                            <option value="reporter">Reporter</option>
                            <option value="responder">Responder</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>
                    </td>

                    {/* 3. Responder Approval Status & Workflow Details */}
                    <td className="py-4 px-4">
                      <div className="space-y-1 max-w-xs">
                        <ResponderApprovalBadge status={u.responderApprovalStatus} />
                        {isPending && u.responderRequestedAt && (
                          <p className="text-[10px] text-amber-700 dark:text-amber-300 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-500" />
                            Requested {formatTimeAgo(u.responderRequestedAt)}
                          </p>
                        )}
                        {isApproved && (
                          <p className="text-[10px] text-[var(--text-muted)] font-mono">
                            {u.responderApprovedByName ? `Verified by ${u.responderApprovedByName}` : 'Authorized Responder'}
                          </p>
                        )}
                        {isRejected && u.responderRejectionReason && (
                          <p className="text-[10px] text-rose-600 dark:text-rose-400 italic truncate" title={u.responderRejectionReason}>
                            Reason: {u.responderRejectionReason}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* 4. Contact Info & Dept */}
                    <td className="py-4 px-4">
                      <div className="space-y-1 text-xs text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                          <span className="font-mono text-xs">{u.email}</span>
                        </div>
                        {u.phoneNumber && (
                          <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-mono">
                            <Phone className="w-3.5 h-3.5" />
                            <span>{u.phoneNumber}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                          <Building className="w-3.5 h-3.5" />
                          <span className="truncate">{u.department || 'Campus Member'}</span>
                        </div>
                      </div>
                    </td>

                    {/* 5. Admin Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      {isPending ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isBusy}
                            onClick={() => handleApprove(u)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                            icon={<Check className="w-3.5 h-3.5" />}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            disabled={isBusy}
                            onClick={() => setRejectingUser(u)}
                            icon={<X className="w-3.5 h-3.5" />}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : isApproved && u.role !== 'admin' ? (
                        <div className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                          <UserCheck className="w-4 h-4 text-emerald-500" />
                          <span>Active Responder</span>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)] font-mono">Synced</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Dialog Modal */}
      {rejectingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clean-card max-w-md w-full p-6 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-[var(--text-primary)] text-base">Reject Responder Application</h3>
              </div>
              <button
                onClick={() => setRejectingUser(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              You are rejecting the response team request for <strong>{rejectingUser.name}</strong> ({rejectingUser.email}).
              Their account role will remain <strong>Reporter</strong>.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase">
                Rejection Reason (Optional)
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Incomplete training credentials, verification pending..."
                className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-rose-500 h-20 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRejectingUser(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmReject}
                loading={processingId === rejectingUser.id}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
