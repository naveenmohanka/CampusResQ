import React from 'react';
import { UserProfile } from '../../types/user';
import { RoleBadge } from '../common/Badge';
import { formatDate } from '../../utils/dateUtils';
import { Mail, Phone, Building } from 'lucide-react';

interface UserTableProps {
  users: UserProfile[];
}

export const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6">User Profile</th>
              <th className="py-4 px-4">Role & Status</th>
              <th className="py-4 px-4">Contact Information</th>
              <th className="py-4 px-4">Department / Program</th>
              <th className="py-4 px-6 text-right">Registered On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40 transition-colors group">
                {/* User Name & Avatar */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-bold text-sm uppercase flex-shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-teal-300 transition-colors">
                        {u.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono">UID: {u.id}</p>
                    </div>
                  </div>
                </td>

                {/* Role Badge */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <RoleBadge role={u.role} />
                    {u.status === 'active' && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    )}
                  </div>
                </td>

                {/* Contact Info */}
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

                {/* Department */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    <span>{u.department || 'General Campus Member'}</span>
                  </div>
                </td>

                {/* Registered Date */}
                <td className="py-4 px-6 text-right whitespace-nowrap text-xs text-slate-400 font-mono">
                  {formatDate(u.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
