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
import DeviceConfigModal from '../components/organisms/DeviceConfigModal';
import ConfirmDeleteModal from '../components/organisms/ConfirmDeleteModal';
import { apiFetch } from '../utils/api';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setToken, logout } from '../store/slices/authSlice';
import { setSelectedDeviceId } from '../store/slices/deviceSlice';
import { useMeQuery } from '../hooks/useAuth';
import { useDevicesQuery, useCreateDevice, useUpdateDevice, useDeleteDevice } from '../hooks/useDevices';

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

  // Redux Client state
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const selectedDeviceId = useAppSelector((state) => state.device.selectedDeviceId);

  // TanStack Query Server state
  const { data: user, isLoading: isLoadingUser, error: userError, refetch: refetchUser } = useMeQuery();
  const { data: devices = [], isLoading: isLoadingDevicesQuery, error: deviceQueryError, refetch: refetchDevices } = useDevicesQuery(user?.id);

  const { mutateAsync: createDeviceMut, isPending: isCreating } = useCreateDevice();
  const { mutateAsync: updateDeviceMut, isPending: isUpdating } = useUpdateDevice();
  const { mutateAsync: deleteDeviceMut, isPending: isDeleting } = useDeleteDevice();

  const isSubmitting = isCreating || isUpdating || isDeleting;
  const isLoadingDevices = token ? (isLoadingUser || isLoadingDevicesQuery) : false;
  const deviceError = (userError?.message) || (deviceQueryError?.message) || null;

  // CRUD Modals state
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState<Device | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const weather = useWeather();

  useEffect(() => {
    const tick = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(tick);
  }, []);

  const handleLogout = useCallback(async () => {
    if (token) {
      await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    }
    dispatch(logout());
    dispatch(setSelectedDeviceId(null));
    setData(MOCK_DATA);
  }, [token, dispatch]);

  useEffect(() => {
    const onUnauthorized = () => handleLogout();
    window.addEventListener('auth_unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth_unauthorized', onUnauthorized);
  }, [handleLogout]);

  // Synchronize Redux selection when the devices query completes or updates
  useEffect(() => {
    if (!token || isLoadingDevicesQuery || !devices) return;

    if (devices.length === 0) {
      if (selectedDeviceId !== null) {
        dispatch(setSelectedDeviceId(null));
      }
    } else {
      const exists = devices.some(d => d.deviceId === selectedDeviceId);
      if (exists && selectedDeviceId) {
        // Keep selected device
      } else {
        if (devices.length === 1) {
          dispatch(setSelectedDeviceId(devices[0].deviceId));
        } else {
          dispatch(setSelectedDeviceId(null));
        }
      }
    }
  }, [devices, selectedDeviceId, token, isLoadingDevicesQuery, dispatch]);

  const handleSelectDevice = useCallback((deviceId: string) => {
    dispatch(setSelectedDeviceId(deviceId));
  }, [dispatch]);

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
    dispatch(setToken(newToken));
  };

  const openCreateModal = useCallback(() => {
    setDeviceToEdit(undefined);
    setIsConfigModalOpen(true);
  }, []);

  const openEditModal = useCallback(() => {
    if (!selectedDeviceId) return;
    const device = devices.find(d => d.deviceId === selectedDeviceId);
    if (device) {
      setDeviceToEdit(device);
      setIsConfigModalOpen(true);
    }
  }, [selectedDeviceId, devices]);

  const handleConfigSubmit = async (config: Omit<Device, 'userId' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (deviceToEdit) {
        await updateDeviceMut({ deviceId: deviceToEdit.deviceId, config });
      } else {
        await createDeviceMut(config);
      }
      setIsConfigModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan pada server');
    }
  };

  const handleDeleteDevice = async () => {
    if (!selectedDeviceId) return;
    try {
      await deleteDeviceMut(selectedDeviceId);
      dispatch(setSelectedDeviceId(null));
      setData(MOCK_DATA);
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Terjadi kesalahan pada server');
    }
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
                  onClick={() => {
                    if (userError) refetchUser();
                    if (deviceQueryError) refetchDevices();
                  }}
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
              <EmptyDeviceState onCreateClick={openCreateModal} />
            ) : !selectedDeviceId ? (
              <DeviceSelector
                devices={devices}
                selectedDeviceId={selectedDeviceId}
                onSelect={handleSelectDevice}
                onCreateClick={openCreateModal}
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
                dispatch(setSelectedDeviceId(null));
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

      {selectedDeviceId && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          display: 'flex',
          gap: '12px',
          zIndex: 100
        }}>
          <button
            onClick={openEditModal}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--font-label)',
              background: '#b8a6d8',
              color: '#1a1a2e',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            EDIT KONFIGURASI
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            style={{
              padding: '8px 16px',
              fontFamily: 'var(--font-label)',
              background: 'transparent',
              color: 'var(--color-status-danger)',
              border: '1px solid var(--color-status-danger)',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = 'rgba(255,85,85,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            HAPUS PERANGKAT
          </button>
        </div>
      )}

      <DeviceConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        initialDevice={deviceToEdit}
        onSubmit={handleConfigSubmit}
        isLoading={isSubmitting}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        deviceId={selectedDeviceId || ''}
        isDeleting={isSubmitting}
        onConfirm={handleDeleteDevice}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
