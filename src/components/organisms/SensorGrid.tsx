import { SensorCard } from '../molecules/SensorCard';
import styles from './SensorGrid.module.css';

interface Props {
  temperature: number;
  humidity: number;
  gasLevel: number;
}

export function SensorGrid({ temperature, humidity, gasLevel }: Props) {
  return (
    <section className={styles.root} aria-label="Data sensor">
      <SensorCard
        label="SUHU"
        icon="thermometer"
        value={temperature.toFixed(1)}
        unit="°C"
        colorTheme="temp"
        style={{ animationDelay: '0ms' }}
      />
      <SensorCard
        label="KELEMBAPAN"
        icon="droplet"
        value={humidity}
        unit="%"
        colorTheme="humidity"
        style={{ animationDelay: '100ms' }}
      />
      <SensorCard
        label="GAS (MQ-135)"
        icon="gas"
        value={gasLevel}
        unit="PPM"
        colorTheme="gas"
        style={{ animationDelay: '200ms' }}
      />
    </section>
  );
}
