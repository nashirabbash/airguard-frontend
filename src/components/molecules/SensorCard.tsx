import type { CSSProperties } from 'react';
import type { IconVariant, ColorTheme } from '../../types';
import { LabelText } from '../atoms/LabelText';
import { SensorReading } from './SensorReading';
import styles from './SensorCard.module.css';

interface Props {
  label: string;
  icon: IconVariant;
  value: number | string;
  unit: string;
  colorTheme: ColorTheme;
  flash?: boolean;
  style?: CSSProperties;
}

export function SensorCard({ label, icon, value, unit, colorTheme, flash, style }: Props) {
  return (
    <article
      className={[styles.root, styles[colorTheme], flash ? styles.flash : ''].filter(Boolean).join(' ')}
      style={style}
      aria-label={`${label}: ${value} ${unit}`}
    >
      <LabelText text={label} size="xs" />
      <SensorReading icon={icon} value={value} unit={unit} />
    </article>
  );
}
