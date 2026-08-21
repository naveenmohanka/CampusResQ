import React from 'react';
import { Database } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const SettingsPage: React.FC = () => {
  const { user, isFirebaseConfigured } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          System Settings & Cloud Configuration
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review Firebase connectivity, role security rules, and emergency dispatch parameters.
        </p>
      </div>

      {/* Firebase Status Diagnostic */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Firebase Web Connectivity</h3>
              <p className="text-xs text-slate-400">Shared Backend with CampusResQ Android Application</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              isFirebaseConfigured
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
            }`}
          >
            {isFirebaseConfigured ? 'LIVE FIRESTORE CONNECTED' : 'DEMO / LOCAL SIMULATION'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 font-mono text-[11px]">PROJECT ID</span>
            <p className="font-semibold text-white font-mono">campusresq-29f13</p>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 font-mono text-[11px]">STORAGE BUCKET</span>
            <p className="font-semibold text-white font-mono">campusresq-29f13.firebasestorage.app</p>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 font-mono text-[11px]">AUTH DOMAIN</span>
            <p className="font-semibold text-white font-mono">campusresq-29f13.firebaseapp.com</p>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 font-mono text-[11px]">SECURITY CONTRACT</span>
            <p className="font-semibold text-teal-400 font-mono">Role-Based Access (Admin Enforced)</p>
          </div>
        </div>
      </div>

      {/* Admin Profile Details */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
          Admin Operator Profile
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-slate-500">Full Name</span>
            <p className="text-sm font-semibold text-white mt-0.5">{user?.name}</p>
          </div>
          <div>
            <span className="text-slate-500">Security Role</span>
            <p className="text-sm font-semibold text-purple-300 uppercase mt-0.5">{user?.role}</p>
          </div>
          <div>
            <span className="text-slate-500">Authorized Email</span>
            <p className="text-sm font-semibold text-white mt-0.5">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Emergency Hotline Directory */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
          Campus Emergency Quick Dispatch Directory
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <p className="font-bold text-red-400">Campus Ambulance / Health Center</p>
            <p className="font-mono text-sm text-white mt-1">+91 674 2725111</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <p className="font-bold text-teal-400">Campus Security Main Control</p>
            <p className="font-mono text-sm text-white mt-1">+91 674 2725222</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <p className="font-bold text-amber-400">Anti-Ragging Squad Hotline</p>
            <p className="font-mono text-sm text-white mt-1">1800 180 5522</p>
          </div>
        </div>
      </div>
    </div>
  );
};
