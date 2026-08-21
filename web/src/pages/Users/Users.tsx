import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { UserTable } from '../../components/users/UserTable';
import { UserFilters, UserRole, ResponderApprovalStatus } from '../../types/user';
import { Search, UserCheck, AlertTriangle, Shield, RotateCcw } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const UsersPage: React.FC = () => {
  const [filters, setFilters] = useState<UserFilters>({
    role: 'all',
    responderApprovalStatus: 'all',
    searchQuery: '',
  });

  const { users, loading, error } = useUsers(filters);

  // Unfiltered count of pending requests for the alert banner
  const { users: allUsers } = useUsers();
  const pendingRequests = allUsers.filter((u) => u.responderApprovalStatus === 'pending');

  const roleTabs = [
    { id: 'all', label: 'All Users' },
    { id: 'responder', label: 'Responders' },
    { id: 'reporter', label: 'Reporters' },
    { id: 'admin', label: 'Admins' },
  ];

  const handleReset = () => {
    setFilters({
      role: 'all',
      responderApprovalStatus: 'all',
      searchQuery: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            Campus Personnel & Role Directory
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              {users.length} Registered
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Android schema aligned roles (Reporter & Responder) and Admin responder approval workflow.
          </p>
        </div>
      </div>

      {/* Pending Responder Requests Operational Banner */}
      {pendingRequests.length > 0 && filters.responderApprovalStatus !== 'pending' && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                {pendingRequests.length} Responder Application{pendingRequests.length > 1 ? 's' : ''} Awaiting Admin Verification
              </h4>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                Campus members have requested authorization to join the Emergency Response Team.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFilters({ ...filters, responderApprovalStatus: 'pending', role: 'all' })}
            className="border-amber-500/40 text-amber-800 dark:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 flex-shrink-0"
            icon={<UserCheck className="w-3.5 h-3.5" />}
          >
            Review Pending ({pendingRequests.length})
          </Button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="clean-card p-4 rounded-2xl space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Role Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-color)] overflow-x-auto">
            {roleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilters({ ...filters, role: tab.id as UserRole | 'all' })}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filters.role === tab.id
                    ? 'bg-violet-600 text-white shadow-sm font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Approval Status Filter */}
            <select
              value={filters.responderApprovalStatus || 'all'}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  responderApprovalStatus: e.target.value as ResponderApprovalStatus | 'all',
                })
              }
              className="w-full sm:w-48 px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-violet-500"
            >
              <option value="all">All Approval Statuses</option>
              <option value="pending">⏳ Pending Approval ({pendingRequests.length})</option>
              <option value="approved">✅ Approved Responders</option>
              <option value="rejected">❌ Rejected Requests</option>
              <option value="not_requested">⚪ Not Requested</option>
            </select>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, email, dept..."
                value={filters.searchQuery || ''}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-violet-500"
              />
            </div>

            <button
              onClick={handleReset}
              title="Reset Filters"
              className="p-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors flex-shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Table / Loading */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-center">
          <p className="font-semibold">Unable to load campus directory.</p>
          <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">{error.message}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="clean-card p-12 text-center rounded-2xl space-y-3">
          <Shield className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">No matching users found</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            Try adjusting your search criteria or resetting role and approval filters.
          </p>
        </div>
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
};
