import { IncidentStatus, IncidentCategory } from '../types/incident';

export function getAiSeverityColor(severity: string): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  dot: string;
} {
  const upper = (severity || 'MEDIUM').toUpperCase().trim();
  switch (upper) {
    case 'CRITICAL':
      return {
        bg: 'bg-red-500/10',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-500/30',
        badge: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30 font-bold',
        dot: 'bg-red-500 animate-pulse',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-500/30',
        badge: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30 font-bold',
        dot: 'bg-orange-500',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-500/30',
        badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold',
        dot: 'bg-amber-500',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold',
        dot: 'bg-emerald-500',
      };
  }
}

export function getStatusColor(status: IncidentStatus | string): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  dot: string;
} {
  const lower = (status || 'pending').toLowerCase();
  switch (lower) {
    case 'pending':
    case 'reported':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-500/30',
        badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
        dot: 'bg-rose-500 animate-ping',
      };
    case 'accepted':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-500/30',
        badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
        dot: 'bg-blue-500',
      };
    case 'in_progress':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-500/30',
        badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
        dot: 'bg-amber-500 animate-pulse',
      };
    case 'resolved':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
        dot: 'bg-emerald-500',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-700 dark:text-slate-400',
        border: 'border-slate-500/30',
        badge: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30',
        dot: 'bg-slate-500',
      };
  }
}

export function getCategoryColor(category: IncidentCategory | string): string {
  const lower = (category || 'other').toLowerCase();
  switch (lower) {
    case 'medical':
      return 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20';
    case 'fire':
      return 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20';
    case 'security':
      return 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20';
    case 'facility':
      return 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20';
    case 'ragging':
    case 'harassment':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20';
    default:
      return 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20';
  }
}

export function formatCategory(category: IncidentCategory | string): string {
  if (!category) return 'General';
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatStatus(status: IncidentStatus | string): string {
  const lower = (status || 'pending').toLowerCase();
  switch (lower) {
    case 'pending': return 'Pending';
    case 'reported': return 'Pending (Reported)';
    case 'accepted': return 'Accepted';
    case 'in_progress': return 'In Progress';
    case 'resolved': return 'Resolved';
    default: return status || 'Unknown';
  }
}
