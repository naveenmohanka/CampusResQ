import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  BarChart3,
  Shield,
  X
} from 'lucide-react';
import { useIncidents } from '../../hooks/useIncidents';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { stats } = useIncidents();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Incidents',
      href: '/incidents',
      icon: AlertTriangle,
      badge: stats.pending > 0 ? stats.pending : stats.active > 0 ? stats.active : undefined,
      badgeVariant: stats.criticalHigh > 0 ? 'critical' : stats.pending > 0 ? 'warning' : 'active',
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 glass-panel border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-glow-teal p-1.5">
              <Shield className="w-full h-full text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base tracking-tight leading-none">
                CampusResQ
              </h1>
              <p className="text-[10px] text-teal-400 font-mono font-semibold tracking-wider mt-0.5 uppercase">
                Admin Operations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Core Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1.5">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-glow-teal'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-teal-400' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        item.badgeVariant === 'critical'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                          : item.badgeVariant === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-800 text-teal-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* System Monitoring Footer */}
        <div className="p-3.5 border-t border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Monitoring Gateway</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Realtime Firestore Sync
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
