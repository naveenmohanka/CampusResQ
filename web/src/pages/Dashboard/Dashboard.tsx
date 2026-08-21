import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertOctagon } from 'lucide-react';
import { useIncidents } from '../../hooks/useIncidents';
import { useActivityLogs } from '../../hooks/useActivityLogs';
import { MetricsGrid } from '../../components/dashboard/MetricsGrid';
import { StatusChart } from '../../components/dashboard/StatusChart';
import { SeverityChart } from '../../components/dashboard/SeverityChart';
import { LiveIncidentsWidget } from '../../components/dashboard/LiveIncidentsWidget';
import { RecentActivityWidget } from '../../components/dashboard/RecentActivityWidget';
import { Button } from '../../components/common/Button';
import { useNotification } from '../../context/NotificationContext';
import { AssignMentorModal } from '../../components/incidents/AssignMentorModal';
import { UpdateStatusModal } from '../../components/incidents/UpdateStatusModal';
import { Incident } from '../../types/incident';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { incidents, stats } = useIncidents();
  const { logs } = useActivityLogs();
  const { showToast } = useNotification();

  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const handleCardFilter = (filterType: string) => {
    if (filterType === 'active') {
      navigate('/incidents?status=reported');
    } else if (filterType === 'critical') {
      navigate('/incidents?severity=critical');
    } else if (filterType === 'resolved') {
      navigate('/incidents?status=resolved');
    } else {
      navigate('/incidents');
    }
  };

  const handleSimulateAlert = () => {
    showToast({
      type: 'critical',
      title: 'EMERGENCY BROADCAST ACTIVE',
      message: 'Active emergency responders alerted across KIIT Campus Sector 1.',
      duration: 6000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Emergency Command Center
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time incident response telemetry and university security monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/incidents')}
            icon={<Shield className="w-4 h-4 text-teal-400" />}
          >
            Manage Incidents
          </Button>

          <Button
            variant="emergency"
            size="sm"
            onClick={handleSimulateAlert}
            icon={<AlertOctagon className="w-4 h-4" />}
          >
            Broadcast SOS Test
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <MetricsGrid stats={stats} onCardClick={handleCardFilter} />

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart incidents={incidents} />
        <SeverityChart incidents={incidents} />
      </div>

      {/* Live Streams Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveIncidentsWidget incidents={incidents} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityWidget logs={logs} />
        </div>
      </div>

      {/* Modals */}
      <AssignMentorModal
        incident={selectedIncident}
        isOpen={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setSelectedIncident(null);
        }}
      />

      <UpdateStatusModal
        incident={selectedIncident}
        isOpen={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setSelectedIncident(null);
        }}
      />
    </div>
  );
};
