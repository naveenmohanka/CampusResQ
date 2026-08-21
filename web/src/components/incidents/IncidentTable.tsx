import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, ChevronRight, UserPlus, Edit3 } from 'lucide-react';
import { Incident } from '../../types/incident';
import { SeverityBadge, StatusBadge } from '../common/Badge';
import { formatCategory } from '../../utils/formatters';
import { formatTimeAgo } from '../../utils/dateUtils';
import { Button } from '../common/Button';

interface IncidentTableProps {
  incidents: Incident[];
  onAssignMentor: (incident: Incident) => void;
  onUpdateStatus: (incident: Incident) => void;
}

export const IncidentTable: React.FC<IncidentTableProps> = ({
  incidents,
  onAssignMentor,
  onUpdateStatus,
}) => {
  const navigate = useNavigate();

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-4 sm:px-6">Incident ID & Category</th>
              <th className="py-4 px-4">Title & Details</th>
              <th className="py-4 px-4">Severity</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Location</th>
              <th className="py-4 px-4">Assigned To</th>
              <th className="py-4 px-4">Reported</th>
              <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {incidents.map((incident) => (
              <tr
                key={incident.id}
                onClick={() => navigate(`/incidents/${incident.id}`)}
                className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
              >
                {/* ID & Category */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-semibold text-teal-400 group-hover:text-teal-300">
                      {incident.id}
                    </span>
                    <p className="text-xs text-slate-400 font-medium">
                      {formatCategory(incident.category)}
                    </p>
                  </div>
                </td>

                {/* Title & Description */}
                <td className="py-4 px-4 max-w-xs">
                  <div className="space-y-0.5">
                    <h4 className="font-semibold text-white group-hover:text-teal-300 transition-colors truncate">
                      {incident.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">
                      {incident.description}
                    </p>
                  </div>
                </td>

                {/* Severity */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <SeverityBadge severity={incident.severity} />
                </td>

                {/* Status */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusBadge status={incident.status} />
                </td>

                {/* Location */}
                <td className="py-4 px-4 max-w-[180px]">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                    <span className="truncate">{incident.location.address}</span>
                  </div>
                </td>

                {/* Assigned Mentor */}
                <td className="py-4 px-4 whitespace-nowrap">
                  {incident.assignedToName ? (
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-medium">{incident.assignedToName}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Unassigned
                    </span>
                  )}
                </td>

                {/* Reported Date */}
                <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-400">
                  {formatTimeAgo(incident.createdAt)}
                </td>

                {/* Actions */}
                <td
                  className="py-4 px-4 sm:px-6 text-right whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAssignMentor(incident)}
                      title="Assign Mentor"
                      className="p-1.5 text-slate-400 hover:text-teal-300 hover:bg-teal-500/10"
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdateStatus(incident)}
                      title="Update Status"
                      className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-amber-500/10"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all ml-1" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
