import React from 'react';
import { Navigation, Compass, MapPin } from 'lucide-react';
import { IncidentLocation } from '../../types/incident';

interface IncidentMapProps {
  location: IncidentLocation;
  title?: string;
  severity?: string;
}

export const IncidentMap: React.FC<IncidentMapProps> = ({ location, severity = 'high' }) => {
  const isCritical = severity === 'critical';
  
  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-xl">
      {/* Map Header */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-semibold text-slate-300">Geo-Location Coordinates</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-teal-300 bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-800/40">
          <span>{location.latitude.toFixed(4)}° N,</span>
          <span>{location.longitude.toFixed(4)}° E</span>
        </div>
      </div>

      {/* Styled Blueprint / Campus Grid Simulation */}
      <div className="relative h-64 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
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
        <div className="absolute w-40 h-28 border border-slate-800 bg-slate-900/40 rounded-xl top-6 left-8 flex items-center justify-center p-2 text-center">
          <span className="text-[10px] text-slate-500 font-mono">Central Academic Block</span>
        </div>
        <div className="absolute w-32 h-20 border border-slate-800 bg-slate-900/40 rounded-xl bottom-6 right-10 flex items-center justify-center p-2 text-center">
          <span className="text-[10px] text-slate-500 font-mono">Hostel Complex</span>
        </div>
        <div className="absolute w-24 h-24 border border-slate-800/80 bg-slate-900/40 rounded-full top-8 right-20 flex items-center justify-center p-2 text-center">
          <span className="text-[9px] text-slate-500 font-mono">Sports Arena</span>
        </div>

        {/* Pulsing Target Marker */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            {/* Outer radar ping */}
            <div className={`absolute w-16 h-16 rounded-full ${isCritical ? 'bg-red-500/20 radar-ping' : 'bg-teal-500/20 animate-ping'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-2xl border-2 ${
              isCritical ? 'bg-red-600 border-white text-white shadow-glow-red' : 'bg-teal-500 border-white text-slate-950 shadow-glow-teal'
            }`}>
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 px-3 py-1 bg-slate-900/90 border border-slate-700 rounded-full shadow-lg text-center backdrop-blur">
            <p className="text-xs font-bold text-white tracking-wide truncate max-w-[200px]">{location.building || location.address}</p>
          </div>
        </div>

        {/* Compass widget */}
        <div className="absolute bottom-3 left-3 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 flex items-center gap-1 text-[10px] font-mono">
          <Compass className="w-3.5 h-3.5 text-teal-400" />
          <span>KIIT CAMPUS SECTOR 1</span>
        </div>
      </div>

      {/* Location Details Footer */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-1">
        <p className="text-xs text-slate-400">Detailed Address:</p>
        <p className="text-sm font-semibold text-slate-200">{location.address}</p>
        {location.floor && (
          <p className="text-xs text-teal-400 font-mono">Specific Location: {location.floor} {location.building ? `(${location.building})` : ''}</p>
        )}
      </div>
    </div>
  );
};
