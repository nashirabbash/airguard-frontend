import { useState, useEffect, useCallback } from 'react';
import type { SensorData, RoomStatus, Device } from '../types';
import { useWeather } from '../hooks/useWeather';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { DashboardHeader } from '../components/organisms/DashboardHeader';
import { StatusBar } from '../components/organisms/StatusBar';
import { SensorGrid } from '../components/organisms/SensorGrid';
import { AuthCard } from '../components/organisms/AuthCard';
import { EmptyDeviceState } from '../components/organisms/EmptyDeviceState';
import { DeviceSelector } from '../components/organisms/DeviceSelector';
import { apiFetch, getMe, getDevices } from '../utils/api';

const MOCK_DATA: SensorData = {
  wifiStatus: 'offline',
  roomStatus: 'aman',
  lastUpdate: '--',
  temperature: 0,
  humidity: 0,
  gasLevel: 0,
};

function formatTime(date: Date): string {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month} ${hours}:${minutes}`;
}

export function AirMonitorPage() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  const [data, setData] = useState<SensorData>(MOCK_DATA);
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('airguard_token'));
  
  // Device selection states
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(() => sessionStorage.getItem('airguard_selected_device'));
  const [isLoadingDevices, setIsLoadingDevices] = useState<boolean>(false);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  const weather = useWeather();

  useEffect(() => {
    const tick = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(tick);
  }, []);

  const handleLogout = useCallback(async () => {
    if (token) {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    }
    sessionStorage.removeItem('airguard_token');
    sessionStorage.removeItem('airguard_selected_device');
    setToken(null);
    setDevices([]);
    setSelectedDeviceId(null);
    setData(MOCK_DATA);
  }, [token]);

  useEffect(() => {
    const onUnauthorized = () => handleLogout();
    window.addEventListener('auth_unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth_unauthorized', onUnauthorized);
  }, [handleLogout]);

  // Fetch current user and their devices when token changes
  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const fetchUserAndDevices = async () => {
      setIsLoadingDevices(true);
      setDeviceError(null);
      try {
        const userRes = await getMe();
        if (!isMounted) return;

        if (userRes.success && userRes.data) {
          const deviceRes = await getDevices(userRes.data.id);
          if (!isMounted) return;

          if (deviceRes.success && deviceRes.data) {
            const fetchedDevices = deviceRes.data;
            setDevices(fetchedDevices);
            
            if (fetchedDevices.length === 0) {
              setSelectedDeviceId(null);
              sessionStorage.removeItem('airguard_selected_device');
            } else {
              // Check if currently stored device exists in the fetched list
              const storedId = sessionStorage.getItem('airguard_selected_device');
              const exists = fetchedDevices.some(d => d.deviceId === storedId);
              if (exists && storedId) {
                setSelectedDeviceId(storedId);
              } else {
                // If there's exactly 1 device, select it automatically!
                if (fetchedDevices.length === 1) {
                  const autoId = fetchedDevices[0].deviceId;
                  setSelectedDeviceId(autoId);
                  sessionStorage.setItem('airguard_selected_device', autoId);
                } else {
                  // Multiple devices and no valid stored selection, require user to select
                  setSelectedDeviceId(null);
                  sessionStorage.removeItem('airguard_selected_device');
                }
              }
            }
          } else {
            setDeviceError(deviceRes.message || 'GAGAL MENGAMBIL DAFTAR PERANGKAT');
          }
        } else {
          setDeviceError(userRes.message || 'GAGAL MENGAMBIL DATA PENGGUNA');
        }
      } catch {
        if (!isMounted) return;
        setDeviceError('KONEKSI API GAGAL');
      } finally {
        if (isMounted) {
          setIsLoadingDevices(false);
        }
      }
    };


    fetchUserAndDevices();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSelectDevice = useCallback((deviceId: string) => {
    setSelectedDeviceId(deviceId);
    sessionStorage.setItem('airguard_selected_device', deviceId);
  }, []);

  // WebSocket synchronization based on token and active selectedDeviceId
  useEffect(() => {
    if (!token || !selectedDeviceId) return;

    // Use absolute WebSocket URL mapped to same origin
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/dashboard`;
    
    let ws: WebSocket;
    let reconnectTimer: number;

    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setData(prev => ({ ...prev, wifiStatus: 'online' }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          
          if (msg.type === 'snapshot' && msg.current) {
            // Only update dashboard if snapshot matches currently selected device
            if (msg.current.device_id === selectedDeviceId) {
              setData(prev => ({
                ...prev,
                temperature: msg.current.temperature,
                humidity: msg.current.humidity,
                gasLevel: msg.current.mq135_value,
                roomStatus: msg.current.room_status.toUpperCase() as RoomStatus,
                lastUpdate: formatTimestamp(msg.current.timestamp),
              }));
            }
          } else if (msg.type === 'telemetry_reading' && msg.data) {
            // Only update dashboard if telemetry reading matches currently selected device
            if (msg.data.device_id === selectedDeviceId) {
              setData(prev => ({
                ...prev,
                temperature: msg.data.temperature,
                humidity: msg.data.humidity,
                gasLevel: msg.data.mq135_value,
                roomStatus: msg.data.room_status.toUpperCase() as RoomStatus,
                lastUpdate: formatTimestamp(msg.data.timestamp),
              }));
            }
          }
        } catch (e) {
          console.error('Failed to parse WS message', e);
        }
      };

      ws.onclose = () => {
        setData(prev => ({ ...prev, wifiStatus: 'offline' }));
        reconnectTimer = window.setTimeout(connect, 5000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, [token, selectedDeviceId]);

  const handleAuthSuccess = (newToken: string) => {
    sessionStorage.setItem('airguard_token', newToken);
    setToken(newToken);
  };

  return (
    <div style={{ position: 'relative' }}>
      <DashboardLayout
        header={
          <DashboardHeader
            time={time}
            wifiStatus={(token && selectedDeviceId) ? data.wifiStatus : 'offline'}
            weather={weather}
          />
        }
        statusBar={
          token ? (
            isLoadingDevices ? (
              <div style={{ padding: '8px 16px', background: 'var(--color-card-status)', display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '1rem', color: 'var(--color-status-warning)' }}>
                  MEMUAT KONFIGURASI...
                </span>
              </div>
            ) : deviceError ? (
              <div style={{ padding: '8px 16px', background: 'var(--color-card-status)', display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '1rem', color: 'var(--color-status-danger)' }}>
                  ERR: {deviceError.toUpperCase()}
                </span>
              </div>
            ) : devices.length === 0 ? (
              <div style={{ padding: '8px 16px', background: 'var(--color-card-status)', display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '1rem', color: 'var(--color-status-danger)' }}>
                  BELUM ADA PERANGKAT TERHUBUNG
                </span>
              </div>
            ) : !selectedDeviceId ? (
              <div style={{ padding: '8px 16px', background: 'var(--color-card-status)', display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '1rem', color: 'var(--color-status-warning)' }}>
                  SILAKAN PILIH PERANGKAT AKTIF
                </span>
              </div>
            ) : (
              <StatusBar status={data.roomStatus} lastUpdate={data.lastUpdate} />
            )
          ) : (
            <div style={{ padding: '8px 16px', background: 'var(--color-card-status)', display: 'flex', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '1rem', color: 'var(--color-status-danger)' }}>
                OTENTIKASI REQUIRED
              </span>
            </div>
          )
        }
        sensors={
          token ? (
            isLoadingDevices ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', width: '100%' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '1.25rem', color: 'var(--color-text-secondary)', animation: 'pulse 1.5s infinite' }}>
                  MEMUAT KONFIGURASI PERANGKAT...
                </span>
              </div>
            ) : deviceError ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', width: '100%', flexDirection: 'column', gap: '16px' }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '1.25rem', color: 'var(--color-status-danger)', animation: 'blink 1s infinite' }}>
                  ERR: {deviceError.toUpperCase()}
                </span>
                <button 
                  onClick={() => setToken(token)}
                  style={{
                    fontFamily: 'var(--font-label)',
                    padding: '8px 16px',
                    background: 'var(--color-text-primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  COBA LAGI
                </button>
              </div>
            ) : devices.length === 0 ? (
              <EmptyDeviceState />
            ) : !selectedDeviceId ? (
              <DeviceSelector
                devices={devices}
                selectedDeviceId={selectedDeviceId}
                onSelect={handleSelectDevice}
              />
            ) : (
              <SensorGrid
                temperature={data.temperature}
                humidity={data.humidity}
                gasLevel={data.gasLevel}
              />
            )
          ) : (
            <AuthCard onSuccess={handleAuthSuccess} />
          )
        }
      />
      {token && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          gap: '12px',
          zIndex: 100
        }}>
          {devices.length > 1 && selectedDeviceId && (
            <button
              onClick={() => {
                setSelectedDeviceId(null);
                sessionStorage.removeItem('airguard_selected_device');
                setData(MOCK_DATA);
              }}
              style={{
                padding: '8px 16px',
                fontFamily: 'var(--font-label)',
                background: 'var(--color-text-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              GANTI PERANGKAT
            </button>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--font-label)',
              background: 'var(--color-status-danger)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            LOGOUT
          </button>
        </div>
      )}
    </div>
  );
}

