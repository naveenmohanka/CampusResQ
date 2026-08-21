import React from 'react';
import { Navigation, Compass, MapPin } from 'lucide-react';

interface IncidentMapProps {
  location?: any;
  title?: string;
  severity?: string;
  className?: string;
}

export const IncidentMap: React.FC<IncidentMapProps> = ({ location, severity = 'high', className = '' }) => {
  const isCritical = severity?.toLowerCase() === 'critical';
  
  const lat = typeof location === 'object' && location?.latitude !== undefined ? location.latitude : 20.3533;
  const lng = typeof location === 'object' && location?.longitude !== undefined ? location.longitude : 85.8189;
  const addressText = typeof location === 'string' 
    ? location 
    : (location?.building || location?.address || 'Main Campus');

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-subtle)] ${className}`}>
      {/* Map Header */}
      <div className="px-4 py-2.5 bg-[var(--bg-surface)] border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          <span className="text-xs font-semibold text-[var(--text-secondary)]">Geo-Radar Coordinates</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-violet-700 dark:text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-lg border border-violet-500/20">
          <span>{Number(lat).toFixed(4)}° N,</span>
          <span>{Number(lng).toFixed(4)}° E</span>
        </div>
      </div>

      {/* Styled Blueprint / Campus Grid Simulation */}
      <div className="relative h-44 w-full bg-[var(--bg-subtle)] flex items-center justify-center overflow-hidden">
        {/* Campus Landmark Shapes */}
        <div className="absolute w-28 h-16 border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl top-4 left-4 flex items-center justify-center p-1 text-center">
          <span className="text-[9px] text-[var(--text-muted)] font-mono">Academic Block</span>
        </div>
        <div className="absolute w-24 h-14 border border-[var(--border-color)] bg-[var(--bg-surface)] rounded-xl bottom-4 right-4 flex items-center justify-center p-1 text-center">
          <span className="text-[9px] text-[var(--text-muted)] font-mono">Hostel Complex</span>
        </div>

        {/* Pulsing Target Marker */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 ${
              isCritical ? 'bg-red-600 border-white text-white' : 'bg-violet-600 border-white text-white'
            }`}>
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1.5 px-2.5 py-0.5 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-full shadow-sm text-center">
            <p className="text-[11px] font-bold text-[var(--text-primary)] tracking-wide truncate max-w-[180px]">{addressText}</p>
          </div>
        </div>

        {/* Compass widget */}
        <div className="absolute bottom-2 left-2 p-1 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] flex items-center gap-1 text-[9px] font-mono">
          <Compass className="w-3 h-3 text-violet-600 dark:text-violet-400" />
          <span>CAMPUS GRID</span>
        </div>
      </div>
    </div>
  );
};
