import { AiAnalysis } from '../utils/aiAnalysis';

export type IncidentCategory = 
  | 'medical' 
  | 'fire' 
  | 'security' 
  | 'facility' 
  | 'ragging' 
  | 'harassment' 
  | 'other'
  | string;

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'pending' | 'reported' | 'accepted' | 'in_progress' | 'resolved';

export interface IncidentLocation {
  latitude?: number;
  longitude?: number;
  address?: string;
  building?: string;
  floor?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity?: IncidentSeverity;
  
  // Admin Manual Severity Override (Separate from AI Analysis)
  adminSeverity?: IncidentSeverity | null;
  adminSeverityChangedBy?: string | null;
  adminSeverityChangedAt?: string | null;
  
  status: IncidentStatus;
  location: any; // string or IncidentLocation
  
  // Reporter details & Privacy
  reporterId: string;
  reporterName?: string;
  reporterEmail?: string;
  reporterPhone?: string;
  isAnonymous?: boolean;
  
  // AI Analysis (Android Source of Truth - Preserved untouched)
  aiAnalysisStatus?: 'pending' | 'completed' | 'failed' | string;
  aiAnalysis?: string | AiAnalysis;
  
  // Response Team / Responder
  assignedTo?: string | null;
  assignedToName?: string | null;
  assignedToEmail?: string | null;
  assignedToPhone?: string | null;
  
  // Evidence & Media
  images?: string[];
  
  // Resolution details
  resolutionNotes?: string;
  
  // Lifecycle Timestamps
  createdAt: string;
  assignedAt?: string;
  inProgressAt?: string;
  resolvedAt?: string;
  updatedAt?: string;
}

export interface IncidentFilters {
  status?: IncidentStatus | 'all';
  aiSeverity?: 'all' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category?: string | 'all';
  searchQuery?: string;
  sortBy?: 'newest' | 'priority';
}

export interface IncidentStats {
  total: number;
  pending: number;
  active: number;
  resolved: number;
  criticalHigh: number;
}
