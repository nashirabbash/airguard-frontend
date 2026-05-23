import { SensorCard } from '../molecules/SensorCard';
import styles from './SensorGrid.module.css';

interface Props {
  temperature: number | null;
  humidity: number | null;
  gasLevel: number | null;
}

export function SensorGrid({ temperature, humidity, gasLevel }: Props) {
  const tempValue   = temperature !== null ? temperature.toFixed(1) : '--';
  const humidValue  = humidity    !== null ? humidity               : '--';
  const gasValue    = gasLevel    !== null ? gasLevel               : '--';

  return (
    <section className={styles.root} aria-label="Data sensor">
      <SensorCard
        label="SUHU"
        icon="thermometer"
        value={tempValue}
        unit="°C"
        colorTheme="temp"
        style={{ animationDelay: '0ms' }}
      />
      <SensorCard
        label="KELEMBAPAN"
        icon="droplet"
        value={humidValue}
        unit="%"
        colorTheme="humidity"
        style={{ animationDelay: '100ms' }}
      />
      <SensorCard
        label="GAS (MQ-135)"
        icon="gas"
        value={gasValue}
        unit="PPM"
        colorTheme="gas"
        style={{ animationDelay: '200ms' }}
      />
    </section>
  );
}
