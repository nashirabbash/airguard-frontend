import { useState, type FormEvent } from 'react';
import styles from './AuthCard.module.css';
import { apiFetch } from '../../utils/api';

interface Props {
  onSuccess: (token: string) => void;
}

type Mode = 'login' | 'signup';

export function AuthCard({ onSuccess }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('USERNAME & PASSWORD WAJIB DIISI');
      return;
    }

    setLoading(true);
    setError(null);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const response = await apiFetch<{ token: string }>(endpoint, {
        method: 'POST',
        body: { username, password },
      });

      if (response.success && response.data?.token) {
        onSuccess(response.data.token);
      } else {
        setError(response.message || 'TERJADI KESALAHAN');
      }
    } catch {
      setError('KONEKSI GAGAL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>OTENTIKASI SISTEM</div>
          <div 
            className={[
              styles.statusText, 
              error ? styles.statusError : '',
              loading ? styles.statusLoading : ''
            ].filter(Boolean).join(' ')}
          >
            {error ? `ERR: ${error}` : loading ? 'MENGIRIM DATA...' : 'SILAKAN MASUK'}
          </div>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="username">USERNAME</label>
            <input 
              id="username"
              type="text" 
              className={styles.input} 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">PASSWORD</label>
            <input 
              id="password"
              type="password" 
              className={styles.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <div className={styles.actions}>
            <button 
              type="button" 
              className={styles.toggleBtn} 
              onClick={toggleMode}
              disabled={loading}
            >
              {mode === 'login' ? 'BELUM ADA AKUN? DAFTAR' : 'SUDAH ADA AKUN? MASUK'}
            </button>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
            >
              {mode === 'login' ? 'MASUK' : 'DAFTAR'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
