import type { Device } from '../../types';
import styles from './DeviceSelector.module.css';

interface Props {
  devices: Device[];
  selectedDeviceId: string | null;
  onSelect: (deviceId: string) => void;
  onCreateClick: () => void;
}

export function DeviceSelector({ devices, selectedDeviceId, onSelect, onCreateClick }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>PEMILIHAN PANEL</div>
          <div className={styles.statusIndicator}>
            {devices.length} PERANGKAT
          </div>
        </div>

        <div className={styles.deviceList}>
          {devices.map((device) => {
            const isActive = device.deviceId === selectedDeviceId;
            return (
              <button
                key={device.deviceId}
                className={[
                  styles.deviceItem,
                  isActive ? styles.deviceItemActive : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onSelect(device.deviceId)}
              >
                <div className={styles.deviceInfo}>
                  <span className={styles.deviceIdLabel}>ID PERANGKAT</span>
                  <span className={styles.deviceIdVal}>{device.deviceId}</span>
                </div>
                <div className={styles.selectIndicator}>
                  {isActive ? 'AKTIF' : 'PILIH'}
                </div>
              </button>
            );
          })}
        </div>
        
        <button className={styles.createButton} onClick={onCreateClick}>
          + TAMBAH PERANGKAT
        </button>
      </div>
    </div>
  );
}
