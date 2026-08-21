import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Flame } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { IncidentStats } from '../../types/incident';

export const MetricsGrid: React.FC<{ stats: IncidentStats; onCardClick?: (filter: string) => void }> = ({
  stats,
  onCardClick,
}) => {
  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Incidents"
        value={stats.total}
        subtitle="All campus logs"
        icon={<ShieldAlert className="w-5 h-5 text-teal-400" />}
        accent="cyan"
        onClick={() => onCardClick && onCardClick('all')}
      />

      <StatCard
        title="Active Incidents"
        value={stats.active}
        subtitle={`${stats.reported} reported • ${stats.inProgress} ongoing`}
        trend={stats.active > 0 ? 'Requires attention' : 'All clear'}
        trendType={stats.active > 3 ? 'urgent' : 'neutral'}
        icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
        accent="amber"
        onClick={() => onCardClick && onCardClick('active')}
      />

      <StatCard
        title="Critical Priority"
        value={stats.critical}
        subtitle="Emergency level SOS"
        trend={stats.critical > 0 ? 'IMMEDIATE RESPONSE' : 'Normal status'}
        trendType={stats.critical > 0 ? 'urgent' : 'positive'}
        icon={<Flame className="w-5 h-5 text-red-400" />}
        accent="red"
        onClick={() => onCardClick && onCardClick('critical')}
      />

      <StatCard
        title="Resolved"
        value={stats.resolved}
        subtitle={`${resolutionRate}% resolution rate`}
        trend={`${resolutionRate}% solved`}
        trendType="positive"
        icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        accent="emerald"
        onClick={() => onCardClick && onCardClick('resolved')}
      />
    </div>
  );
};
