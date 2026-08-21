import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertTriangle, Radio, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { useNotification } from '../../context/NotificationContext';

export const Login: React.FC = () => {
  const { login, isFirebaseConfigured, error, clearError } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErr(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalErr('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      showToast({
        type: 'success',
        title: 'Authentication Verified',
        message: 'Welcome to CampusResQ Emergency Operations Center.',
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      setLocalErr(err.message || 'Login failed. Please verify admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow ambiance */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Logo and branding */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-glow-teal p-3">
            <Radio className="w-10 h-10 text-slate-950 animate-pulse" />
          </div>
        </div>

        <h2 className="text-center text-2xl font-extrabold tracking-tight text-white">
          CampusResQ Command Center
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Authorized Emergency Response & Campus Safety Portal
        </p>

        {/* Security / System Banner */}
        <div className="mt-4 mx-4 sm:mx-0 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured ? 'bg-emerald-400' : 'bg-teal-400'}`} />
            System Status:
          </span>
          <span className="font-mono text-slate-300 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            {isFirebaseConfigured ? 'Production Firestore' : 'Security Mode Active'}
          </span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl border border-slate-800/80 shadow-2xl space-y-6">
          {(localErr || error) && (
            <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-start gap-3 text-rose-200 text-xs animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Access Denied: </strong>
                <span>{localErr || error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@campusresq.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Sign In to Command Center
            </Button>
          </form>

          <div className="pt-2 text-center">
            <p className="text-[11px] text-slate-500">
              Role validation enforced: Only verified administrator accounts can access the emergency console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
