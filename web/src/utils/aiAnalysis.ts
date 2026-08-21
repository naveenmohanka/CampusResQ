export interface AiAnalysis {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priorityScore?: number;
  summary?: string;
  suggestedAction?: string;
  requiresImmediateResponse?: boolean;
}

/**
 * Robust utility to safely parse AI analysis data.
 * Handles JSON strings, pre-parsed objects, null/undefined, and malformed data.
 * NEVER crashes the dashboard.
 */
export function parseAiAnalysis(raw: any): AiAnalysis | null {
  if (!raw) return null;

  try {
    let data = raw;
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return null;
      data = JSON.parse(trimmed);
    }

    if (typeof data !== 'object' || data === null) {
      return null;
    }

    // Normalize severity
    let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
    if (data.severity && typeof data.severity === 'string') {
      const upper = data.severity.toUpperCase().trim();
      if (upper === 'CRITICAL' || upper === 'HIGH' || upper === 'MEDIUM' || upper === 'LOW') {
        severity = upper;
      }
    }

    const priorityScore = typeof data.priorityScore === 'number'
      ? data.priorityScore
      : data.priorityScore ? Number(data.priorityScore) : undefined;

    const summary = typeof data.summary === 'string' ? data.summary.trim() : undefined;
    const suggestedAction = typeof data.suggestedAction === 'string' ? data.suggestedAction.trim() : undefined;
    const requiresImmediateResponse = Boolean(data.requiresImmediateResponse);

    return {
      severity,
      priorityScore,
      summary,
      suggestedAction,
      requiresImmediateResponse,
    };
  } catch (err) {
    console.warn('CampusResQ: Failed to parse aiAnalysis safely:', err);
    return null;
  }
}

/**
 * Extracts normalized AI severity from an incident, falling back gracefully.
 */
export function getIncidentAiSeverity(incident: { aiAnalysis?: any; severity?: string }): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  const parsed = parseAiAnalysis(incident.aiAnalysis);
  if (parsed?.severity) return parsed.severity;

  if (incident.severity) {
    const upper = incident.severity.toUpperCase().trim();
    if (upper === 'CRITICAL' || upper === 'HIGH' || upper === 'MEDIUM' || upper === 'LOW') {
      return upper as any;
    }
  }

  return 'MEDIUM';
}

/**
 * Checks if incident has a critical immediate response flag.
 */
export function isImmediateResponseRequired(incident: { aiAnalysis?: any }): boolean {
  const parsed = parseAiAnalysis(incident.aiAnalysis);
  return Boolean(parsed?.requiresImmediateResponse);
}

/**
 * Formats location string from string or location map.
 */
export function formatLocationString(location: any): string {
  if (!location) return 'Main Campus';
  if (typeof location === 'string') return location;
  if (typeof location === 'object') {
    if (location.address) {
      if (location.building && !location.address.includes(location.building)) {
        return `${location.building} - ${location.address}`;
      }
      return location.address;
    }
    if (location.building) return location.building;
    if (location.latitude && location.longitude) {
      return `Coordinates: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    }
  }
  return 'Main Campus';
}
