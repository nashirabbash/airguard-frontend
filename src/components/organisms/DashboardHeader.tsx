import type { CSSProperties } from 'react';
import type { WifiStatus, WeatherState } from '../../types';
import { getWeatherStyle } from '../../utils/weather';
import { AppTitle } from '../molecules/AppTitle';
import { WeatherDisplay } from '../molecules/WeatherDisplay';
import { ClockDisplay } from '../molecules/ClockDisplay';
import { WifiIndicator } from '../atoms/WifiIndicator';
import styles from './DashboardHeader.module.css';

interface Props {
  time: string;
  wifiStatus: WifiStatus;
  weather: WeatherState;
}

export function DashboardHeader({ time, wifiStatus, weather }: Props) {
  const { gradient, isDark } = getWeatherStyle(weather.condition, weather.isDay);

  const headerStyle: CSSProperties = {
    background: gradient,
    transition: 'background 1.2s ease',
    '--color-text-primary': isDark ? '#ddeeff' : '#1a1a1a',
    '--color-text-secondary': isDark ? '#88aacc' : '#444444',
  } as CSSProperties;

  return (
    <header className={styles.root} style={headerStyle}>
      <div className={styles.title}><AppTitle /></div>
      <div className={styles.illustration}>
        <WeatherDisplay
          condition={weather.condition}
          isDay={weather.isDay}
          city={weather.city}
          loading={weather.loading}
        />
      </div>
      <div className={styles.clock}><ClockDisplay time={time} /></div>
      <div className={styles.wifi}><WifiIndicator status={wifiStatus} /></div>
    </header>
  );
}
