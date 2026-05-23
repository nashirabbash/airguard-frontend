export type WifiStatus = 'online' | 'offline';
export type RoomStatus = 'aman' | 'bahaya' | 'waspada';
export type IconVariant = 'thermometer' | 'droplet' | 'gas' | 'shield-check' | 'clock';
export type ColorTheme = 'temp' | 'humidity' | 'gas';

export interface SensorData {
  wifiStatus: WifiStatus;
  roomStatus: RoomStatus;
  lastUpdate: string;
  temperature: number;
  humidity: number;
  gasLevel: number;
}

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm';

export interface WeatherState {
  condition: WeatherCondition;
  isDay: boolean;
  city: string;
  loading: boolean;
}

export interface User {
  id: number;
  username: string;
  lastLogin?: string;
}

export interface Device {
  deviceId: string;
  userId: number;
  tempUnsafeHigh: number;
  tempUnsafeLow: number;
  tempWarningHigh: number;
  tempWarningLow: number;
  humidityUnsafeHigh: number;
  humidityUnsafeLow: number;
  humidityWarningHigh: number;
  humidityWarningLow: number;
  mq135BaselineRuntimeOnly: number;
}

