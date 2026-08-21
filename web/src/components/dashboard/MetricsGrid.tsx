import React from 'react';
import { AlertCircle, Clock, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { IncidentStats } from '../../types/incident';

interface MetricsGridProps {
  stats: IncidentStats;
  onCardClick?: (filter: string) => void;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ stats, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Incidents */}
      <StatCard
        title="Total Incidents"
        value={stats.total}
        subtitle="All Reported Cases"
        icon={<AlertCircle className="w-5 h-5" />}
        accent="cyan"
        onClick={() => onCardClick?.('all')}
      />

      {/* 2. Pending */}
      <StatCard
        title="Pending Dispatch"
        value={stats.pending}
        subtitle="Awaiting Team Response"
        icon={<Clock className="w-5 h-5" />}
        trend={stats.pending > 0 ? `${stats.pending} Pending` : 'Clear'}
        trendType={stats.pending > 0 ? 'urgent' : 'positive'}
        accent="amber"
        onClick={() => onCardClick?.('pending')}
      />

      {/* 3. Active */}
      <StatCard
        title="Active Cases"
        value={stats.active}
        subtitle="Accepted / In Progress"
        icon={<Activity className="w-5 h-5" />}
        trend={stats.active > 0 ? `${stats.active} On-Scene` : '0 Active'}
        trendType={stats.active > 0 ? 'urgent' : 'positive'}
        accent="cyan"
        onClick={() => onCardClick?.('in_progress')}
      />

      {/* 4. Resolved */}
      <StatCard
        title="Resolved"
        value={stats.resolved}
        subtitle="Closed Successfully"
        icon={<CheckCircle2 className="w-5 h-5" />}
        trend={stats.total > 0 ? `${Math.round((stats.resolved / stats.total) * 100)}% Rate` : '100%'}
        trendType="positive"
        accent="emerald"
        onClick={() => onCardClick?.('resolved')}
      />

      {/* 5. Critical / High Priority (AI Source) */}
      <StatCard
        title="Critical / High"
        value={stats.criticalHigh}
        subtitle="AI Priority Assessment"
        icon={<ShieldAlert className="w-5 h-5" />}
        trend={stats.criticalHigh > 0 ? 'Urgent Response Needed' : '0 Life Threats'}
        trendType={stats.criticalHigh > 0 ? 'urgent' : 'positive'}
        accent="red"
        onClick={() => onCardClick?.('critical')}
      />
    </div>
  );
};
