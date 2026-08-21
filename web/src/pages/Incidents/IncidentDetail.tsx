import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIncidentById, updateIncidentAdminSeverity } from '../../services/incidentService';
import { Incident } from '../../types/incident';
import { AiSeverityBadge, StatusBadge, CategoryBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { IncidentMap } from '../../components/common/IncidentMap';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import {
  ArrowLeft,
  User,
  Clock,
  UserCheck,
  CheckCircle2,
  Lock,
  Eye,
  ShieldCheck,
  Zap,
  Bot,
  MapPin,
  Sparkles,
  AlertTriangle,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';
import { formatDate, formatTimeAgo } from '../../utils/dateUtils';
import {
  formatLocationString,
  getEffectiveSeverity,
  getIncidentAiSeverity,
  isImmediateResponseRequired,
  parseAiAnalysis
} from '../../utils/aiAnalysis';

export const IncidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingSeverity, setUpdatingSeverity] = useState(false);
  const [activeMedia, setActiveMedia] = useState<string | null>(null);

  useEffect(() => {
    async function loadIncident() {
      if (!id) return;
      setLoading(true);
      const data = await getIncidentById(id);
      setIncident(data);
      setLoading(false);
    }
    loadIncident();
  }, [id]);

  const handleSeverityChange = async (newSev: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') => {
    if (!incident || !id) return;
    if ((incident.status || '').toLowerCase() === 'resolved') {
      showToast({
        type: 'error',
        title: 'Action Denied',
        message: 'Severity cannot be changed after an incident is resolved.',
      });
      return;
    }

    try {
      setUpdatingSeverity(true);
      await updateIncidentAdminSeverity(id, newSev, user?.id, user?.name);
      setIncident((prev) =>
        prev
          ? {
              ...prev,
              adminSeverity: newSev,
              severity: newSev.toLowerCase() as any,
              adminSeverityChangedBy: user?.name || 'Administrator',
              adminSeverityChangedAt: new Date().toISOString(),
            }
          : prev
      );
      showToast({
        type: 'success',
        title: 'Severity Updated',
        message: `Incident effective severity changed to ${newSev}. AI analysis preserved.`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Failed to update severity.',
      });
    } finally {
      setUpdatingSeverity(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-400">Loading incident dossier #{id}...</p>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-white">Incident Not Found</h2>
        <p className="text-xs text-slate-400">The requested emergency incident does not exist in the database.</p>
        <Button variant="secondary" size="sm" onClick={() => navigate('/incidents')}>
          ← Return to Incidents Feed
        </Button>
      </div>
    );
  }

  const ai = parseAiAnalysis(incident.aiAnalysis);
  const aiOriginalSeverity = getIncidentAiSeverity(incident);
  const effectiveSeverity = getEffectiveSeverity(incident);
  const immediate = isImmediateResponseRequired(incident);
  const isResolved = (incident.status || '').toLowerCase() === 'resolved';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Back button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/incidents')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-teal-400">
                #{incident.id}
              </span>
              <CategoryBadge category={incident.category} />
              <StatusBadge status={incident.status} />
              {immediate && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-950 text-red-300 border border-red-600 animate-pulse">
                  <Zap className="w-3 h-3 text-red-400" />
                  REQUIRES IMMEDIATE RESPONSE
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
              {incident.title}
            </h1>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isResolved ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Resolved by Response Team</span>
              <Lock className="w-3.5 h-3.5 text-emerald-400 ml-1" />
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs">
              <Clock className="w-4 h-4 text-teal-400" />
              <span>Reported {formatTimeAgo(incident.createdAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & AI Triage */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Analysis & Severity Override Card */}
          <div className="glass-panel p-5 rounded-2xl border border-teal-500/30 bg-teal-950/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-glow-teal">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    AI Triage & Severity Control
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">
                      Android Contract
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">AI analysis preserved • Admin severity override enabled</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-semibold">Effective Severity:</span>
                <AiSeverityBadge
                  severity={effectiveSeverity}
                  requiresImmediateResponse={immediate}
                />
              </div>
            </div>

            {/* Severity Triage Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* 1. AI Generated Severity */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Bot className="w-3 h-3 text-teal-400" />
                  AI Recommended
                </span>
                <p className="text-sm font-extrabold text-teal-300 uppercase font-mono">
                  {aiOriginalSeverity}
                </p>
                {ai?.priorityScore !== undefined && (
                  <p className="text-[10px] text-slate-500 font-mono">
                    Priority Score: {ai.priorityScore}/10
                  </p>
                )}
              </div>

              {/* 2. Admin Manual Override */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-amber-400" />
                  Admin Override
                </span>

                {isResolved ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-slate-400">
                      <span>{effectiveSeverity}</span>
                      <Lock className="w-3 h-3 text-slate-500 ml-auto" />
                    </div>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Severity is locked after resolution.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <select
                      value={effectiveSeverity}
                      disabled={updatingSeverity}
                      onChange={(e) => handleSeverityChange(e.target.value as any)}
                      className="w-full px-2.5 py-1 bg-slate-950 border border-teal-500/40 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-teal-400"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                    {incident.adminSeverity && (
                      <p className="text-[10px] text-amber-300">
                        Overridden by {incident.adminSeverityChangedBy || 'Admin'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 3. Immediate Response Status */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 text-red-400" />
                  Immediate Dispatch
                </span>
                <p className={`text-sm font-extrabold ${immediate ? 'text-red-400' : 'text-slate-300'}`}>
                  {immediate ? '⚡ Yes (Urgent)' : 'Standard Queue'}
                </p>
                <p className="text-[10px] text-slate-500">
                  {immediate ? 'Priority fast-track' : 'Standard SLA tracking'}
                </p>
              </div>
            </div>

            {/* AI Summary & Suggested Action */}
            {ai ? (
              <div className="space-y-3 pt-2 border-t border-slate-800/80 text-xs">
                {ai.summary && (
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Bot className="w-3 h-3 text-teal-400" />
                      AI Situation Summary
                    </span>
                    <p className="text-slate-200 leading-relaxed">{ai.summary}</p>
                  </div>
                )}

                {ai.suggestedAction && (
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-teal-500/20 space-y-1">
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Recommended Response Action
                    </span>
                    <p className="text-teal-200 leading-relaxed font-medium">{ai.suggestedAction}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-400 bg-slate-900/60 rounded-xl border border-slate-800">
                <AlertTriangle className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span>AI analysis unavailable for this record.</span>
              </div>
            )}
          </div>

          {/* Description & Situation Overview */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm">Full Situation Report</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {incident.description}
            </p>
          </div>

          {/* Media / Photographic Evidence */}
          {incident.images && incident.images.length > 0 && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-teal-400" />
                  Attached Evidence & Media ({incident.images.length})
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Firebase Storage Protected</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {incident.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveMedia(imgUrl)}
                    className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 hover:border-teal-500/50 cursor-pointer group bg-slate-900"
                  >
                    <img
                      src={imgUrl}
                      alt={`Incident evidence ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolution Notes (If Resolved) */}
          {incident.resolutionNotes && (
            <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <h3>Response Team Resolution Report</h3>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {incident.resolutionNotes}
              </p>
              {incident.resolvedAt && (
                <p className="text-[11px] text-slate-400 font-mono pt-1">
                  Resolved on: {formatDate(incident.resolvedAt)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Location, Reporter, Response Team & Timestamps */}
        <div className="space-y-6">
          {/* Location & Map Blueprint */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400" />
              Incident Location
            </h3>
            <p className="text-xs text-slate-200 font-semibold">
              {formatLocationString(incident.location)}
            </p>
            <div className="rounded-xl overflow-hidden border border-slate-800">
              <IncidentMap
                location={incident.location}
                severity={effectiveSeverity}
                className="h-44"
              />
            </div>
          </div>

          {/* Reporter Information */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-teal-400" />
              Reporter Information
            </h3>

            {incident.isAnonymous ? (
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-300 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confidential / Anonymous Report</span>
                </div>
                <p className="text-[11px] text-purple-200">
                  Reporter identity is protected by campus confidentiality rules.
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Name:</span>
                  <span className="font-semibold text-white">{incident.reporterName || 'Student Reporter'}</span>
                </div>
                {incident.reporterEmail && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-mono text-slate-300">{incident.reporterEmail}</span>
                  </div>
                )}
                {incident.reporterPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-mono text-slate-300">{incident.reporterPhone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Reporter ID:</span>
                  <span className="font-mono text-slate-400">{incident.reporterId || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Assigned Response Team Member */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              Response Team Assignment
            </h3>

            {incident.assignedToName ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assigned To:</span>
                  <span className="font-bold text-indigo-300">{incident.assignedToName}</span>
                </div>
                {incident.assignedToEmail && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-mono text-slate-300">{incident.assignedToEmail}</span>
                  </div>
                )}
                {incident.assignedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Assigned At:</span>
                    <span className="font-mono text-slate-400">{formatTimeAgo(incident.assignedAt)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-3 text-center rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-400">
                Awaiting Response Team Pickup
              </div>
            )}
          </div>

          {/* Incident Lifecycle Timestamps */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              Response Lifecycle Timestamps
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Reported:</span>
                <span className="font-mono text-slate-300">{formatDate(incident.createdAt)}</span>
              </div>
              {incident.assignedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Assigned:</span>
                  <span className="font-mono text-slate-300">{formatDate(incident.assignedAt)}</span>
                </div>
              )}
              {incident.inProgressAt && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">In Progress:</span>
                  <span className="font-mono text-slate-300">{formatDate(incident.inProgressAt)}</span>
                </div>
              )}
              {incident.resolvedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Resolved:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{formatDate(incident.resolvedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Media Modal */}
      {activeMedia && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveMedia(null)}
        >
          <div className="max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
            <img src={activeMedia} alt="Full evidence preview" className="w-full h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};
