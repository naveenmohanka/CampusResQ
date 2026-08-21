import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, ShieldCheck, UserCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { ActivityLog } from '../../types/activity';
import { formatTimeAgo } from '../../utils/dateUtils';

export const RecentActivityWidget: React.FC<{ logs: ActivityLog[] }> = ({ logs }) => {
  const recentLogs = logs.slice(0, 6);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'INCIDENT_CREATED':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case 'INCIDENT_ASSIGNED':
        return <UserCheck className="w-4 h-4 text-cyan-400" />;
      case 'STATUS_CHANGED':
      case 'SEVERITY_UPDATED':
        return <RefreshCw className="w-4 h-4 text-amber-400" />;
      case 'INCIDENT_RESOLVED':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            Live Audit Stream
          </h3>
          <p className="text-xs text-slate-400">Chronological incident & user actions</p>
        </div>
        <Link
          to="/activity-logs"
          className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 group"
        >
          View audit
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="p-4 space-y-3 divide-y divide-slate-800/40">
        {recentLogs.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No recent activity recorded.
          </div>
        ) : (
          recentLogs.map((log) => (
            <div key={log.id} className="pt-3 first:pt-0 flex items-start gap-3 text-xs">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 mt-0.5 flex-shrink-0">
                {getActionIcon(log.action)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 leading-snug">{log.details}</p>
                <div className="flex items-center gap-2 mt-1 text-slate-500">
                  <span className="font-medium text-slate-400">{log.performedByName}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(log.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
