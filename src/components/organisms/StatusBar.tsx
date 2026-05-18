import type { RoomStatus } from '../../types';
import { StatusRow } from '../molecules/StatusRow';
import styles from './StatusBar.module.css';

interface Props {
  status: RoomStatus;
  lastUpdate: string;
}

export function StatusBar({ status, lastUpdate }: Props) {
  return (
    <section className={styles.root} aria-label="Status ruangan">
      <StatusRow status={status} lastUpdate={lastUpdate} />
    </section>
  );
}
