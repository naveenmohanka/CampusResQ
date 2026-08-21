import React from 'react';
import { AlertCircle, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { IncidentStats } from '../../types/incident';

interface MetricsGridProps {
  stats: IncidentStats;
  onCardClick?: (filter: string) => void;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ stats, onCardClick }) => {
  const resolutionRate = stats.total > 0
    ? Math.round((stats.resolved / stats.total) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Incidents"
        value={stats.total}
        subtitle="Campus Lifetime Reports"
        icon={<AlertCircle className="w-6 h-6" />}
        accent="cyan"
        onClick={() => onCardClick?.('all')}
      />

      <StatCard
        title="Active Incidents"
        value={stats.active}
        subtitle="Unresolved Emergencies"
        icon={<AlertTriangle className="w-6 h-6" />}
        trend={stats.active > 0 ? `${stats.active} Pending Dispatch` : 'All Clear'}
        trendType={stats.active > 0 ? 'urgent' : 'positive'}
        accent="amber"
        onClick={() => onCardClick?.('in_progress')}
      />

      <StatCard
        title="Critical Threats"
        value={stats.critical}
        subtitle="Life Safety Priority"
        icon={<ShieldCheck className="w-6 h-6" />}
        trend={stats.critical > 0 ? 'Urgent Action Required' : '0 Life Threats'}
        trendType={stats.critical > 0 ? 'urgent' : 'positive'}
        accent="red"
        onClick={() => onCardClick?.('critical')}
      />

      <StatCard
        title="Resolved Cases"
        value={stats.resolved}
        subtitle={`${resolutionRate}% Overall Resolution Rate`}
        icon={<CheckCircle2 className="w-6 h-6" />}
        trend={`${resolutionRate}% Success`}
        trendType="positive"
        accent="emerald"
        onClick={() => onCardClick?.('resolved')}
      />
    </div>
  );
};
