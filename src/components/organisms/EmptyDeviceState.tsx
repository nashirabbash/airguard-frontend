import styles from './EmptyDeviceState.module.css';

export function EmptyDeviceState() {
  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>STATUS KONEKSI</div>
          <div className={styles.statusIndicator}>KOSONG</div>
        </div>

        <div className={styles.body}>
          <div className={styles.icon}>D</div> {/* 'D' character or standard symbol representing warning/device in LCD weather font */}
          <div className={styles.message}>
            TIDAK ADA PERANGKAT TERDAFTAR
          </div>
          <div className={styles.subMessage}>
            SILAKAN DAFTARKAN PERANGKAT BARU MELALUI BACKEND API UNTUK MEMULAI PEMANTAUAN KUALITAS UDARA.
          </div>
        </div>
      </div>
    </div>
  );
}
