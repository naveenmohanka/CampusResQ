import { useState, useEffect, useMemo } from 'react';
import { Incident, IncidentFilters, IncidentStats } from '../types/incident';
import { subscribeToIncidents } from '../services/incidentService';

export function useIncidents(filters?: IncidentFilters) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Stringify filters to prevent effect thrashing
  const filterKey = JSON.stringify(filters || {});

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToIncidents(
      (items, isLoading, err) => {
        setIncidents(items);
        setLoading(isLoading);
        setError(err);
      },
      filters
    );

    return () => {
      unsubscribe();
    };
  }, [filterKey]);

  const stats: IncidentStats = useMemo(() => {
    const total = incidents.length;
    let active = 0;
    let resolved = 0;
    let critical = 0;
    let reported = 0;
    let assigned = 0;
    let inProgress = 0;

    incidents.forEach((inc) => {
      if (inc.status === 'resolved') {
        resolved++;
      } else {
        active++;
      }

      if (inc.severity === 'critical') {
        critical++;
      }

      if (inc.status === 'reported') reported++;
      if (inc.status === 'assigned') assigned++;
      if (inc.status === 'in_progress') inProgress++;
    });

    return {
      total,
      active,
      resolved,
      critical,
      reported,
      assigned,
      inProgress,
    };
  }, [incidents]);

  return {
    incidents,
    stats,
    loading,
    error,
  };
}
