import React, { useState, useEffect } from 'react';
import styles from './DeviceConfigModal.module.css';
import type { Device } from '../../types';

interface DeviceConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDevice?: Device;
  onSubmit: (config: Omit<Device, 'userId' | 'createdAt' | 'updatedAt'>) => void;
  isLoading: boolean;
}

const DeviceConfigModal: React.FC<DeviceConfigModalProps> = ({
  isOpen,
  onClose,
  initialDevice,
  onSubmit,
  isLoading,
}) => {
  const isEditing = !!initialDevice;

  const [formData, setFormData] = useState({
    deviceId: '',
    tempUnsafeHigh: 40,
    tempUnsafeLow: 15,
    tempWarningHigh: 35,
    tempWarningLow: 20,
    humidityUnsafeHigh: 80,
    humidityUnsafeLow: 20,
    humidityWarningHigh: 70,
    humidityWarningLow: 30,
    mq135BaselineRuntimeOnly: 0,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialDevice) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          deviceId: initialDevice.deviceId,
          tempUnsafeHigh: initialDevice.tempUnsafeHigh,
          tempUnsafeLow: initialDevice.tempUnsafeLow,
          tempWarningHigh: initialDevice.tempWarningHigh,
          tempWarningLow: initialDevice.tempWarningLow,
          humidityUnsafeHigh: initialDevice.humidityUnsafeHigh,
          humidityUnsafeLow: initialDevice.humidityUnsafeLow,
          humidityWarningHigh: initialDevice.humidityWarningHigh,
          humidityWarningLow: initialDevice.humidityWarningLow,
          mq135BaselineRuntimeOnly: initialDevice.mq135BaselineRuntimeOnly,
        });
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          deviceId: '',
          tempUnsafeHigh: 40,
          tempUnsafeLow: 15,
          tempWarningHigh: 35,
          tempWarningLow: 20,
          humidityUnsafeHigh: 80,
          humidityUnsafeLow: 20,
          humidityWarningHigh: 70,
          humidityWarningLow: 30,
          mq135BaselineRuntimeOnly: 0,
        });
      }
    }
  }, [isOpen, initialDevice]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {isEditing ? 'EDIT KONFIGURASI' : 'DAFTAR PERANGKAT BARU'}
          </h2>
          <button type="button" className={styles.closeButton} onClick={onClose} disabled={isLoading}>
            &times;
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isEditing && (
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="deviceId">Device ID (Token Fisik)</label>
              <input
                id="deviceId"
                name="deviceId"
                type="text"
                className={styles.input}
                value={formData.deviceId}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <span className={styles.helperText}>
                *Untuk saat ini, Device ID sama dengan token fisik perangkat Anda.
              </span>
            </div>
          )}

          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>--- SUHU (&deg;C) ---</div>
            <div className={styles.gridGroup}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Peringatan Tinggi</label>
                <input
                  name="tempWarningHigh"
                  type="number"
                  className={styles.input}
                  value={formData.tempWarningHigh}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Bahaya Tinggi</label>
                <input
                  name="tempUnsafeHigh"
                  type="number"
                  className={styles.input}
                  value={formData.tempUnsafeHigh}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Peringatan Rendah</label>
                <input
                  name="tempWarningLow"
                  type="number"
                  className={styles.input}
                  value={formData.tempWarningLow}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Bahaya Rendah</label>
                <input
                  name="tempUnsafeLow"
                  type="number"
                  className={styles.input}
                  value={formData.tempUnsafeLow}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>--- KELEMBABAN (%) ---</div>
            <div className={styles.gridGroup}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Peringatan Tinggi</label>
                <input
                  name="humidityWarningHigh"
                  type="number"
                  className={styles.input}
                  value={formData.humidityWarningHigh}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Bahaya Tinggi</label>
                <input
                  name="humidityUnsafeHigh"
                  type="number"
                  className={styles.input}
                  value={formData.humidityUnsafeHigh}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Peringatan Rendah</label>
                <input
                  name="humidityWarningLow"
                  type="number"
                  className={styles.input}
                  value={formData.humidityWarningLow}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Bahaya Rendah</label>
                <input
                  name="humidityUnsafeLow"
                  type="number"
                  className={styles.input}
                  value={formData.humidityUnsafeLow}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <div className={styles.sectionTitle}>--- SENSOR GAS ---</div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>MQ135 Baseline (Opsional)</label>
              <input
                name="mq135BaselineRuntimeOnly"
                type="number"
                className={styles.input}
                value={formData.mq135BaselineRuntimeOnly}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isLoading}>
              BATAL
            </button>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'MEMPROSES...' : 'SIMPAN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceConfigModal;
