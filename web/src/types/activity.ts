export type ActivityAction = 
  | 'INCIDENT_CREATED'
  | 'INCIDENT_ASSIGNED'
  | 'STATUS_CHANGED'
  | 'SEVERITY_UPDATED'
  | 'COMMENT_ADDED'
  | 'INCIDENT_RESOLVED'
  | 'USER_ROLE_CHANGED'
  | 'SYSTEM_ALERT';

export interface ActivityLog {
  id: string;
  incidentId?: string;
  action: ActivityAction;
  performedBy: string;
  performedByName: string;
  performedByRole: string;
  details: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ActivityFilters {
  action?: ActivityAction | 'all';
  searchQuery?: string;
  incidentId?: string;
}
