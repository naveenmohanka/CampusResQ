import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import { useIncidents } from '../../hooks/useIncidents';
import { IncidentFilters, Incident, IncidentStatus, IncidentSeverity, IncidentCategory } from '../../types/incident';
import { IncidentFiltersBar } from '../../components/incidents/IncidentFiltersBar';
import { IncidentTable } from '../../components/incidents/IncidentTable';
import { AssignMentorModal } from '../../components/incidents/AssignMentorModal';
import { UpdateStatusModal } from '../../components/incidents/UpdateStatusModal';
import { EmptyState } from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';

export const Incidents: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<IncidentFilters>({
    status: (searchParams.get('status') as IncidentStatus) || 'all',
    severity: (searchParams.get('severity') as IncidentSeverity) || 'all',
    category: (searchParams.get('category') as IncidentCategory) || 'all',
    searchQuery: searchParams.get('q') || '',
  });

  const { incidents, loading, error } = useIncidents(filters);

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const handleFilterChange = (newFilters: IncidentFilters) => {
    setFilters(newFilters);
    const params: Record<string, string> = {};
    if (newFilters.status && newFilters.status !== 'all') params.status = newFilters.status;
    if (newFilters.severity && newFilters.severity !== 'all') params.severity = newFilters.severity;
    if (newFilters.category && newFilters.category !== 'all') params.category = newFilters.category;
    if (newFilters.searchQuery) params.q = newFilters.searchQuery;
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      severity: 'all',
      category: 'all',
      searchQuery: '',
    });
    setSearchParams({});
  };

  const exportCSV = () => {
    if (incidents.length === 0) return;
    const headers = ['ID', 'Title', 'Category', 'Severity', 'Status', 'Location', 'Reporter', 'Assigned Mentor', 'Created At'];
    const rows = incidents.map(i => [
      i.id,
      `"${i.title.replace(/"/g, '""')}"`,
      i.category,
      i.severity,
      i.status,
      `"${i.location.address.replace(/"/g, '""')}"`,
      `"${i.reporterName}"`,
      `"${i.assignedToName || 'Unassigned'}"`,
      i.createdAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `campusresq-incidents-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Incident Management
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-400 font-mono border border-slate-700">
              {incidents.length} Records
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Search, filter, assign mentors, and track emergency resolutions in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={exportCSV}
            icon={<Download className="w-4 h-4" />}
            disabled={incidents.length === 0}
          >
            Export CSV
          </Button>
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
          <TableSkeleton rows={6} cols={7} />
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-200 text-center">
          <p className="font-semibold">Unable to load incident feed from database.</p>
          <p className="text-xs text-rose-300 mt-1">{error.message}</p>
        </div>
      ) : incidents.length === 0 ? (
        <EmptyState
          title="No Incidents Match Filter"
          description="Try modifying your search criteria or resetting filters to view all recorded incidents."
          action={
            <Button variant="secondary" size="sm" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          }
        />
      ) : (
        <IncidentTable
          incidents={incidents}
          onAssignMentor={(inc) => {
            setSelectedIncident(inc);
            setAssignModalOpen(true);
          }}
          onUpdateStatus={(inc) => {
            setSelectedIncident(inc);
            setStatusModalOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <AssignMentorModal
        incident={selectedIncident}
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setSelectedIncident(null);
        }}
      />

      <UpdateStatusModal
        incident={selectedIncident}
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedIncident(null);
        }}
      />
    </div>
  );
};
