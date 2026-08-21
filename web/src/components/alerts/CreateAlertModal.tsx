import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertSeverity, AlertCategory } from '../../types/alert';
import { createCampusAlert } from '../../services/alertService';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import { Radio, MapPin, Clock } from 'lucide-react';

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
  const [category, setCategory] = useState<AlertCategory>('security');
  const [targetArea, setTargetArea] = useState(CAMPUS_AREAS[0]);
  const [durationHours, setDurationHours] = useState('4');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || !user) return;

    try {
      setLoading(true);
      const hours = parseInt(durationHours, 10) || 4;

      await createCampusAlert(
        title.trim(),
        message.trim(),
        severity,
        category,
        targetArea,
        user.id,
        user.name || 'Administrator',
        hours
      );

      showToast({
        type: 'success',
        title: 'Emergency Broadcast Published',
        message: `Alert dispatched to ${targetArea}. Active for ${hours} hours.`,
      });

      onClose();
      setTitle('');
      setMessage('');
    } catch (err: any) {
      showToast({
        type: 'error',
        title: 'Failed to Broadcast Alert',
        message: err.message || 'Could not send broadcast. Verify admin permissions.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Broadcast Emergency Advisory" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Severity selection */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
            Alert Severity Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'advisory', label: 'Advisory', color: 'border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10' },
              { id: 'warning', label: 'Warning', color: 'border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10' },
              { id: 'critical', label: 'Critical', color: 'border-red-500/40 text-red-600 dark:text-red-400 bg-red-500/10' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSeverity(s.id as AlertSeverity)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  severity === s.id
                    ? `${s.color} ring-2 ring-violet-500`
                    : 'bg-[var(--bg-subtle)] border-[var(--border-color)] text-[var(--text-muted)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category selection */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as AlertCategory)}
            className="w-full px-3.5 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-violet-500"
          >
            <option value="security">Security & Campus Safety</option>
            <option value="weather">Severe Weather</option>
            <option value="facility">Infrastructure & Facility</option>
            <option value="medical">Health & Medical</option>
            <option value="general">General Advisory</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
            Broadcast Headline / Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Flash Flood Alert, Block-C Water Contamination"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-violet-500"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
            Emergency Advisory Message & Instructions
          </label>
          <textarea
            required
            rows={3}
            placeholder="Provide clear safety instructions for students and faculty..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-violet-500 resize-none"
          />
        </div>

        {/* Target Area & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-violet-600 dark:text-violet-400" />
              Target Campus Area
            </label>
            <select
              value={targetArea}
              onChange={(e) => setTargetArea(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-violet-500"
            >
              {CAMPUS_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
              <Clock className="w-3.5 h-3.5 inline mr-1 text-violet-600 dark:text-violet-400" />
              Active Duration
            </label>
            <select
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border-color)] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none focus:border-violet-500"
            >
              <option value="1">1 Hour</option>
              <option value="2">2 Hours</option>
              <option value="4">4 Hours (Standard)</option>
              <option value="12">12 Hours</option>
              <option value="24">24 Hours</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            type="submit"
            loading={loading}
            icon={<Radio className="w-4 h-4" />}
          >
            Publish Broadcast
          </Button>
        </div>
      </form>
    </Modal>
  );
};
