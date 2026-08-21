import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Incident } from '../../types/incident';

export const StatusChart: React.FC<{ incidents: Incident[] }> = ({ incidents }) => {
  const statusCounts = incidents.reduce(
    (acc, inc) => {
      acc[inc.status] = (acc[inc.status] || 0) + 1;
      return acc;
    },
    { reported: 0, assigned: 0, in_progress: 0, resolved: 0 } as Record<string, number>
  );

  const data = [
    { name: 'Reported', value: statusCounts.reported, color: '#f43f5e' },
    { name: 'Assigned', value: statusCounts.assigned, color: '#6366f1' },
    { name: 'In Progress', value: statusCounts.in_progress, color: '#f59e0b' },
    { name: 'Resolved', value: statusCounts.resolved, color: '#10b981' },
  ].filter((item) => item.value > 0);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-white">Incident Status Breakdown</h3>
          <p className="text-xs text-slate-400">Current workflow states across campus</p>
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            No incident status data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
