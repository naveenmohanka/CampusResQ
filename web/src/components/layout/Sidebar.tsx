import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  History,
  Settings,
  LogOut,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useIncidents } from '../../hooks/useIncidents';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const { stats } = useIncidents();
  const navigate = useNavigate();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      badge: null,
    },
    {
      to: '/incidents',
      label: 'Incidents',
      icon: <ShieldAlert className="w-5 h-5" />,
      badge: stats.active > 0 ? stats.active : null,
      badgeColor: stats.critical > 0 ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-500/20 text-teal-300 border border-teal-500/40',
    },
    {
      to: '/users',
      label: 'Users & Mentors',
      icon: <Users className="w-5 h-5" />,
      badge: null,
    },
    {
      to: '/activity-logs',
      label: 'Activity Logs',
      icon: <History className="w-5 h-5" />,
      badge: null,
    },
    {
      to: '/settings',
      label: 'Settings & Config',
      icon: <Settings className="w-5 h-5" />,
      badge: null,
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 z-30 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900/95 border-r border-slate-800/80 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-slate-950 font-black shadow-glow-teal">
              <Radio className="w-5 h-5 text-slate-950 animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                CampusResQ
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 font-mono border border-teal-500/30">
                  ADMIN
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Emergency Ops Center</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Navigation</p>
          </div>

          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 group ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400 group-hover:text-teal-400 transition-colors">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold font-mono ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Live Broadcast Pulse Card */}
        <div className="p-4 mx-3 mb-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Feed
            </span>
            <span className="text-slate-500 font-mono text-[10px]">v1.0.0</span>
          </div>
          <p className="text-xs text-slate-400 leading-snug">
            Listening for student SOS dispatches across campus sectors.
          </p>
        </div>

        {/* Current User & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-sm uppercase flex-shrink-0">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@campusresq.edu'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
