import React from 'react';
import styles from './ConfirmDeleteModal.module.css';

interface ConfirmDeleteModalProps {
  deviceId: string;
  isOpen: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  deviceId,
  isOpen,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>HAPUS PERANGKAT?</h2>
        
        <p className={styles.modalMessage}>
          Anda akan menghapus perangkat <strong>{deviceId}</strong>. Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className={styles.modalActions}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isDeleting}
          >
            BATAL
          </button>
          <button 
            type="button" 
            className={styles.deleteButton}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'MENGHAPUS...' : 'HAPUS'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
