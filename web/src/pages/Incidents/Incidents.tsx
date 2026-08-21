import React, { useState } from 'react';
import { useIncidents } from '../../hooks/useIncidents';
import { IncidentTable } from '../../components/incidents/IncidentTable';
import { IncidentFiltersBar } from '../../components/incidents/IncidentFilters';
import { IncidentFilters } from '../../types/incident';
import { AlertCircle } from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  const [filters, setFilters] = useState<IncidentFilters>({
    status: 'all',
    aiSeverity: 'all',
    searchQuery: '',
    sortBy: 'newest',
  });

  const { incidents, loading, error } = useIncidents(filters);

  const handleReset = () => {
    setFilters({
      status: 'all',
      aiSeverity: 'all',
      searchQuery: '',
      sortBy: 'newest',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
          Incident Monitoring Feed
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
            {incidents.length} Live Records
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
          Real-time incident ingestion, AI priority classification, and campus response status.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error.message}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <IncidentFiltersBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleReset}
      />

      {/* Incidents Table / Loading state */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : incidents.length === 0 ? (
        <div className="clean-card p-12 text-center rounded-2xl space-y-3">
          <AlertCircle className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">No matching incidents found</h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
            Try adjusting your search criteria, clearing active filters, or checking back later.
          </p>
        </div>
      ) : (
        <IncidentTable incidents={incidents} />
      )}
    </div>
  );
};
