import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types/user';
import { loginWithEmail, logoutCurrentSession, subscribeToAuthState } from '../services/firebase/auth';
import { isFirebaseConfigured } from '../services/firebase/config';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  isFirebaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((profile, isLoading) => {
      setUser(profile);
      setLoading(isLoading);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string): Promise<UserProfile> => {
    try {
      setLoading(true);
      setError(null);
      const profile = await loginWithEmail(email, pass);
      setUser(profile);
      return profile;
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await logoutCurrentSession();
      setUser(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isFirebaseConfigured,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
