import { IncidentSeverity, IncidentStatus, IncidentCategory } from '../types/incident';
import { UserRole } from '../types/user';

export function getSeverityColor(severity: IncidentSeverity): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  dot: string;
} {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/30',
        badge: 'bg-red-500/20 text-red-300 border-red-500/40',
        dot: 'bg-red-500 animate-pulse',
      };
    case 'high':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
        dot: 'bg-orange-500',
      };
    case 'medium':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        dot: 'bg-amber-500',
      };
    case 'low':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        dot: 'bg-blue-500',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
        dot: 'bg-slate-500',
      };
  }
}

export function getStatusColor(status: IncidentStatus): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  dot: string;
} {
  switch (status) {
    case 'reported':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        dot: 'bg-rose-500 animate-ping',
      };
    case 'assigned':
      return {
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-400',
        border: 'border-indigo-500/30',
        badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        dot: 'bg-indigo-500',
      };
    case 'in_progress':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        dot: 'bg-amber-500 animate-pulse',
      };
    case 'resolved':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        dot: 'bg-emerald-500',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        badge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
        dot: 'bg-slate-500',
      };
  }
}

export function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case 'admin':
      return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    case 'mentor':
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    case 'student':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
  }
}

export function getCategoryColor(category: IncidentCategory | string): string {
  switch (category) {
    case 'medical':
      return 'bg-red-950/60 text-red-300 border-red-700/60';
    case 'fire':
      return 'bg-orange-950/60 text-orange-300 border-orange-700/60';
    case 'security':
      return 'bg-blue-950/60 text-blue-300 border-blue-700/60';
    case 'facility':
      return 'bg-slate-800 text-slate-300 border-slate-700';
    case 'ragging':
    case 'harassment':
      return 'bg-purple-950/60 text-purple-300 border-purple-700/60';
    default:
      return 'bg-slate-800 text-teal-300 border-slate-700';
  }
}

export function formatCategory(category: IncidentCategory | string): string {
  if (!category) return 'General';
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatStatus(status: IncidentStatus | string): string {
  switch (status) {
    case 'reported': return 'Reported';
    case 'assigned': return 'Assigned';
    case 'in_progress': return 'In Progress';
    case 'resolved': return 'Resolved';
    default: return status || 'Unknown';
  }
}

export function truncateText(text: string, maxLength: number = 60): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
