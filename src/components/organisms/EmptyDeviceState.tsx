import styles from './EmptyDeviceState.module.css';

interface EmptyDeviceStateProps {
  onCreateClick: () => void;
}

export function EmptyDeviceState({ onCreateClick }: EmptyDeviceStateProps) {
  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>STATUS KONEKSI</div>
          <div className={styles.statusIndicator}>KOSONG</div>
        </div>

        <div className={styles.body}>
          <div className={styles.icon}>D</div>
          <div className={styles.message}>
            TIDAK ADA PERANGKAT TERDAFTAR
          </div>
          <div className={styles.subMessage}>
            SILAKAN DAFTARKAN PERANGKAT BARU UNTUK MEMULAI PEMANTAUAN KUALITAS UDARA.
          </div>
          <button className={styles.createButton} onClick={onCreateClick}>
            DAFTAR PERANGKAT BARU
          </button>
        </div>
      </div>
    </div>
  );
}
