import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  UserPlus,
  Edit3,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getIncidentById, updateIncidentSeverity } from '../../services/incidentService';
import { Incident, IncidentSeverity } from '../../types/incident';
import { useActivityLogs } from '../../hooks/useActivityLogs';
import { SeverityBadge, StatusBadge } from '../../components/common/Badge';
import { IncidentMap } from '../../components/common/IncidentMap';
import { ActivityTimeline } from '../../components/activity/ActivityTimeline';
import { AssignMentorModal } from '../../components/incidents/AssignMentorModal';
import { UpdateStatusModal } from '../../components/incidents/UpdateStatusModal';
import { Button } from '../../components/common/Button';
import { formatDate, formatTimeAgo } from '../../utils/dateUtils';
import { formatCategory } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';

export const IncidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const { logs } = useActivityLogs({ incidentId: id });

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getIncidentById(id);
      setIncident(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSeverityChange = async (newSev: IncidentSeverity) => {
    if (!incident || !user) return;
    try {
      await updateIncidentSeverity(incident.id, newSev, user.id, user.name);
      setIncident({ ...incident, severity: newSev });
      showToast({
        type: 'warning',
        title: 'Severity Escalated',
        message: `Incident severity set to ${newSev.toUpperCase()}`,
      });
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update severity.',
      });
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-teal-500 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm">Loading incident details from database...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-white">Incident Not Found</h2>
        <p className="text-sm text-slate-400">
          The requested incident ID "{id}" does not exist or has been archived.
        </p>
        <Button variant="secondary" onClick={() => navigate('/incidents')}>
          Return to Incidents
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/incidents"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-teal-400 font-semibold">{incident.id}</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">{formatCategory(incident.category)}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
              {incident.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setAssignModalOpen(true)}
            icon={<UserPlus className="w-4 h-4 text-teal-400" />}
          >
            {incident.assignedToName ? 'Reassign Mentor' : 'Assign Mentor'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setStatusModalOpen(true)}
            icon={<Edit3 className="w-4 h-4" />}
          >
            Update Status
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Info & Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <SeverityBadge severity={incident.severity} />
                <StatusBadge status={incident.status} />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Reported {formatDate(incident.createdAt)} ({formatTimeAgo(incident.createdAt)})</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Incident Description & Context
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                {incident.description}
              </p>
            </div>

            {/* Resolution Report Section if resolved */}
            {incident.status === 'resolved' && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Incident Resolved & Closed</span>
                  {incident.resolvedAt && (
                    <span className="text-emerald-500/80 font-mono text-[11px]">
                      • {formatDate(incident.resolvedAt)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300">
                  {incident.resolutionNotes || 'All emergency procedures completed and verified.'}
                </p>
              </div>
            )}

            {/* Reporter & Responder Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Reporter Box */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Reported By (Student)
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-teal-400 font-bold">
                    {incident.reporterName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{incident.reporterName}</h4>
                    <p className="text-xs text-slate-400">{incident.reporterEmail}</p>
                    {incident.reporterPhone && (
                      <p className="text-xs text-teal-400 font-mono mt-0.5">{incident.reporterPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Assigned Responder Box */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Assigned Mentor / Security
                </p>
                {incident.assignedToName ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-300 font-bold">
                      {incident.assignedToName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{incident.assignedToName}</h4>
                      <p className="text-xs text-slate-400">{incident.assignedToEmail || 'Faculty Responder'}</p>
                      <span className="inline-block text-[10px] text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40 mt-1">
                        Active Lead Responder
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="text-xs text-amber-400">No mentor assigned yet.</p>
                    <button
                      onClick={() => setAssignModalOpen(true)}
                      className="mt-1.5 text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> Assign Response Lead
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Campus Map Coordinate Visualizer */}
          <div>
            <IncidentMap
              location={incident.location}
              title={incident.title}
              severity={incident.severity}
            />
          </div>
        </div>

        {/* Right 1 Col: Severity Controls & Audit Timeline */}
        <div className="space-y-6">
          {/* Quick Severity Control */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Threat Level Severity
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(['low', 'medium', 'high', 'critical'] as IncidentSeverity[]).map((s) => (
                <button
                  key={s}
                  onClick={() => handleSeverityChange(s)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
                    incident.severity === s
                      ? s === 'critical'
                        ? 'bg-red-600 text-white border-red-500 font-bold shadow-glow-red'
                        : 'bg-teal-500 text-slate-950 border-teal-400 font-bold shadow-glow-teal'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Logs Timeline */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Incident Audit Trail
              </h3>
              <span className="text-[11px] font-mono text-teal-400">{logs.length} events</span>
            </div>
            <ActivityTimeline logs={logs} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssignMentorModal
        incident={incident}
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        onSuccess={loadData}
      />

      <UpdateStatusModal
        incident={incident}
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
