import { useState, useEffect } from 'react';
import { Incident, IncidentFilters, IncidentStats } from '../types/incident';
import { subscribeToIncidents, calculateIncidentStats } from '../services/incidentService';

export function useIncidents(filters?: IncidentFilters) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToIncidents((data, isLoading, err) => {
      setIncidents(data);
      setLoading(isLoading);
      setError(err);
    }, filters);

    return () => {
      unsubscribe();
    };
  }, [filters?.status, filters?.aiSeverity, filters?.category, filters?.searchQuery, filters?.sortBy]);

  const stats: IncidentStats = calculateIncidentStats(incidents);

  return { incidents, stats, loading, error };
}
