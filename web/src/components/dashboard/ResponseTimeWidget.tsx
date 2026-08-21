import React from 'react';
import { useIntelligence } from '../../hooks/useIntelligence';
import { Clock, ShieldCheck, Flame, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResponseTimeWidget: React.FC = () => {
  const { intelligence, loading } = useIntelligence();

  return (
    <div className="clean-card p-5 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm">Response Time & Safety Intelligence</h3>
            <p className="text-[11px] text-[var(--text-muted)]">Historical analytics & SLA compliance metrics</p>
          </div>
        </div>

        <Link
          to="/analytics"
          className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
        >
          Detailed Analytics →
        </Link>
      </div>

      {loading ? (
        <div className="py-8 text-center animate-pulse">
          <div className="h-4 bg-[var(--border-color)] rounded w-1/3 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-[var(--text-muted)] uppercase">
              <Clock className="w-3 h-3" />
              <span>Avg Response</span>
            </div>
            <p className="text-xl font-bold text-[var(--text-primary)] font-mono">
              {intelligence.avgResponseTimeMinutes} min
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Campus SLA &le; 15 min</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-[var(--text-muted)] uppercase">
              <ShieldCheck className="w-3 h-3" />
              <span>SLA Rate</span>
            </div>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {intelligence.slaComplianceRate}%
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Target: 90%+</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-[var(--text-muted)] uppercase">
              <Flame className="w-3 h-3" />
              <span>Top Hotspot</span>
            </div>
            <p className="text-sm font-bold text-[var(--text-primary)] truncate">
              {intelligence.topHotspot}
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Most reports</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-[var(--text-muted)] uppercase">
              <Zap className="w-3 h-3" />
              <span>Fastest Pickup</span>
            </div>
            <p className="text-xl font-bold text-violet-600 dark:text-violet-400 font-mono">
              {intelligence.fastestResponseMinutes} min
            </p>
            <p className="text-[10px] text-[var(--text-muted)]">Best response</p>
          </div>
        </div>
      )}
    </div>
  );
};
