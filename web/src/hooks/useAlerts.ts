import { useState, useEffect } from 'react';
import { CampusAlert } from '../types/alert';
import { subscribeToActiveAlerts } from '../services/alertService';

export function useAlerts(activeOnly: boolean = false) {
  const [alerts, setAlerts] = useState<CampusAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToActiveAlerts((data, isLoading, err) => {
      setAlerts(data);
      setLoading(isLoading);
      setError(err);
    }, activeOnly);

    return () => {
      unsubscribe();
    };
  }, [activeOnly]);

  return { alerts, loading, error };
}
