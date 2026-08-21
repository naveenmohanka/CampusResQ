import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 6,
}) => {
  return (
    <div className="w-full animate-pulse space-y-4">
      <div className="h-10 bg-slate-800/60 rounded-xl w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className={`h-8 bg-slate-800/40 rounded-lg ${
                j === 0 ? 'w-24' : j === 1 ? 'w-48 flex-1' : 'w-28'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-3 w-20 bg-slate-800 rounded" />
          <div className="h-7 w-16 bg-slate-700 rounded" />
        </div>
        <div className="w-10 h-10 bg-slate-800 rounded-xl" />
      </div>
      <div className="h-3 w-32 bg-slate-800/60 rounded pt-2" />
    </div>
  );
};
