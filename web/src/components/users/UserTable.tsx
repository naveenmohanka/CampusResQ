import React from 'react';
import { UserProfile } from '../../types/user';
import { RoleBadge } from '../common/Badge';
import { formatDate } from '../../utils/dateUtils';
import { Mail, Phone, Building, Edit } from 'lucide-react';
import { Button } from '../common/Button';

interface UserTableProps {
  users: UserProfile[];
  onEditRole: (user: UserProfile) => void;
}

export const UserTable: React.FC<UserTableProps> = ({ users, onEditRole }) => {
  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6">User & Role</th>
              <th className="py-4 px-4">Contact Information</th>
              <th className="py-4 px-4">Department / Program</th>
              <th className="py-4 px-4">Registered Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-bold text-sm uppercase flex-shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-teal-300 transition-colors">
                        {u.name}
                      </h4>
                      <div className="mt-1">
                        <RoleBadge role={u.role} />
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>{u.email}</span>
                    </div>
                    {u.phoneNumber && (
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{u.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>{u.department || 'General Campus Member'}</span>
                  </div>
                </td>

                <td className="py-4 px-4 text-xs text-slate-400">
                  {formatDate(u.createdAt)}
                </td>

                <td className="py-4 px-6 text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onEditRole(u)}
                    icon={<Edit className="w-3.5 h-3.5" />}
                  >
                    Change Role
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
