import React from 'react';
import { IncidentStatus, IncidentCategory } from '../../types/incident';
import { UserRole, ResponderApprovalStatus } from '../../types/user';
import {
  getAiSeverityColor,
  getStatusColor,
  formatStatus,
  getCategoryColor,
  getRoleColor,
  formatRole,
  getResponderApprovalColor,
  formatApprovalStatus
} from '../../utils/formatters';

export const AiSeverityBadge: React.FC<{
  severity: string;
  showDot?: boolean;
  requiresImmediateResponse?: boolean;
}> = ({
  severity,
  showDot = true,
  requiresImmediateResponse = false,
}) => {
  const colors = getAiSeverityColor(severity);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${colors.badge} ${
        requiresImmediateResponse ? 'animate-pulse ring-1 ring-red-500' : ''
      }`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />}
      {severity || 'MEDIUM'}
      {requiresImmediateResponse && <span className="text-[10px] text-red-300 font-extrabold ml-0.5">⚡</span>}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: IncidentStatus | string; showDot?: boolean }> = ({
  status,
  showDot = true,
}) => {
  const colors = getStatusColor(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors.badge}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />}
      {formatStatus(status)}
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: IncidentCategory | string }> = ({ category }) => {
  const color = getCategoryColor(category);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold capitalize border ${color}`}>
      {category}
    </span>
  );
};

export const RoleBadge: React.FC<{ role: UserRole | string }> = ({ role }) => {
  const color = getRoleColor(role);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider border ${color}`}>
      {formatRole(role)}
    </span>
  );
};

export const ResponderApprovalBadge: React.FC<{
  status?: ResponderApprovalStatus | string;
  showDot?: boolean;
}> = ({ status, showDot = true }) => {
  const colors = getResponderApprovalColor(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border ${colors.badge}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />}
      {formatApprovalStatus(status)}
    </span>
  );
};
