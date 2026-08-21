import React, { ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-dashed border-slate-800 my-4">
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-teal-400 mb-4 shadow-inner">
        {icon || <ShieldAlert className="w-10 h-10 text-slate-500" />}
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
