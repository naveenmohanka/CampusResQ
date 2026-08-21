import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useIncidents } from '../../hooks/useIncidents';
import {
  Menu,
  LogOut,
  Radio,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '../common/Button';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout, isFirebaseConfigured } = useAuth();
  const { stats } = useIncidents();

  return (
    <header className="h-16 glass-panel border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-300">Operations Status:</span>
            <span className="font-mono text-emerald-400 font-bold">READY</span>
          </div>

          {/* Mode Indicator Badge */}
          {isFirebaseConfigured ? (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Production Firestore</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-[11px] text-amber-300 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>DEMO MODE (Simulated Campus Data)</span>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Live telemetry badge, Admin profile, Logout */}
      <div className="flex items-center gap-3">
        {/* Critical alert banner if any */}
        {stats.critical > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 border border-red-500/50 text-red-300 text-xs font-bold animate-pulse shadow-glow-red">
            <Radio className="w-3.5 h-3.5 text-red-400" />
            <span>{stats.critical} CRITICAL ACTIVE</span>
          </div>
        )}

        {/* User profile dropdown info */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-mono capitalize">{user.role} Authorization</p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={logout}
              className="p-2"
              icon={<LogOut className="w-4 h-4 text-slate-400 hover:text-rose-400 transition-colors" />}
            >
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
