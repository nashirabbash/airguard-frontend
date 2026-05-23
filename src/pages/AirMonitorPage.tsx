import { useState, useEffect, useCallback } from 'react';
import type { SensorData, RoomStatus } from '../types';
import { useWeather } from '../hooks/useWeather';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { DashboardHeader } from '../components/organisms/DashboardHeader';
import { StatusBar } from '../components/organisms/StatusBar';
import { SensorGrid } from '../components/organisms/SensorGrid';
import { AuthCard } from '../components/organisms/AuthCard';
import { apiFetch } from '../utils/api';

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
    setToken(null);
  }, [token]);

  useEffect(() => {
    const onUnauthorized = () => handleLogout();
    window.addEventListener('auth_unauthorized', onUnauthorized);
    return () => window.removeEventListener('auth_unauthorized', onUnauthorized);
  }, [handleLogout]);

  useEffect(() => {
    if (!token) return;

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
            setData(prev => ({
              ...prev,
              temperature: msg.current.temperature,
              humidity: msg.current.humidity,
              gasLevel: msg.current.mq135_value,
              roomStatus: msg.current.room_status.toUpperCase() as RoomStatus,
              lastUpdate: formatTimestamp(msg.current.timestamp),
            }));
          } else if (msg.type === 'telemetry_reading' && msg.data) {
            setData(prev => ({
              ...prev,
              temperature: msg.data.temperature,
              humidity: msg.data.humidity,
              gasLevel: msg.data.mq135_value,
              roomStatus: msg.data.room_status.toUpperCase() as RoomStatus,
              lastUpdate: formatTimestamp(msg.data.timestamp),
            }));
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
  }, [token]);

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
            wifiStatus={token ? data.wifiStatus : 'offline'}
            weather={weather}
          />
        }
        statusBar={
          token ? (
            <StatusBar status={data.roomStatus} lastUpdate={data.lastUpdate} />
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
            <SensorGrid
              temperature={data.temperature}
              humidity={data.humidity}
              gasLevel={data.gasLevel}
            />
          ) : (
            <AuthCard onSuccess={handleAuthSuccess} />
          )
        }
      />
      {token && (
        <button
          onClick={handleLogout}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '8px 16px',
            fontFamily: 'var(--font-label)',
            background: 'var(--color-status-danger)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 100,
          }}
        >
          LOGOUT
        </button>
      )}
    </div>
  );
}
