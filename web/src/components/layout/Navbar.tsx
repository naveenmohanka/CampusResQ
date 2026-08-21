import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useIncidents } from '../../hooks/useIncidents';
import {
  Menu,
  LogOut,
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
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              isFirebaseConfigured
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-teal-500/10 text-teal-400 border-teal-500/30'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isFirebaseConfigured ? 'bg-emerald-400 animate-ping' : 'bg-teal-400'
              }`}
            />
            {isFirebaseConfigured ? 'Live Cloud Sync' : 'Demo Mode'}
          </span>

          {stats.criticalHigh > 0 && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse">
              <Zap className="w-3.5 h-3.5" />
              <span>{stats.criticalHigh} Critical / High Priority</span>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Admin Profile & Logout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-xs uppercase">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-[10px] text-teal-400 font-mono leading-tight flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" />
              Security Admin
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          icon={<LogOut className="w-4 h-4" />}
          className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
        >
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
};
