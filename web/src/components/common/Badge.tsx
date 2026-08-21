import React from 'react';
import { IncidentSeverity, IncidentStatus, IncidentCategory } from '../../types/incident';
import { UserRole } from '../../types/user';
import { getSeverityColor, getStatusColor, getRoleBadgeColor, formatStatus, getCategoryColor } from '../../utils/formatters';

export const SeverityBadge: React.FC<{ severity: IncidentSeverity; showDot?: boolean }> = ({
  severity,
  showDot = true,
}) => {
  const colors = getSeverityColor(severity);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${colors.badge}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />}
      {severity}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: IncidentStatus; showDot?: boolean }> = ({
  status,
  showDot = true,
}) => {
  const colors = getStatusColor(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors.badge}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />}
      {formatStatus(status)}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: IncidentCategory }> = ({ category }) => {
  const color = getCategoryColor(category);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold capitalize border ${color}`}>
      {category}
    </span>
  );
};

export const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  const color = getRoleBadgeColor(role);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold capitalize border ${color}`}>
      {role}
    </span>
  );
};
