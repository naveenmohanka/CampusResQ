import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { UserFilters, UserRole } from '../../types/user';
import { UserTable } from '../../components/users/UserTable';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';

export const UsersPage: React.FC = () => {
  const [filters, setFilters] = useState<UserFilters>({
    role: 'all',
    searchQuery: '',
  });

  const { users, loading, error } = useUsers(filters);

  const roleTabs = [
    { id: 'all', label: 'All Users' },
    { id: 'student', label: 'Students' },
    { id: 'mentor', label: 'Faculty & Mentors' },
    { id: 'admin', label: 'Administrators' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Campus User & Responder Directory
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-400 font-mono border border-slate-700">
              {users.length} Registered
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Directory of student accounts, designated faculty mentors, and emergency security officers.
          </p>
        </div>
      </div>

      {/* Role Tabs & Search */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 w-full sm:w-auto overflow-x-auto">
            {roleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilters({ ...filters, role: tab.id as UserRole | 'all' })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filters.role === tab.id
                    ? 'bg-teal-500 text-slate-950 shadow-glow-teal font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, dept..."
              value={filters.searchQuery || ''}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
            />
          </div>
        </div>
      </div>

      {/* User Table */}
      {loading ? (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <TableSkeleton rows={6} cols={5} />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-200 text-center">
          <p className="font-semibold">Unable to load campus directory.</p>
          <p className="text-xs text-rose-300 mt-1">{error.message}</p>
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          title="No Users Found"
          description="No user accounts match the selected role or search keyword."
        />
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
};
