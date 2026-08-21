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
    <div className={`relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-xl ${className}`}>
      {/* Map Header */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-teal-400" />
          <span className="text-xs font-semibold text-slate-300">Geo-Radar Coordinates</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-800/40">
          <span>{Number(lat).toFixed(4)}° N,</span>
          <span>{Number(lng).toFixed(4)}° E</span>
        </div>
      </div>

      {/* Styled Blueprint / Campus Grid Simulation */}
      <div className="relative h-44 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Grid lines */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#2dd4bf 1px, transparent 1px), radial-gradient(#2dd4bf 1px, #020617 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Campus Landmark Shapes */}
        <div className="absolute w-28 h-16 border border-slate-800 bg-slate-900/40 rounded-xl top-4 left-4 flex items-center justify-center p-1 text-center">
          <span className="text-[9px] text-slate-500 font-mono">Academic Block</span>
        </div>
        <div className="absolute w-24 h-14 border border-slate-800 bg-slate-900/40 rounded-xl bottom-4 right-4 flex items-center justify-center p-1 text-center">
          <span className="text-[9px] text-slate-500 font-mono">Hostel Complex</span>
        </div>

        {/* Pulsing Target Marker */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            {/* Outer radar ping */}
            <div className={`absolute w-12 h-12 rounded-full ${isCritical ? 'bg-red-500/20 animate-ping' : 'bg-teal-500/20 animate-ping'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-2xl border-2 ${
              isCritical ? 'bg-red-600 border-white text-white shadow-glow-red' : 'bg-teal-500 border-white text-slate-950 shadow-glow-teal'
            }`}>
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1.5 px-2.5 py-0.5 bg-slate-900/90 border border-slate-700 rounded-full shadow-lg text-center backdrop-blur">
            <p className="text-[11px] font-bold text-white tracking-wide truncate max-w-[180px]">{addressText}</p>
          </div>
        </div>

        {/* Compass widget */}
        <div className="absolute bottom-2 left-2 p-1 rounded bg-slate-900/80 border border-slate-800 text-slate-400 flex items-center gap-1 text-[9px] font-mono">
          <Compass className="w-3 h-3 text-teal-400" />
          <span>CAMPUS GRID</span>
        </div>
      </div>
    </div>
  );
};
