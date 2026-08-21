import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertSeverity, AlertCategory } from '../../types/alert';
import { createCampusAlert } from '../../services/alertService';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import { Radio, AlertOctagon, MapPin, Clock } from 'lucide-react';

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CAMPUS_AREAS = [
  'All Campus (Broadcast)',
  'Central Library & Academic Quad',
  'Science Complex (Blocks A, B, C)',
  'Hostel Complex (KP-1 to KP-7)',
  'Girls Hostel Campus Area',
  'Campus Gate 1 & 2 (Main Entrance)',
  'Sports Complex & Indoor Stadium',
  'Medical College & Hospital Zone',
];

export const CreateAlertModal: React.FC<CreateAlertModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity>('warning');
  const [category, setCategory] = useState<AlertCategory>('emergency');
  const [targetArea, setTargetArea] = useState(CAMPUS_AREAS[0]);
  const [expiresHours, setExpiresHours] = useState(4);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast({
        type: 'error',
        title: 'Missing Alert Details',
        message: 'Please provide both an alert title and instruction message.',
      });
      return;
    }

    try {
      setLoading(true);
      await createCampusAlert(
        title.trim(),
        message.trim(),
        severity,
        category,
        targetArea,
        user?.id || 'admin-001',
        user?.name || 'Campus Operations Admin',
        expiresHours
      );

      showToast({
        type: 'success',
        title: 'Emergency Broadcast Published',
        message: `Alert broadcasted successfully to "${targetArea}".`,
      });

      // Reset
      setTitle('');
      setMessage('');
      onClose();
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Broadcast Failed',
        message: err.message || 'Unable to publish broadcast alert.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Broadcast Campus Emergency Alert"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Banner Warning */}
        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
          <AlertOctagon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <span>
            This alert will be broadcasted across the <strong>Campus Safety Alert Network</strong> and displayed to students, mentors, and security personnel.
          </span>
        </div>

        {/* Severity & Category Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Threat Severity Level
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as AlertSeverity)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="critical">🚨 CRITICAL (Life Safety Threat)</option>
              <option value="warning">⚠️ WARNING (Urgent Caution)</option>
              <option value="advisory">ℹ️ ADVISORY (Campus Notice)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Incident Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AlertCategory)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
            >
              <option value="emergency">General Emergency</option>
              <option value="fire">Fire Hazard</option>
              <option value="weather">Severe Weather / Flood</option>
              <option value="security">Security & Lockdown</option>
              <option value="health">Public Health Advisory</option>
              <option value="facility">Infrastructure & Power</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Broadcast Headline / Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. FLASH FLOOD / SUBWAY ACCESS BLOCKED"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-semibold uppercase"
          />
        </div>

        {/* Target Area */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            Target Campus Area / Zone
          </label>
          <select
            value={targetArea}
            onChange={(e) => setTargetArea(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
          >
            {CAMPUS_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Emergency Instructions & Safety Message
          </label>
          <textarea
            required
            rows={3}
            placeholder="Provide clear, concise instructions for students and staff in the area..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
          />
        </div>

        {/* Expiration Duration */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Auto-Expire After
          </label>
          <select
            value={expiresHours}
            onChange={(e) => setExpiresHours(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-teal-500"
          >
            <option value={1}>1 Hour</option>
            <option value={2}>2 Hours</option>
            <option value={4}>4 Hours (Standard)</option>
            <option value={8}>8 Hours</option>
            <option value={24}>24 Hours (Full Day)</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant={severity === 'critical' ? 'danger' : 'primary'}
            loading={loading}
            icon={<Radio className="w-4 h-4 animate-pulse" />}
          >
            Publish Broadcast Alert
          </Button>
        </div>
      </form>
    </Modal>
  );
};
