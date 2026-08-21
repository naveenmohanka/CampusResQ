export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus = 'reported' | 'assigned' | 'in_progress' | 'resolved';

export type IncidentCategory = 
  | 'medical'
  | 'fire'
  | 'security'
  | 'facility'
  | 'ragging'
  | 'harassment'
  | 'other';

export interface IncidentLocation {
  latitude: number;
  longitude: number;
  address: string;
  building?: string;
  floor?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: IncidentLocation;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reporterPhone?: string;
  assignedTo?: string | null;
  assignedToName?: string | null;
  assignedToEmail?: string | null;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  images?: string[];
}

export interface IncidentFilters {
  status?: IncidentStatus | 'all';
  severity?: IncidentSeverity | 'all';
  category?: IncidentCategory | 'all';
  searchQuery?: string;
  assignedTo?: string | 'all' | 'unassigned';
  sortBy?: 'createdAt' | 'severity' | 'status' | 'updatedAt';
  sortDirection?: 'asc' | 'desc';
}

export interface IncidentStats {
  total: number;
  active: number;
  resolved: number;
  critical: number;
  reported: number;
  assigned: number;
  inProgress: number;
}
