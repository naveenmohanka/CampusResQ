import React from 'react';
import { Menu, Flame } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useIncidents } from '../../hooks/useIncidents';

export const Navbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const { isFirebaseConfigured } = useAuth();
  const { stats, incidents } = useIncidents();

  const criticalIncident = incidents.find(
    (i) => i.severity === 'critical' && i.status !== 'resolved'
  );

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Mobile Toggle & Left Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Live Status indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-300">SYSTEM ACTIVE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono">
            {isFirebaseConfigured ? 'Cloud Firestore Sync' : 'Demo Mode (Offline Sim)'}
          </span>
        </div>
      </div>

      {/* Center Alert Banner if critical incident is active */}
      {criticalIncident && (
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs shadow-glow-red animate-pulse">
          <Flame className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="font-bold uppercase tracking-wider">CRITICAL ALERT:</span>
          <span className="truncate max-w-xs">{criticalIncident.title}</span>
        </div>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Quick Metrics Tag */}
          <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Active:</span>
            <span className="font-bold text-teal-400 font-mono">{stats.active}</span>
          </div>

          {stats.critical > 0 && (
            <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-red-950/60 border border-red-800/40 text-red-300">
              <span className="text-red-400 font-medium">Critical:</span>
              <span className="font-bold font-mono text-red-400">{stats.critical}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
