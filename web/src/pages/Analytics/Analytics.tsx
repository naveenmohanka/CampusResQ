import React from 'react';
import { useIntelligence } from '../../hooks/useIntelligence';
import { StatCard } from '../../components/common/StatCard';
import {
  Clock,
  ShieldCheck,
  Flame,
  Activity,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import { formatDate } from '../../utils/dateUtils';
import { CategoryBadge } from '../../components/common/Badge';
import { IncidentCategory } from '../../types/incident';

export const AnalyticsPage: React.FC = () => {
  const { intelligence, loading } = useIntelligence();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Campus Safety Intelligence & SLA Analytics
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 font-mono border border-teal-500/30">
            Module 3
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Algorithmic analysis of repeated campus emergency hotspots, dispatch response latencies, and resolution efficiency.
        </p>
      </div>

      {/* KPI Intelligence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Dispatch Time"
          value={`${intelligence.avgResponseTimeMinutes} min`}
          subtitle="Incident report to responder assignment"
          icon={<Clock className="w-5 h-5" />}
          accentColor="teal"
          loading={loading}
        />
        <StatCard
          title="Median Response Latency"
          value={`${intelligence.medianResponseTimeMinutes} min`}
          subtitle="50th percentile dispatch speed"
          icon={<Activity className="w-5 h-5" />}
          accentColor="cyan"
          loading={loading}
        />
        <StatCard
          title="Target SLA Compliance"
          value={`${intelligence.slaComplianceRate}%`}
          subtitle="Dispatched within 15 min SLA"
          icon={<ShieldCheck className="w-5 h-5" />}
          accentColor="emerald"
          loading={loading}
        />
        <StatCard
          title="Primary Incident Hotspot"
          value={intelligence.topHotspot}
          subtitle={`${intelligence.hotspots[0]?.incidentCount || 0} total cases recorded`}
          icon={<Flame className="w-5 h-5" />}
          accentColor="amber"
          loading={loading}
        />
      </div>

      {/* SLA Calculation Formula Box */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Mathematical SLA & Response Time Formulation:</p>
          <p className="text-slate-400 font-mono text-[11px]">
            Response Time (T_resp) = Timestamp(assignedAt) - Timestamp(createdAt) | Target SLA: T_resp &le; 15 minutes
          </p>
          <p className="text-slate-500 text-[11px]">
            All response metrics are computed directly from authentic Firestore document timestamps across the emergency lifecycle.
          </p>
        </div>
      </div>

      {/* Section 1: Repeated Incident Hotspots */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Repeated Incident Hotspots</h3>
              <p className="text-xs text-slate-400">Campus buildings and zones ranked by emergency recurrence</p>
            </div>
          </div>
        </div>

        {intelligence.hotspots.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            Not enough historical data to identify repeated patterns.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Campus Building / Location</th>
                  <th className="py-3 px-4 text-center">Total Incidents</th>
                  <th className="py-3 px-4 text-center">Critical Emergencies</th>
                  <th className="py-3 px-4">Primary Category</th>
                  <th className="py-3 px-4 text-right">Latest Incident</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {intelligence.hotspots.map((spot, idx) => (
                  <tr key={spot.building} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-teal-400 font-mono text-[10px] flex items-center justify-center font-bold">
                        #{idx + 1}
                      </span>
                      {spot.building}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                      {spot.incidentCount}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      {spot.criticalCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800/60">
                          {spot.criticalCount} Critical
                        </span>
                      ) : (
                        <span className="text-slate-500">0</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <CategoryBadge category={spot.primaryCategory as IncidentCategory} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                      {formatDate(spot.mostRecentIncident)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Response Time by Category & Severity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Response Times */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="font-bold text-white text-base">Avg Response Time by Category</h3>
              <p className="text-xs text-slate-400">Dispatch speed (in minutes) across emergency types</p>
            </div>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intelligence.responseTimeByCategory} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="m" />
                <YAxis dataKey="category" type="category" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} min`, 'Avg Dispatch Time']}
                />
                <Bar dataKey="avgMinutes" fill="#14b8a6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Response Times */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-white text-base">Response Time by Threat Severity</h3>
              <p className="text-xs text-slate-400">Comparing SLA dispatch speed against severity levels</p>
            </div>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intelligence.responseTimeBySeverity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="severity" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} unit="m" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} min`, 'Avg Dispatch Time']}
                />
                <Bar dataKey="avgMinutes" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section 3: 7-Day Volume Trend */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-400" />
          <div>
            <h3 className="font-bold text-white text-base">Campus Incident & Resolution Volume Trend</h3>
            <p className="text-xs text-slate-400">Daily reported emergencies versus successfully resolved cases</p>
          </div>
        </div>

        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={intelligence.volumeTrend}>
              <defs>
                <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="reported" stroke="#ef4444" fillOpacity={1} fill="url(#colorReported)" name="Reported Incidents" />
              <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" name="Resolved Cases" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
