export type IncidentCategory = 
  | 'medical' 
  | 'fire' 
  | 'security' 
  | 'facility' 
  | 'ragging' 
  | 'harassment' 
  | 'other';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentStatus = 'reported' | 'assigned' | 'in_progress' | 'resolved';

export interface IncidentLocation {
  latitude: number;
  longitude: number;
  address: string;
  building?: string;
  floor?: string;
}

export interface EvidenceItem {
  id: string;
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  location: IncidentLocation;
  
  // Reporter details & Privacy
  reporterId: string;
  reporterName: string;
  reporterEmail?: string;
  reporterPhone?: string;
  isAnonymous?: boolean;
  
  // Assigned Responder
  assignedTo?: string | null;
  assignedToName?: string | null;
  assignedToEmail?: string | null;
  assignedToPhone?: string | null;
  
  // Evidence & Media
  images?: string[];
  evidence?: EvidenceItem[];
  
  // Resolution details
  resolutionNotes?: string;
  
  // Lifecycle Timestamps for Intelligence & SLA tracking
  createdAt: string;
  assignedAt?: string;
  acknowledgedAt?: string;
  inProgressAt?: string;
  resolvedAt?: string;
  updatedAt?: string;
}

export interface IncidentFilters {
  status?: IncidentStatus | 'all';
  severity?: IncidentSeverity | 'all';
  category?: IncidentCategory | 'all';
  assignedTo?: string | 'all';
  searchQuery?: string;
  isAnonymous?: boolean;
}

export interface IncidentStats {
  total: number;
  active: number;
  critical: number;
  resolved: number;
  avgResponseTimeMinutes?: number;
}
