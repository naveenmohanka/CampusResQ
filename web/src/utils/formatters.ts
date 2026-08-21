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
        text: 'text-red-400',
        border: 'border-red-500/30',
        badge: 'bg-red-950/80 text-red-300 border-red-500/60 shadow-glow-red/30',
        dot: 'bg-red-500 animate-pulse',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-500/10',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        badge: 'bg-orange-950/80 text-orange-300 border-orange-500/60',
        dot: 'bg-orange-500',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        badge: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
        dot: 'bg-amber-500',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-teal-500/10',
        text: 'text-teal-400',
        border: 'border-teal-500/30',
        badge: 'bg-teal-950/60 text-teal-300 border-teal-500/40',
        dot: 'bg-teal-500',
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
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        badge: 'bg-rose-950/70 text-rose-300 border-rose-500/50',
        dot: 'bg-rose-500 animate-ping',
      };
    case 'accepted':
      return {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        badge: 'bg-blue-950/70 text-blue-300 border-blue-500/50',
        dot: 'bg-blue-500',
      };
    case 'in_progress':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        badge: 'bg-amber-950/70 text-amber-300 border-amber-500/50',
        dot: 'bg-amber-500 animate-pulse',
      };
    case 'resolved':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50',
        dot: 'bg-emerald-500',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        badge: 'bg-slate-800 text-slate-300 border-slate-700',
        dot: 'bg-slate-500',
      };
  }
}

export function getCategoryColor(category: IncidentCategory | string): string {
  const lower = (category || 'other').toLowerCase();
  switch (lower) {
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
