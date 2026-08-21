import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  BarChart3,
  Users,
  Shield,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { useIncidents } from '../../hooks/useIncidents';
import { useUsers } from '../../hooks/useUsers';
import { useTheme } from '../../hooks/useTheme';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { stats } = useIncidents();
  const { users } = useUsers();
  const { theme, setTheme } = useTheme();

  const pendingResponderRequests = users.filter(
    (u) => u.responderApprovalStatus === 'pending'
  ).length;

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
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      badge: pendingResponderRequests > 0 ? pendingResponderRequests : undefined,
      badgeVariant: 'warning',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 border-r flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 bg-[var(--bg-sidebar)] border-[var(--border-color)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center p-1.5 text-white">
              <Shield className="w-full h-full stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight leading-none text-[var(--text-primary)]">
                CampusResQ
              </h1>
              <p className="text-[10px] text-violet-600 dark:text-violet-400 font-mono font-semibold tracking-wider mt-0.5 uppercase">
                Admin Command
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-4 px-3 space-y-1.5">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold nav-link-hover ${
                  isActive
                    ? 'bg-[var(--nav-active-bg)] text-[var(--nav-active-text)] shadow-sm'
                    : 'text-[var(--nav-inactive-text)] hover:text-[var(--text-primary)] hover:bg-[var(--nav-hover-bg)] dark:hover:bg-[#141418] hover:shadow-[var(--nav-hover-shadow)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-4 h-4 ${
                        isActive
                          ? 'text-[var(--nav-active-icon)]'
                          : 'text-[var(--text-muted)]'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive
                          ? 'bg-black/20 text-white dark:bg-black/30 dark:text-slate-900'
                          : item.badgeVariant === 'critical'
                          ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
                          : item.badgeVariant === 'warning'
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30'
                          : 'bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border border-slate-300 dark:border-neutral-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* Theme Toggle - Directly below navigation tabs */}
          <div className="pt-3 mt-3 border-t border-[var(--border-color)]">
            <div className="px-1 mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Theme
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold theme-toggle-btn ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>Light</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold theme-toggle-btn ${
                  theme === 'dark'
                    ? 'bg-[#1e1e24] text-white shadow-sm border border-[#2e2e36] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-violet-400" />
                <span>Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* System Monitoring Gateway Footer */}
        <div className="p-3.5 border-t border-[var(--border-color)]">
          <div className="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[var(--text-muted)]">Monitoring Gateway</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                ONLINE
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-mono">
              Realtime Firestore Sync
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
