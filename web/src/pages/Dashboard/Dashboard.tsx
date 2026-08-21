import React, { useState } from 'react';
import { useIncidents } from '../../hooks/useIncidents';
import { useActivityLogs } from '../../hooks/useActivityLogs';
import { MetricsGrid } from '../../components/dashboard/MetricsGrid';
import { StatusChart } from '../../components/dashboard/StatusChart';
import { SeverityChart } from '../../components/dashboard/SeverityChart';
import { LiveIncidentsWidget } from '../../components/dashboard/LiveIncidentsWidget';
import { RecentActivityWidget } from '../../components/dashboard/RecentActivityWidget';
import { ActiveAlertsWidget } from '../../components/alerts/ActiveAlertsWidget';
import { ResponseTimeWidget } from '../../components/dashboard/ResponseTimeWidget';
import { CreateAlertModal } from '../../components/alerts/CreateAlertModal';
import { Button } from '../../components/common/Button';
import { Radio } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { incidents, stats, error } = useIncidents();
  const { logs } = useActivityLogs();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Emergency Operations Command Center
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time incident response, live telemetry, and active campus alert dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsAlertModalOpen(true)}
            icon={<Radio className="w-3.5 h-3.5 animate-pulse" />}
          >
            Broadcast Alert
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs">
          <strong>Connection Error:</strong> {error.message}
        </div>
      )}

      {/* Module 2: Active Campus Broadcast Alerts */}
      <ActiveAlertsWidget />

      {/* 4 Primary KPI Summary Cards */}
      <MetricsGrid stats={stats} />

      {/* Module 3: Response Time & SLA Intelligence Widget */}
      <ResponseTimeWidget />

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart incidents={incidents} />
        <SeverityChart incidents={incidents} />
      </div>

      {/* Operational Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveIncidentsWidget incidents={incidents} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityWidget logs={logs} />
        </div>
      </div>

      <CreateAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
    </div>
  );
};
