import type { RoomStatus } from '../../types';
import { LabelText } from '../atoms/LabelText';
import { SensorIcon } from '../atoms/SensorIcon';
import { StatusBadge } from '../atoms/StatusBadge';
import styles from './StatusRow.module.css';

const STATUS_LABELS: Record<RoomStatus, string> = {
  aman:    'AMAN',
  bahaya:  'BAHAYA',
  waspada: 'WASPADA',
};

const STATUS_COLORS: Record<RoomStatus, string> = {
  aman:    'var(--color-status-safe)',
  bahaya:  'var(--color-status-danger)',
  waspada: 'var(--color-status-warning)',
};

interface Props {
  status: RoomStatus;
  lastUpdate: string;
}

export function StatusRow({ status, lastUpdate }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.statusGroup}>
        <LabelText text="STATUS RUANGAN" />
        <div className={styles.badgeRow}>
          <SensorIcon variant="shield-check" size={20} color={STATUS_COLORS[status]} />
          <StatusBadge status={status} label={STATUS_LABELS[status]} />
        </div>
      </div>
      <div className={styles.updateGroup}>
        <SensorIcon variant="clock" size={14} />
        <LabelText text={`LAST UPDATE ${lastUpdate}`} />
      </div>
    </div>
  );
}
