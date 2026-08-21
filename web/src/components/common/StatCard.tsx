import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral' | 'urgent';
  accent?: 'red' | 'amber' | 'emerald' | 'cyan' | 'purple' | 'slate';
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
  onClick,
}) => {
  const accentGlow = {
    red: 'hover:border-red-500/50 group-hover:text-red-400 border-red-500/20 shadow-glow-red/20',
    amber: 'hover:border-amber-500/50 group-hover:text-amber-400 border-amber-500/20 shadow-glow-amber/20',
    emerald: 'hover:border-emerald-500/50 group-hover:text-emerald-400 border-emerald-500/20',
    cyan: 'hover:border-teal-500/50 group-hover:text-teal-400 border-teal-500/20 shadow-glow-teal/20',
    purple: 'hover:border-purple-500/50 group-hover:text-purple-400 border-purple-500/20',
    slate: 'hover:border-slate-600 border-slate-800',
  }[accent];

  const iconBg = {
    red: 'bg-red-500/10 text-red-400 border-red-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    cyan: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
  }[accent];

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-5 rounded-2xl border transition-all duration-200 group ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      } ${accentGlow}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">{title}</p>
          <p className="text-3xl font-extrabold text-white tracking-tight">{value}</p>
        </div>
        <div className={`p-3 rounded-xl border ${iconBg} transition-transform duration-200 group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold ${
                trendType === 'urgent'
                  ? 'text-red-400 animate-pulse'
                  : trendType === 'positive'
                  ? 'text-emerald-400'
                  : trendType === 'negative'
                  ? 'text-amber-400'
                  : 'text-slate-400'
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
