import React from 'react';
import { useIncidents } from '../../hooks/useIncidents';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { getEffectiveSeverity } from '../../utils/aiAnalysis';
import { Tag, ShieldAlert, TrendingUp } from 'lucide-react';

const SEVERITY_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#f59e0b',
  LOW: '#14b8a6',
};

const CATEGORY_COLORS = {
  Medical: '#14b8a6',
  Fire: '#ef4444',
  Security: '#818cf8',
  Facility: '#38bdf8',
  Harassment: '#ec4899',
  Other: '#94a3b8',
};

export const AnalyticsPage: React.FC = () => {
  const { incidents, loading } = useIncidents();

  // 7-day chronological sequence
  const dayKeys: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    dayKeys.push(key);
  }

  // -------------------------------------------------------------
  // Chart 1: Incidents by Category (LINE CHART)
  // -------------------------------------------------------------
  const categoryDayMap: Record<string, Record<string, number>> = {};
  dayKeys.forEach((key) => {
    categoryDayMap[key] = {
      Medical: 0,
      Fire: 0,
      Security: 0,
      Facility: 0,
      Harassment: 0,
      Other: 0,
    };
  });

  incidents.forEach((inc) => {
    if (!inc.createdAt) return;
    const d = new Date(inc.createdAt);
    const key = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (categoryDayMap[key]) {
      const rawCat = (inc.category || '').toLowerCase();
      let catKey = 'Other';
      if (rawCat.includes('med')) catKey = 'Medical';
      else if (rawCat.includes('fire')) catKey = 'Fire';
      else if (rawCat.includes('sec') || rawCat.includes('rag')) catKey = 'Security';
      else if (rawCat.includes('fac') || rawCat.includes('infra')) catKey = 'Facility';
      else if (rawCat.includes('harass')) catKey = 'Harassment';

      categoryDayMap[key][catKey] = (categoryDayMap[key][catKey] || 0) + 1;
    }
  });

  const categoryTrendData = dayKeys.map((date) => ({
    date,
    ...categoryDayMap[date],
  }));

  // -------------------------------------------------------------
  // Chart 2: Incidents by Severity (LINE CHART)
  // -------------------------------------------------------------
  const severityDayMap: Record<string, { CRITICAL: number; HIGH: number; MEDIUM: number; LOW: number }> = {};
  dayKeys.forEach((key) => {
    severityDayMap[key] = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  });

  incidents.forEach((inc) => {
    if (!inc.createdAt) return;
    const d = new Date(inc.createdAt);
    const key = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (severityDayMap[key]) {
      const effSev = getEffectiveSeverity(inc);
      if (severityDayMap[key][effSev] !== undefined) {
        severityDayMap[key][effSev]++;
      }
    }
  });

  const severityTrendData = dayKeys.map((date) => ({
    date,
    ...severityDayMap[date],
  }));

  // -------------------------------------------------------------
  // Chart 3: Incident Trend Over Time (Overall Volume Line Chart)
  // -------------------------------------------------------------
  const totalDayMap: Record<string, number> = {};
  dayKeys.forEach((key) => {
    totalDayMap[key] = 0;
  });

  incidents.forEach((inc) => {
    if (!inc.createdAt) return;
    const d = new Date(inc.createdAt);
    const key = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    if (totalDayMap[key] !== undefined) {
      totalDayMap[key]++;
    }
  });

  const totalVolumeData = dayKeys.map((date) => ({
    date,
    incidentCount: totalDayMap[date] || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Emergency Operations Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Real-time incident trends across categories, effective severity triage, and total incident volume progression.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Incidents by Category (LINE CHART) */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Incidents by Category</h3>
                <p className="text-[11px] text-slate-400">Incident volume trends across categories over time</p>
              </div>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={categoryTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="Medical" stroke={CATEGORY_COLORS.Medical} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Fire" stroke={CATEGORY_COLORS.Fire} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Security" stroke={CATEGORY_COLORS.Security} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Facility" stroke={CATEGORY_COLORS.Facility} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Other" stroke={CATEGORY_COLORS.Other} strokeWidth={2} dot={{ r: 3 }} strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Incidents by Severity (LINE CHART) */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Incidents by Severity</h3>
                <p className="text-[11px] text-slate-400">Incident severity trends over time</p>
              </div>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={severityTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="CRITICAL" stroke={SEVERITY_COLORS.CRITICAL} strokeWidth={2.5} dot={{ r: 3.5 }} />
                  <Line type="monotone" dataKey="HIGH" stroke={SEVERITY_COLORS.HIGH} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="MEDIUM" stroke={SEVERITY_COLORS.MEDIUM} strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="LOW" stroke={SEVERITY_COLORS.LOW} strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Incident Trend Over Time (LINE CHART) */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Incident Trend Over Time</h3>
                <p className="text-[11px] text-slate-400">Total daily incident volume progression</p>
              </div>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={totalVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                    formatter={(val: any) => [`${val} Incidents`, 'Total Incidents']}
                  />
                  <Line
                    type="monotone"
                    dataKey="incidentCount"
                    stroke="#14b8a6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#14b8a6', stroke: '#0f172a', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#2dd4bf', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
