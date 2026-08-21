import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertTriangle, ShieldCheck, Shield } from 'lucide-react';
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
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-primary)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo and branding */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center p-3 text-white">
            <Shield className="w-8 h-8 stroke-[2.5]" />
          </div>
        </div>

        <h2 className="text-center text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          CampusResQ Command Center
        </h2>
        <p className="mt-1 text-center text-xs text-[var(--text-muted)]">
          Authorized Emergency Response & Campus Safety Portal
        </p>

        {/* Security / System Banner */}
        <div className="mt-4 mx-4 sm:mx-0 p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-between text-xs">
          <span className="text-[var(--text-muted)] flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured ? 'bg-emerald-500' : 'bg-violet-500'}`} />
            System Status:
          </span>
          <span className="font-mono text-[var(--text-secondary)] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            {isFirebaseConfigured ? 'Production Firestore' : 'Security Mode Active'}
          </span>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="clean-card py-8 px-6 sm:px-10 rounded-2xl space-y-6">
          {(localErr || error) && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Access Denied: </strong>
                <span>{localErr || error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@campusresq.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-violet-500"
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
            <p className="text-[11px] text-[var(--text-muted)]">
              Role validation enforced: Only verified administrator accounts can access the emergency console.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
