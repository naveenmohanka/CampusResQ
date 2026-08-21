import React from 'react';
import { ActivityLog } from '../../types/activity';
import { formatDate, formatTimeAgo } from '../../utils/dateUtils';
import { CheckCircle2, UserPlus, RefreshCw, AlertOctagon, Activity } from 'lucide-react';

export const ActivityTimeline: React.FC<{ logs: ActivityLog[] }> = ({ logs }) => {
  const getIcon = (action: string) => {
    switch (action) {
      case 'INCIDENT_CREATED':
        return <AlertOctagon className="w-4 h-4 text-rose-400" />;
      case 'INCIDENT_ASSIGNED':
        return <UserPlus className="w-4 h-4 text-cyan-400" />;
      case 'STATUS_CHANGED':
      case 'SEVERITY_UPDATED':
        return <RefreshCw className="w-4 h-4 text-amber-400" />;
      case 'INCIDENT_RESOLVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {logs.length === 0 ? (
        <p className="text-xs text-slate-500">No activity logs recorded for this incident.</p>
      ) : (
        logs.map((log) => (
          <div key={log.id} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-teal-500 flex items-center justify-center group-hover:scale-125 transition-transform" />
            
            <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {getIcon(log.action)}
                  <span className="font-semibold text-teal-300 font-mono text-[11px]">
                    {log.action}
                  </span>
                </div>
                <span className="text-slate-500">{formatTimeAgo(log.timestamp)}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{log.details}</p>
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>By: <strong className="text-slate-300">{log.performedByName}</strong> ({log.performedByRole})</span>
                <span>{formatDate(log.timestamp)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
