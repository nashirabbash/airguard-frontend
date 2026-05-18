import type { ReactNode } from 'react';
import styles from './DashboardLayout.module.css';

interface Props {
  header: ReactNode;
  statusBar: ReactNode;
  sensors: ReactNode;
}

export function DashboardLayout({ header, statusBar, sensors }: Props) {
  return (
    <div className={styles.root}>
      {header}
      {statusBar}
      <main className={styles.main}>{sensors}</main>
    </div>
  );
}
