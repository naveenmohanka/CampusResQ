export interface HotspotLocation {
  building: string;
  incidentCount: number;
  criticalCount: number;
  primaryCategory: string;
  mostRecentIncident: string;
}

export interface ResponseTimeMetric {
  category: string;
  avgMinutes: number;
  count: number;
}

export interface SeverityResponseMetric {
  severity: string;
  avgMinutes: number;
  targetSLAPercent: number; // e.g. 95% within 15 min for critical
}

export interface TimeSeriesPoint {
  date: string;
  reported: number;
  resolved: number;
}

export interface IntelligenceSummary {
  totalAnalyzed: number;
  avgResponseTimeMinutes: number;
  medianResponseTimeMinutes: number;
  fastestResponseMinutes: number;
  slaComplianceRate: number;
  topHotspot: string;
  mostFrequentCategory: string;
  hotspots: HotspotLocation[];
  responseTimeByCategory: ResponseTimeMetric[];
  responseTimeBySeverity: SeverityResponseMetric[];
  volumeTrend: TimeSeriesPoint[];
}
