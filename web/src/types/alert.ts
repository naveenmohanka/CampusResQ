export type AlertSeverity = 'critical' | 'warning' | 'advisory';

export type AlertCategory = 
  | 'emergency'
  | 'fire' 
  | 'weather' 
  | 'security' 
  | 'health' 
  | 'facility' 
  | 'general';

export interface CampusAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  targetArea: string; // e.g. "All Campus", "Hostel Block C", "Science Complex", "North Gate"
  radiusMeters?: number;
  active: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  expiresAt?: string;
  acknowledgedCount?: number;
}

export interface AlertFilters {
  activeOnly?: boolean;
  severity?: AlertSeverity | 'all';
  category?: AlertCategory | 'all';
}
