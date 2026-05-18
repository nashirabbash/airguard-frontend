import type { WifiStatus } from '../../types';
import styles from './WifiIndicator.module.css';

interface Props {
  status: WifiStatus;
}

export function WifiIndicator({ status }: Props) {
  const online = status === 'online';
  const strokeColor = online ? 'var(--color-text-primary)' : '#999';
  return (
    <div className={styles.root}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
      <span className={[styles.label, online ? styles.online : styles.offline].join(' ')}>
        {online ? 'ONLINE' : 'OFFLINE'}
      </span>
    </div>
  );
}
