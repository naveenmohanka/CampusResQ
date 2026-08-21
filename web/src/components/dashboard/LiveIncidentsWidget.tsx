import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import { Incident } from '../../types/incident';
import { SeverityBadge, StatusBadge } from '../common/Badge';
import { formatCategory, truncateText } from '../../utils/formatters';
import { formatTimeAgo } from '../../utils/dateUtils';

export const LiveIncidentsWidget: React.FC<{ incidents: Incident[] }> = ({ incidents }) => {
  const recentList = incidents.slice(0, 5);

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            Live Incident Stream
          </h3>
          <p className="text-xs text-slate-400">Recently reported campus occurrences</p>
        </div>
        <Link
          to="/incidents"
          className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 group"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="divide-y divide-slate-800/60 overflow-x-auto">
        {recentList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No incidents reported yet.
          </div>
        ) : (
          recentList.map((inc) => (
            <Link
              key={inc.id}
              to={`/incidents/${inc.id}`}
              className="p-4 hover:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors block group"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <SeverityBadge severity={inc.severity} />
                  <StatusBadge status={inc.status} />
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    {formatCategory(inc.category)}
                  </span>
                </div>
                <h4 className="font-semibold text-sm text-slate-100 group-hover:text-teal-300 transition-colors truncate">
                  {inc.title}
                </h4>
                <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                    {truncateText(inc.location.address, 35)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    {formatTimeAgo(inc.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                {inc.assignedToName ? (
                  <div className="text-right text-xs">
                    <p className="text-[11px] text-slate-500">Assigned:</p>
                    <p className="text-xs font-medium text-slate-300 truncate max-w-[120px]">
                      {inc.assignedToName}
                    </p>
                  </div>
                ) : (
                  <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                    Unassigned
                  </span>
                )}
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
