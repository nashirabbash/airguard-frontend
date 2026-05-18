import type { RoomStatus } from '../../types';
import styles from './StatusBadge.module.css';

interface Props {
  status: RoomStatus;
  label: string;
}

export function StatusBadge({ status, label }: Props) {
  return (
    <span className={[styles.root, styles[status]].join(' ')}>
      {label}
    </span>
  );
}
