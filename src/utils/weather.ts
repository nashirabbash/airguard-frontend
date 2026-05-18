import type { WeatherCondition } from '../types';

export function weatherKey(condition: WeatherCondition, isDay: boolean): string {
  if (condition === 'clear' || condition === 'partly-cloudy') {
    return `${condition}-${isDay ? 'day' : 'night'}`;
  }
  return condition;
}

// WMO weather interpretation code → app condition
export function wmoToCondition(code: number): WeatherCondition {
  if (code === 0)        return 'clear';
  if (code <= 2)         return 'partly-cloudy';
  if (code === 3)        return 'cloudy';
  if (code <= 48)        return 'fog';
  if (code <= 57)        return 'drizzle';
  if (code <= 67)        return 'rain';
  if (code <= 77)        return 'snow';
  if (code <= 82)        return 'rain';
  if (code <= 86)        return 'snow';
  return 'thunderstorm';
}

// Background gradient [top, bottom] per weather key
const BG: Record<string, [string, string]> = {
  'clear-day':           ['#87ceeb', '#d4eeff'],
  'clear-night':         ['#0f1e3c', '#1a3360'],
  'partly-cloudy-day':   ['#a8d4f0', '#dceefa'],
  'partly-cloudy-night': ['#182a4a', '#2a4a6a'],
  'cloudy':              ['#7a8ea0', '#aabbc8'],
  'drizzle':             ['#6a8090', '#9ab0bc'],
  'rain':                ['#4a6070', '#7a9aaa'],
  'snow':                ['#d0e8f4', '#eaf4fc'],
  'thunderstorm':        ['#2a3040', '#404858'],
  'fog':                 ['#9aaab0', '#c4cfd4'],
};

const DARK_KEYS = new Set([
  'clear-night', 'partly-cloudy-night', 'thunderstorm',
]);

export interface WeatherStyle {
  gradient: string;
  isDark: boolean;
}

export function getWeatherStyle(condition: WeatherCondition, isDay: boolean): WeatherStyle {
  const key = weatherKey(condition, isDay);
  const [top, bottom] = BG[key] ?? BG['partly-cloudy-day'];
  return {
    gradient: `linear-gradient(180deg, ${top}, ${bottom})`,
    isDark: DARK_KEYS.has(key),
  };
}
