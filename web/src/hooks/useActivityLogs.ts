import { useState, useEffect } from 'react';
import { ActivityLog, ActivityFilters } from '../types/activity';
import { subscribeToActivityLogs } from '../services/activityService';

export function useActivityLogs(filters?: ActivityFilters) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const filterKey = JSON.stringify(filters || {});

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToActivityLogs(
      (items, isLoading, err) => {
        setLogs(items);
        setLoading(isLoading);
        setError(err);
      },
      filters
    );

    return () => {
      unsubscribe();
    };
  }, [filterKey]);

  return {
    logs,
    loading,
    error,
  };
}
