import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { useActivityLogs } from '../../hooks/useActivityLogs';
import { ActivityAction, ActivityFilters } from '../../types/activity';
import { formatDate, formatTimeAgo } from '../../utils/dateUtils';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';

export const ActivityLogsPage: React.FC = () => {
  const [filters, setFilters] = useState<ActivityFilters>({
    action: 'all',
    searchQuery: '',
  });

  const { logs, loading, error } = useActivityLogs(filters);

  const actionOptions: { id: ActivityAction | 'all'; label: string }[] = [
    { id: 'all', label: 'All Actions' },
    { id: 'INCIDENT_CREATED', label: 'Incident Created' },
    { id: 'INCIDENT_ASSIGNED', label: 'Mentor Assigned' },
    { id: 'STATUS_CHANGED', label: 'Status Changed' },
    { id: 'SEVERITY_UPDATED', label: 'Severity Updated' },
    { id: 'INCIDENT_RESOLVED', label: 'Incident Resolved' },
    { id: 'USER_ROLE_CHANGED', label: 'Role Changed' },
  ];

  const exportAudit = () => {
    if (logs.length === 0) return;
    const headers = ['Log ID', 'Action', 'Incident ID', 'Actor', 'Role', 'Details', 'Timestamp'];
    const rows = logs.map(l => [
      l.id,
      l.action,
      l.incidentId || 'N/A',
      `"${l.performedByName}"`,
      l.performedByRole,
      `"${l.details.replace(/"/g, '""')}"`,
      l.timestamp
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `campusresq-audit-trail-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            System & Security Audit Logs
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-400 font-mono border border-slate-700">
              {logs.length} Events
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable chronological audit log of all incident updates, assignments, and access changes.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={exportAudit}
          icon={<Download className="w-4 h-4" />}
          disabled={logs.length === 0}
        >
          Export Audit Trail
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit details, actor name, action..."
            value={filters.searchQuery || ''}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
          />
        </div>

        <div>
          <select
            value={filters.action || 'all'}
            onChange={(e) =>
              setFilters({
                ...filters,
                action: e.target.value as ActivityAction | 'all',
              })
            }
            className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-500/50"
          >
            {actionOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <TableSkeleton rows={8} cols={5} />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-200 text-center">
          <p className="font-semibold">Unable to load audit logs.</p>
          <p className="text-xs text-rose-300 mt-1">{error.message}</p>
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          title="No Audit Logs Found"
          description="No system activities match your current search or action filter."
        />
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Action Type</th>
                  <th className="py-4 px-4">Event Details</th>
                  <th className="py-4 px-4">Performed By</th>
                  <th className="py-4 px-4">Incident Ref</th>
                  <th className="py-4 px-6 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-200 max-w-md">
                      {log.details}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs">
                      <p className="font-semibold text-white">{log.performedByName}</p>
                      <p className="text-[11px] text-slate-400 capitalize">{log.performedByRole}</p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-xs font-mono text-slate-400">
                      {log.incidentId ? (
                        <span className="text-teal-400">{log.incidentId}</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right whitespace-nowrap text-xs text-slate-400">
                      <p>{formatDate(log.timestamp)}</p>
                      <p className="text-[10px] text-slate-500">{formatTimeAgo(log.timestamp)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
