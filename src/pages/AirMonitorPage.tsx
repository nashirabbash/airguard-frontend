import { useState, useEffect } from 'react';
import type { SensorData } from '../types';
import { useWeather } from '../hooks/useWeather';
import { DashboardLayout } from '../components/templates/DashboardLayout';
import { DashboardHeader } from '../components/organisms/DashboardHeader';
import { StatusBar } from '../components/organisms/StatusBar';
import { SensorGrid } from '../components/organisms/SensorGrid';

const MOCK_DATA: SensorData = {
  wifiStatus: 'online',
  roomStatus: 'aman',
  lastUpdate: '30-12 SUN 13:26',
  temperature: 33.9,
  humidity: 60,
  gasLevel: 1026,
};

function computeStatus(t: number, h: number, g: number): SensorData['roomStatus'] {
  if (g > 2500 || t > 45 || h > 90)   return 'bahaya';
  if (g >= 1500 || t >= 40 || h >= 80) return 'waspada';
  return 'aman';
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function AirMonitorPage() {
  const [time, setTime] = useState(() => formatTime(new Date()));
  const [data, setData] = useState<SensorData>({
    ...MOCK_DATA,
    roomStatus: computeStatus(MOCK_DATA.temperature, MOCK_DATA.humidity, MOCK_DATA.gasLevel),
  });
  const weather = useWeather();

  useEffect(() => {
    const tick = setInterval(() => setTime(formatTime(new Date())), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const fetchSensor = async () => {
      try {
        // Replace with real endpoint:
        // const res = await fetch('/api/sensor');
        // const json: Omit<SensorData, 'roomStatus'> = await res.json();
        // setData({ ...json, roomStatus: computeStatus(json.temperature, json.humidity, json.gasLevel) });
      } catch {
        setData(prev => ({ ...prev, wifiStatus: 'offline' }));
      }
    };
    fetchSensor();
    const poll = setInterval(fetchSensor, 30_000);
    return () => clearInterval(poll);
  }, []);

  return (
    <DashboardLayout
      header={
        <DashboardHeader
          time={time}
          wifiStatus={data.wifiStatus}
          weather={weather}
        />
      }
      statusBar={<StatusBar status={data.roomStatus} lastUpdate={data.lastUpdate} />}
      sensors={
        <SensorGrid
          temperature={data.temperature}
          humidity={data.humidity}
          gasLevel={data.gasLevel}
        />
      }
    />
  );
}
