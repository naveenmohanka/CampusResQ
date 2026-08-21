import React from 'react';
import { useIncidents } from '../../hooks/useIncidents';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { getIncidentAiSeverity } from '../../utils/aiAnalysis';
import { formatCategory,  } from '../../utils/formatters';
import { BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

const SEVERITY_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#f59e0b',
  LOW: '#14b8a6',
};

const STATUS_COLORS = {
  Pending: '#f43f5e',
  Accepted: '#3b82f6',
  'In Progress': '#f59e0b',
  Resolved: '#10b981',
};

const CATEGORY_PALETTE = ['#14b8a6', '#38bdf8', '#818cf8', '#a855f7', '#ec4899', '#f59e0b', '#64748b'];

export const AnalyticsPage: React.FC = () => {
  const { incidents, loading } = useIncidents();

  // Chart 1: Incidents by Category
  const categoryMap: Record<string, number> = {};
  incidents.forEach((inc) => {
    const cat = formatCategory(inc.category);
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap).map(([category, count]) => ({
    category,
    count,
  }));

  // Chart 2: Incidents by AI Severity
  const severityMap: Record<string, number> = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  };
  incidents.forEach((inc) => {
    const sev = getIncidentAiSeverity(inc);
    severityMap[sev] = (severityMap[sev] || 0) + 1;
  });
  const severityData = Object.entries(severityMap).map(([severity, count]) => ({
    severity,
    count,
  }));

  // Chart 3: Incidents by Status
  const statusMap: Record<string, number> = {
    Pending: 0,
    Accepted: 0,
    'In Progress': 0,
    Resolved: 0,
  };
  incidents.forEach((inc) => {
    const rawStatus = (inc.status || 'pending').toLowerCase();
    if (rawStatus === 'pending' || rawStatus === 'reported') statusMap['Pending']++;
    else if (rawStatus === 'accepted') statusMap['Accepted']++;
    else if (rawStatus === 'in_progress') statusMap['In Progress']++;
    else if (rawStatus === 'resolved') statusMap['Resolved']++;
  });
  const statusData = Object.entries(statusMap).map(([status, count]) => ({
    status,
    count,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Emergency Operations Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          High-level operational overview across incident categories, AI triage severity, and status progression.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Incidents by Category */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Incidents by Category</h3>
                <p className="text-[11px] text-slate-400">Distribution across emergency types</p>
              </div>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis dataKey="category" type="category" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} width={90} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#14b8a6" radius={[0, 6, 6, 0]}>
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_PALETTE[index % CATEGORY_PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Incidents by AI Severity */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <PieChartIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Incidents by AI Severity</h3>
                <p className="text-[11px] text-slate-400">AI Priority & Threat Assessment</p>
              </div>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="severity" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {severityData.map((entry) => (
                      <Cell
                        key={`cell-${entry.severity}`}
                        fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS] || '#14b8a6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Incidents by Status */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Incidents by Status</h3>
                <p className="text-[11px] text-slate-400">Operational workflow progression</p>
              </div>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="status" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {statusData.map((entry) => (
                      <Cell
                        key={`cell-${entry.status}`}
                        fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || '#14b8a6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
