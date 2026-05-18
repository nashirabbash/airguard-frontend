import { DigitalText } from '../atoms/DigitalText';
import styles from './ClockDisplay.module.css';

interface Props {
  time: string;
}

export function ClockDisplay({ time }: Props) {
  const [hh = '00', mm = '00'] = time.split(':');
  return (
    <div className={styles.root} aria-live="polite" aria-label={`Waktu: ${time}`}>
      <DigitalText value={hh} size="xl" />
      <span className={styles.sep} aria-hidden="true">:</span>
      <DigitalText value={mm} size="xl" />
    </div>
  );
}
