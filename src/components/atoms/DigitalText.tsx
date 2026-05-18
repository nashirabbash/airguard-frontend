import styles from './DigitalText.module.css';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  value: string | number;
  size?: Size;
  color?: string;
  className?: string;
}

export function DigitalText({ value, size = 'md', color, className }: Props) {
  return (
    <span
      className={[styles.root, styles[size], className].filter(Boolean).join(' ')}
      style={color ? { color } : undefined}
    >
      {value}
    </span>
  );
}
