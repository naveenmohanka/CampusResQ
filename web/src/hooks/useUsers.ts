import { useState, useEffect } from 'react';
import { UserProfile, UserFilters } from '../types/user';
import { subscribeToUsers } from '../services/userService';

export function useUsers(filters?: UserFilters) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const filterKey = JSON.stringify(filters || {});

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToUsers(
      (items, isLoading, err) => {
        setUsers(items);
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
    users,
    loading,
    error,
  };
}
