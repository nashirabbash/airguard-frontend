import type { IconVariant } from '../../types';
import { SensorIcon } from '../atoms/SensorIcon';
import { DigitalText } from '../atoms/DigitalText';
import { UnitText } from '../atoms/UnitText';
import styles from './SensorReading.module.css';

interface Props {
  icon: IconVariant;
  value: number | string;
  unit: string;
}

export function SensorReading({ icon, value, unit }: Props) {
  return (
    <div className={styles.root}>
      <SensorIcon variant={icon} size={36} />
      <DigitalText value={value} size="lg" />
      <UnitText unit={unit} />
    </div>
  );
}
