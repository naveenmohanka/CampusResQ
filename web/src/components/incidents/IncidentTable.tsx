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
    <div className="clean-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-[var(--bg-subtle)] text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              <th className="py-4 px-6">Incident</th>
              <th className="py-4 px-4">Category</th>
              <th className="py-4 px-4">Location</th>
              <th className="py-4 px-4">Effective Severity</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-6 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-color)] text-sm">
            {incidents.map((incident) => {
              const ai = parseAiAnalysis(incident.aiAnalysis);
              const effSeverity = getEffectiveSeverity(incident);
              const immediate = isImmediateResponseRequired(incident);

              return (
                <tr
                  key={incident.id}
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                  className="hover:bg-[var(--bg-hover)] transition-colors cursor-pointer group"
                >
                  {/* 1. Incident (ID & Title) */}
                  <td className="py-4 px-6 max-w-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400">
                          #{incident.id}
                        </span>
                        {immediate && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
                            <Zap className="w-2.5 h-2.5" />
                            IMMEDIATE
                          </span>
                        )}
                        {incident.adminSeverity && (
                          <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 font-mono">
                            OVERRIDDEN
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                        {incident.title}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] truncate">
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
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                      <MapPin className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 flex-shrink-0" />
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
                        <p className="text-[11px] text-[var(--text-muted)] font-mono">
                          Score: <span className="text-violet-600 dark:text-violet-400 font-semibold">{ai.priorityScore}/10</span>
                        </p>
                      )}
                    </div>
                  </td>

                  {/* 5. Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <StatusBadge status={incident.status} />
                  </td>

                  {/* 6. Created */}
                  <td className="py-4 px-6 text-right whitespace-nowrap text-xs text-[var(--text-muted)]">
                    <div className="flex items-center justify-end gap-2">
                      <div className="text-right">
                        <p className="text-[var(--text-secondary)]">{formatDate(incident.createdAt)}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{formatTimeAgo(incident.createdAt)}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-violet-600 dark:group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" />
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
