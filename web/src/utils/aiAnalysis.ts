export interface AiAnalysis {
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priorityScore?: number;
  summary?: string;
  suggestedAction?: string;
  requiresImmediateResponse?: boolean;
}

/**
 * Robust utility to safely parse AI analysis data.
 * Handles:
 * 1. Plain text string summary from Android (e.g. "Medical Emergency at Block B")
 * 2. Structured JSON string from Android
 * 3. Pre-parsed JavaScript object
 * 4. null / undefined / malformed data
 * NEVER crashes the dashboard or destructively alters Android data.
 */
export function parseAiAnalysis(raw: any): AiAnalysis | null {
  if (!raw) return null;

  try {
    let data = raw;
    if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return null;
      try {
        data = JSON.parse(trimmed);
      } catch {
        // If raw is a plain text summary from Android AI model
        return {
          severity: 'MEDIUM',
          summary: trimmed,
        };
      }
    }

    if (typeof data !== 'object' || data === null) {
      if (typeof data === 'string') {
        return { severity: 'MEDIUM', summary: data };
      }
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

    const summary = typeof data.summary === 'string'
      ? data.summary.trim()
      : typeof data.description === 'string'
      ? data.description.trim()
      : undefined;

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
    console.warn('CampusResQ: Handled unexpected aiAnalysis structure safely:', err);
    return null;
  }
}

/**
 * Calculates the EFFECTIVE SEVERITY used by the dashboard.
 * - If adminSeverity is set (Admin human override), returns adminSeverity.
 * - Otherwise returns the original AI analysis severity (or initial incident severity).
 * - Original aiAnalysis is NEVER overwritten.
 */
export function getEffectiveSeverity(incident: {
  adminSeverity?: string | null;
  aiAnalysis?: any;
  severity?: string;
}): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  if (incident.adminSeverity) {
    const upperAdmin = incident.adminSeverity.toUpperCase().trim();
    if (upperAdmin === 'CRITICAL' || upperAdmin === 'HIGH' || upperAdmin === 'MEDIUM' || upperAdmin === 'LOW') {
      return upperAdmin as any;
    }
  }

  const parsedAi = parseAiAnalysis(incident.aiAnalysis);
  if (parsedAi?.severity) return parsedAi.severity;

  if (incident.severity) {
    const upper = incident.severity.toUpperCase().trim();
    if (upper === 'CRITICAL' || upper === 'HIGH' || upper === 'MEDIUM' || upper === 'LOW') {
      return upper as any;
    }
  }

  return 'MEDIUM';
}

/**
 * Extracts ONLY the original AI-generated severity for audit/transparency.
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
 * Checks if incident has a critical immediate response flag from AI.
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
