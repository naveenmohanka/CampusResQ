import React, { useState } from 'react';
import { useIncidents } from '../../hooks/useIncidents';
import { MetricsGrid } from '../../components/dashboard/MetricsGrid';
import { LiveIncidentsWidget } from '../../components/dashboard/LiveIncidentsWidget';
import { ResponseTimeWidget } from '../../components/dashboard/ResponseTimeWidget';
import { ActiveAlertsWidget } from '../../components/alerts/ActiveAlertsWidget';
import { CreateAlertModal } from '../../components/alerts/CreateAlertModal';
import { Button } from '../../components/common/Button';
import { Radio } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { incidents, stats, error } = useIncidents();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Header & Emergency Broadcast Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            Campus Emergency Monitoring Command
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1">
            Real-time incident ingestion, AI priority classification, and campus response status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsAlertModalOpen(true)}
            icon={<Radio className="w-3.5 h-3.5" />}
          >
            Broadcast Alert
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs">
          <strong>Connection Error:</strong> {error.message}
        </div>
      )}

      {/* Module 2: Active Campus Broadcast Alerts */}
      <ActiveAlertsWidget />

      {/* 5 Primary KPI Summary Cards */}
      <MetricsGrid stats={stats} />

      {/* Live Operational Incident Feed (Critical / Active / Recent) */}
      <LiveIncidentsWidget incidents={incidents} />

      {/* Module 3: Response Time & Safety Intelligence Telemetry */}
      <ResponseTimeWidget />

      <CreateAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
    </div>
  );
};
