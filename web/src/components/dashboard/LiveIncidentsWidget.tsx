import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Incident } from '../../types/incident';
import { AiSeverityBadge, StatusBadge, CategoryBadge } from '../common/Badge';
import { formatLocationString, getEffectiveSeverity, isImmediateResponseRequired, parseAiAnalysis } from '../../utils/aiAnalysis';
import { formatTimeAgo } from '../../utils/dateUtils';
import { Clock, Activity, ArrowRight, ShieldAlert, Zap } from 'lucide-react';

interface LiveIncidentsWidgetProps {
  incidents: Incident[];
}

export const LiveIncidentsWidget: React.FC<LiveIncidentsWidgetProps> = ({ incidents }) => {
  const [activeTab, setActiveTab] = useState<'critical' | 'recent' | 'active'>('critical');

  // A. Critical Incidents: effective severity == CRITICAL, requiresImmediateResponse first
  const criticalIncidents = incidents
    .filter((inc) => {
      const sev = getEffectiveSeverity(inc);
      return (sev === 'CRITICAL' || isImmediateResponseRequired(inc)) && (inc.status || '').toLowerCase() !== 'resolved';
    })
    .sort((a, b) => {
      const aImm = isImmediateResponseRequired(a) ? 1 : 0;
      const bImm = isImmediateResponseRequired(b) ? 1 : 0;
      if (bImm !== aImm) return bImm - aImm;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // B. Recent Incidents: Newest createdAt descending
  const recentIncidents = [...incidents]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // C. Active Incidents: status == accepted || status == in_progress
  const activeIncidents = incidents
    .filter((inc) => {
      const s = (inc.status || '').toLowerCase();
      return s === 'accepted' || s === 'in_progress';
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const displayedList =
    activeTab === 'critical'
      ? criticalIncidents
      : activeTab === 'active'
      ? activeIncidents
      : recentIncidents;

  return (
    <div className="clean-card p-5 rounded-2xl space-y-4">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-subtle)] rounded-xl border border-[var(--border-color)]">
          <button
            onClick={() => setActiveTab('critical')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'critical'
                ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Critical Threat Feed ({criticalIncidents.length})
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/30'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Active ({activeIncidents.length})
          </button>

          <button
            onClick={() => setActiveTab('recent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'recent'
                ? 'bg-slate-200 dark:bg-neutral-800 text-[var(--text-primary)] border border-slate-300 dark:border-neutral-700'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Recent ({recentIncidents.length})
          </button>
        </div>

        <Link
          to="/incidents"
          className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline transition-colors flex items-center gap-1 self-end sm:self-auto"
        >
          View All Incidents →
        </Link>
      </div>

      {/* Incident List */}
      {displayedList.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-[var(--border-color)] rounded-xl bg-[var(--bg-subtle)]">
          <p className="text-xs font-semibold text-[var(--text-secondary)]">
            {activeTab === 'critical'
              ? 'No active critical emergencies on campus.'
              : activeTab === 'active'
              ? 'No accepted or in-progress response team operations.'
              : 'No incidents recorded.'}
          </p>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">All monitored systems reporting normal conditions.</p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border-color)]">
          {displayedList.map((inc) => {
            const ai = parseAiAnalysis(inc.aiAnalysis);
            const effSeverity = getEffectiveSeverity(inc);
            const immediate = isImmediateResponseRequired(inc);

            return (
              <Link
                key={inc.id}
                to={`/incidents/${inc.id}`}
                className="py-3.5 px-2.5 rounded-xl hover:bg-[var(--bg-hover)] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-violet-600 dark:text-violet-400">
                      #{inc.id}
                    </span>
                    <AiSeverityBadge
                      severity={effSeverity}
                      requiresImmediateResponse={immediate}
                    />
                    <StatusBadge status={inc.status} />
                    <CategoryBadge category={inc.category} />
                    {immediate && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
                        <Zap className="w-3 h-3" />
                        IMMEDIATE ACTION
                      </span>
                    )}
                    {inc.adminSeverity && (
                      <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 font-mono">
                        OVERRIDDEN
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                    {inc.title}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span className="truncate">{formatLocationString(inc.location)}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(inc.createdAt)}</span>
                    {ai?.priorityScore !== undefined && (
                      <>
                        <span>•</span>
                        <span className="text-violet-600 dark:text-violet-400 font-mono font-semibold">Priority: {ai.priorityScore}/10</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                  <span className="text-xs font-semibold text-[var(--text-muted)] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    Details
                  </span>
                  <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
