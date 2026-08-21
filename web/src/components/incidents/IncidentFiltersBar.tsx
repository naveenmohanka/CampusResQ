import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { IncidentFilters, IncidentStatus, IncidentSeverity, IncidentCategory } from '../../types/incident';

interface IncidentFiltersBarProps {
  filters: IncidentFilters;
  onFilterChange: (filters: IncidentFilters) => void;
  onReset: () => void;
}

export const IncidentFiltersBar: React.FC<IncidentFiltersBarProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Bar */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, location, reporter, or ID..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all"
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
            className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-500/50 transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <select
            value={filters.severity || 'all'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                severity: e.target.value as IncidentSeverity | 'all',
              })
            }
            className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-500/50 transition-all"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={filters.category || 'all'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                category: e.target.value as IncidentCategory | 'all',
              })
            }
            className="w-full px-3.5 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-teal-500/50 transition-all"
          >
            <option value="all">All Categories</option>
            <option value="medical">Medical</option>
            <option value="fire">Fire</option>
            <option value="security">Security</option>
            <option value="facility">Facility</option>
            <option value="ragging">Ragging</option>
            <option value="harassment">Harassment</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Active filters and reset */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-teal-400" />
          <span>Filter active: Results update in real-time</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
};
