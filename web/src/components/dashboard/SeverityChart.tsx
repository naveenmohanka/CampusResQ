import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Incident } from '../../types/incident';
import { getIncidentAiSeverity } from '../../utils/aiAnalysis';

export const SeverityChart: React.FC<{ incidents: Incident[] }> = ({ incidents }) => {
  const counts = incidents.reduce(
    (acc, inc) => {
      const sev = getIncidentAiSeverity(inc).toLowerCase();
      acc[sev] = (acc[sev] || 0) + 1;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 } as Record<string, number>
  );

  const data = [
    { name: 'Critical', count: counts.critical || 0, color: '#ef4444' },
    { name: 'High', count: counts.high || 0, color: '#f97316' },
    { name: 'Medium', count: counts.medium || 0, color: '#eab308' },
    { name: 'Low', count: counts.low || 0, color: '#3b82f6' },
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-white">Severity Distribution</h3>
          <p className="text-xs text-slate-400">AI threat level analysis of campus events</p>
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
