import { useMemo } from 'react';
import { useIncidents } from './useIncidents';
import { computeCampusIntelligence } from '../services/analyticsService';
import { IntelligenceSummary } from '../types/analytics';

export function useIntelligence(): {
  intelligence: IntelligenceSummary;
  loading: boolean;
  error: Error | null;
} {
  const { incidents, loading, error } = useIncidents();

  const intelligence = useMemo(() => {
    return computeCampusIntelligence(incidents);
  }, [incidents]);

  return { intelligence, loading, error };
}
