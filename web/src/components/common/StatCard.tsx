import React, { ReactNode } from 'react';

export interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral' | 'urgent';
  accent?: 'red' | 'amber' | 'emerald' | 'cyan' | 'teal' | 'purple' | 'slate';
  accentColor?: string;
  loading?: boolean;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendType = 'neutral',
  accent = 'cyan',
  accentColor,
  loading = false,
  onClick,
}) => {
  const chosenAccent = (accentColor as any) || accent;

  const iconBg = {
    red: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    cyan: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20',
    teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20',
    purple: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20',
    slate: 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700',
  }[chosenAccent as string] || 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20';

  if (loading) {
    return (
      <div className="clean-card p-5 rounded-2xl animate-pulse">
        <div className="h-4 bg-[var(--border-color)] rounded w-1/3 mb-3"></div>
        <div className="h-8 bg-[var(--border-color)] rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`clean-card p-5 rounded-2xl transition-all duration-150 group ${
        onClick ? 'cursor-pointer hover:border-violet-500/50 hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">{title}</p>
          <p className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          {icon}
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-xs">
          {subtitle && <span className="text-[var(--text-muted)]">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trendType === 'urgent'
                  ? 'text-red-600 dark:text-red-400'
                  : trendType === 'positive'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trendType === 'negative'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-[var(--text-muted)]'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
