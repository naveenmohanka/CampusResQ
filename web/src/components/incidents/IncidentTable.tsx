import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Zap } from 'lucide-react';
import { Incident } from '../../types/incident';
import { AiSeverityBadge, StatusBadge, CategoryBadge } from '../common/Badge';
import { formatTimeAgo, formatDate } from '../../utils/dateUtils';
import { formatLocationString, getEffectiveSeverity, isImmediateResponseRequired, parseAiAnalysis } from '../../utils/aiAnalysis';

interface IncidentTableProps {
  incidents: Incident[];
}

export const IncidentTable: React.FC<IncidentTableProps> = ({ incidents }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6">Incident</th>
              <th className="py-4 px-4">Category</th>
              <th className="py-4 px-4">Location</th>
              <th className="py-4 px-4">Effective Severity</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-6 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {incidents.map((incident) => {
              const ai = parseAiAnalysis(incident.aiAnalysis);
              const effSeverity = getEffectiveSeverity(incident);
              const immediate = isImmediateResponseRequired(incident);

              return (
                <tr
                  key={incident.id}
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  {/* 1. Incident (ID & Title) */}
                  <td className="py-4 px-6 max-w-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal-400 group-hover:text-teal-300">
                          #{incident.id}
                        </span>
                        {immediate && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-600 animate-pulse">
                            <Zap className="w-2.5 h-2.5 text-red-400" />
                            IMMEDIATE
                          </span>
                        )}
                        {incident.adminSeverity && (
                          <span className="text-[10px] text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/40 font-mono">
                            OVERRIDDEN
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-white group-hover:text-teal-300 transition-colors truncate">
                        {incident.title}
                      </h4>
                      <p className="text-xs text-slate-400 truncate">
                        {incident.description}
                      </p>
                    </div>
                  </td>

                  {/* 2. Category */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <CategoryBadge category={incident.category} />
                  </td>

                  {/* 3. Location */}
                  <td className="py-4 px-4 max-w-[180px]">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                      <span className="truncate">{formatLocationString(incident.location)}</span>
                    </div>
                  </td>

                  {/* 4. AI / Effective Severity & Priority */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <AiSeverityBadge
                        severity={effSeverity}
                        requiresImmediateResponse={immediate}
                      />
                      {ai?.priorityScore !== undefined && (
                        <p className="text-[11px] text-slate-400 font-mono">
                          Score: <span className="text-teal-300 font-semibold">{ai.priorityScore}/10</span>
                        </p>
                      )}
                    </div>
                  </td>

                  {/* 5. Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <StatusBadge status={incident.status} />
                  </td>

                  {/* 6. Created */}
                  <td className="py-4 px-6 text-right whitespace-nowrap text-xs text-slate-400">
                    <div className="flex items-center justify-end gap-2">
                      <div className="text-right">
                        <p className="text-slate-300">{formatDate(incident.createdAt)}</p>
                        <p className="text-[10px] text-slate-500">{formatTimeAgo(incident.createdAt)}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
