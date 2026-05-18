import styles from './UnitText.module.css';

type UnitSize = 'sm' | 'md';

interface Props {
  unit: string;
  size?: UnitSize;
}

export function UnitText({ unit, size = 'sm' }: Props) {
  return (
    <span className={[styles.root, styles[size]].join(' ')}>
      {unit}
    </span>
  );
}
