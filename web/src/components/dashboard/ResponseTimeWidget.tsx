import React from 'react';
import { useIntelligence } from '../../hooks/useIntelligence';
import { Clock, ShieldCheck, Flame, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ResponseTimeWidget: React.FC = () => {
  const { intelligence, loading } = useIntelligence();

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Response Time & Safety Intelligence</h3>
            <p className="text-[11px] text-slate-400">Campus Safety Intelligence (Module 3)</p>
          </div>
        </div>

        <Link
          to="/analytics"
          className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
        >
          View Full Intelligence →
        </Link>
      </div>

      {loading ? (
        <div className="py-6 text-center text-xs text-slate-500">Computing telemetry...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Avg Response Time */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-400" />
              Avg Response Time
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-white font-mono">
                {intelligence.avgResponseTimeMinutes}
              </span>
              <span className="text-xs text-slate-400 font-semibold">min</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Incident report → Responder assignment</p>
          </div>

          {/* Median Response Time */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              Median Time
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-white font-mono">
                {intelligence.medianResponseTimeMinutes}
              </span>
              <span className="text-xs text-slate-400 font-semibold">min</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">50th percentile dispatch speed</p>
          </div>

          {/* SLA Compliance */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Target SLA (≤15m)
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-emerald-400 font-mono">
                {intelligence.slaComplianceRate}%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">CampusResQ target compliance</p>
          </div>

          {/* Top Repeated Hotspot */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-400" />
              Top Hotspot
            </span>
            <div className="mt-2 truncate font-bold text-xs text-amber-300">
              {intelligence.topHotspot}
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {intelligence.hotspots[0]?.incidentCount || 0} incidents recorded
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
