import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { IncidentFilters, IncidentStatus } from '../../types/incident';

interface IncidentFiltersProps {
  filters: IncidentFilters;
  onFilterChange: (filters: IncidentFilters) => void;
  onReset: () => void;
}

export const IncidentFiltersBar: React.FC<IncidentFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="clean-card p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
      {/* Search Input */}
      <div className="lg:col-span-2 relative">
        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by title, category, location, ID..."
          value={filters.searchQuery || ''}
          onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
          className="w-full pl-10 pr-4 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* Status Filter */}
      <div>
        <select
          value={filters.status || 'all'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: e.target.value as IncidentStatus | 'all',
            })
          }
          className="w-full px-3.5 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-violet-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* AI Severity Filter */}
      <div>
        <select
          value={filters.aiSeverity || 'all'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              aiSeverity: e.target.value as any,
            })
          }
          className="w-full px-3.5 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-violet-500"
        >
          <option value="all">All AI Severities</option>
          <option value="CRITICAL">Critical Priority</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>
      </div>

      {/* Sorting & Reset */}
      <div className="flex items-center gap-2">
        <select
          value={filters.sortBy || 'newest'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              sortBy: e.target.value as any,
            })
          }
          className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-violet-500"
        >
          <option value="newest">Sort: Newest</option>
          <option value="priority">Sort: Severity / Priority</option>
        </select>

        <button
          onClick={onReset}
          title="Reset Filters"
          className="p-2 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors flex-shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
