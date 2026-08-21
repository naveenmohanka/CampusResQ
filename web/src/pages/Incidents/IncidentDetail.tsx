import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getIncidentById, updateIncidentSeverity } from '../../services/incidentService';
import { Incident, IncidentSeverity } from '../../types/incident';
import { SeverityBadge, StatusBadge, CategoryBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { IncidentMap } from '../../components/common/IncidentMap';
import { ActivityTimeline } from '../../components/activity/ActivityTimeline';
import { AssignMentorModal } from '../../components/incidents/AssignMentorModal';
import { UpdateStatusModal } from '../../components/incidents/UpdateStatusModal';
import { useAuth } from '../../hooks/useAuth';
import { useActivityLogs } from '../../hooks/useActivityLogs';
import { useNotification } from '../../context/NotificationContext';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Clock,
  UserCheck,
  CheckCircle2,
  Lock,
  Eye,
  ShieldCheck,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import { formatDate, formatTimeAgo } from '../../utils/dateUtils';

export const IncidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { logs } = useActivityLogs();
  const { showToast } = useNotification();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  const fetchIncident = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getIncidentById(id);
      if (!data) {
        navigate('/incidents');
        return;
      }
      setIncident(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, [id]);

  const handleSeverityChange = async (newSev: IncidentSeverity) => {
    if (!incident || !user) return;
    try {
      await updateIncidentSeverity(incident.id, newSev, user.id, user.name);
      setIncident({ ...incident, severity: newSev });
      showToast({
        type: 'info',
        title: 'Severity Updated',
        message: `Threat level escalated/updated to ${newSev.toUpperCase()}`,
      });
    } catch (err: any) {
      showToast({ type: 'error', title: 'Error', message: err.message });
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-slate-400">Loading incident dossier...</div>;
  }

  if (!incident) {
    return <div className="py-12 text-center text-xs text-slate-400">Incident record not found.</div>;
  }

  // Calculate actual response time if assigned
  let responseMinutes: number | null = null;
  if (incident.assignedAt && incident.createdAt) {
    const c = new Date(incident.createdAt).getTime();
    const a = new Date(incident.assignedAt).getTime();
    if (a >= c) {
      responseMinutes = Math.round(((a - c) / 60000) * 10) / 10;
    }
  }

  const incidentLogs = logs.filter(l => l.incidentId === incident.id);

  return (
    <div className="space-y-6">
      {/* Back link & Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/incidents"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Incident Command List
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAssignModalOpen(true)}
            icon={<UserCheck className="w-3.5 h-3.5" />}
          >
            {incident.assignedTo ? 'Reassign Responder' : 'Assign Responder'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsStatusModalOpen(true)}
            icon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            Update Operational Status
          </Button>
        </div>
      </div>

      {/* Main Dossier Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-xs font-bold text-teal-400">
                TICKET #{incident.id}
              </span>
              <StatusBadge status={incident.status} />
              <CategoryBadge category={incident.category} />
              {incident.isAnonymous && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-700/60">
                  <Lock className="w-3 h-3" />
                  Confidential / Anonymous Report
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {incident.title}
            </h1>
          </div>

          {/* Threat Level Switcher */}
          <div className="flex items-center gap-3 p-3 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="text-right">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Threat Level
              </p>
              <div className="mt-0.5">
                <SeverityBadge severity={incident.severity} />
              </div>
            </div>
            <select
              value={incident.severity}
              onChange={(e) => handleSeverityChange(e.target.value as IncidentSeverity)}
              className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-teal-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Situation Report */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Initial Situation Report
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {incident.description}
          </p>
        </div>

        {/* Resolution Summary Box if Resolved */}
        {incident.status === 'resolved' && incident.resolutionNotes && (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-200">
            <h4 className="font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              Incident Resolution Report
            </h4>
            <p className="leading-relaxed">{incident.resolutionNotes}</p>
            {incident.resolvedAt && (
              <p className="text-[11px] text-emerald-400/80 mt-1 font-mono">
                Resolved at: {formatDate(incident.resolvedAt)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Grid: Reporter / Responder / Lifecycle SLA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Reporter Dossier */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-teal-400" />
            Reporting Party Information
          </h3>

          {incident.isAnonymous ? (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                <Lock className="w-4 h-4 text-purple-400" />
                Identity Protected (Anonymous)
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                The student elected confidential reporting under the campus whistleblower & safety protection policy. Contact details are shielded.
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{incident.reporterName}</span>
              </div>
              {incident.reporterEmail && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{incident.reporterEmail}</span>
                </div>
              )}
              {incident.reporterPhone && (
                <div className="flex items-center gap-2 text-slate-400 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{incident.reporterPhone}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Assigned Responder */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-400" />
            Designated Campus Responder
          </h3>

          {incident.assignedToName ? (
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{incident.assignedToName}</span>
              </div>
              {incident.assignedToEmail && (
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{incident.assignedToEmail}</span>
                </div>
              )}
              {incident.assignedAt && (
                <div className="flex items-center gap-2 text-teal-400 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Assigned: {formatTimeAgo(incident.assignedAt)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-3 text-xs text-amber-400 flex items-center gap-2 font-medium">
              <span>⚠️ No responder assigned yet.</span>
            </div>
          )}
        </div>

        {/* Lifecycle & SLA Timestamps */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Response SLA & Lifecycle
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Reported:</span>
              <span className="font-mono text-white">{formatDate(incident.createdAt)}</span>
            </div>
            {incident.assignedAt && (
              <div className="flex items-center justify-between text-slate-400">
                <span>Dispatched:</span>
                <span className="font-mono text-white">{formatDate(incident.assignedAt)}</span>
              </div>
            )}
            {responseMinutes !== null && (
              <div className="flex items-center justify-between font-semibold pt-1 border-t border-slate-800">
                <span className="text-teal-400">Dispatch Response Time:</span>
                <span className="font-mono text-teal-300">{responseMinutes} minutes</span>
              </div>
            )}
            {incident.resolvedAt && (
              <div className="flex items-center justify-between text-emerald-400 font-semibold">
                <span>Resolved:</span>
                <span className="font-mono text-emerald-300">{formatDate(incident.resolvedAt)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Evidence & Photo Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Attached Incident Evidence & Media</h3>
              <p className="text-xs text-slate-400">Encrypted evidence files stored under Firebase Storage</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-teal-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Access Controlled
          </div>
        </div>

        {(!incident.images || incident.images.length === 0) && (!incident.evidence || incident.evidence.length === 0) ? (
          <div className="py-6 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/40 text-xs text-slate-500">
            No photographic evidence or attachments provided with this incident report.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(incident.images || []).map((imgUrl, i) => (
              <div
                key={i}
                onClick={() => setSelectedPreviewImage(imgUrl)}
                className="group relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-slate-900 cursor-pointer shadow-lg hover:border-teal-500 transition-all"
              >
                <img
                  src={imgUrl}
                  alt={`Evidence ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                  <Eye className="w-4 h-4 text-teal-400" />
                  View Full Evidence
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Real Coordinates & Campus Map Visualizer */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base">Campus Location Telemetry</h3>
        <IncidentMap
          location={incident.location}
          title={incident.title}
          severity={incident.severity}
        />
      </div>

      {/* Incident Audit Timeline */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base">Incident Operations & Audit Trail</h3>
        <ActivityTimeline logs={incidentLogs} />
      </div>

      {/* Modals */}
      <AssignMentorModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        incident={incident}
        onSuccess={fetchIncident}
      />

      <UpdateStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        incident={incident}
        onSuccess={fetchIncident}
      />

      {/* Evidence Lightbox Modal */}
      {selectedPreviewImage && (
        <div
          onClick={() => setSelectedPreviewImage(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img
              src={selectedPreviewImage}
              alt="Evidence Preview"
              className="max-w-full max-h-[85vh] rounded-2xl border border-slate-700 shadow-2xl object-contain"
            />
            <p className="text-center text-xs text-slate-400 mt-2">Click anywhere to close evidence preview</p>
          </div>
        </div>
      )}
    </div>
  );
};
