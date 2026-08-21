import React, { useState } from 'react';
import { useIncidents } from '../../hooks/useIncidents';
import { IncidentFilters } from '../../types/incident';
import { IncidentFiltersBar } from '../../components/incidents/IncidentFilters';
import { IncidentTable } from '../../components/incidents/IncidentTable';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';

export const IncidentsPage: React.FC = () => {
  const [filters, setFilters] = useState<IncidentFilters>({
    status: 'all',
    aiSeverity: 'all',
    category: 'all',
    searchQuery: '',
    sortBy: 'newest',
  });

  const { incidents, loading, error } = useIncidents(filters);

  const handleFilterChange = (newFilters: IncidentFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      aiSeverity: 'all',
      category: 'all',
      searchQuery: '',
      sortBy: 'newest',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Incident Monitoring & Live Feed
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-400 font-mono border border-slate-700">
              {incidents.length} Loaded
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Realtime Firestore incident stream, AI triage analysis, and Response Team status updates.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <IncidentFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Incident Data Table */}
      {loading ? (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <TableSkeleton rows={6} cols={6} />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-200 text-center">
          <p className="font-semibold">Unable to load incident feed from database.</p>
          <p className="text-xs text-rose-300 mt-1">{error.message}</p>
        </div>
      ) : incidents.length === 0 ? (
        <EmptyState
          title="No Incidents Match Filters"
          description="Try modifying your search query or resetting filters to view all recorded incidents."
          action={
            <Button variant="secondary" size="sm" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          }
        />
      ) : (
        <IncidentTable incidents={incidents} />
      )}
    </div>
  );
};
