import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShieldAlert, Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shadow-glow-teal">
            <ShieldAlert className="w-8 h-8 text-teal-400 animate-pulse" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Verifying Admin Authorization</h2>
        <p className="text-sm text-slate-400 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
          Connecting to Firebase Security context...
        </p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
