import type { IconVariant } from '../../types';

interface Props {
  variant: IconVariant;
  size?: number;
  color?: string;
}

const W = 2;
const CAP = 'round';
const JOIN = 'round';

function Icon({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={W}
      strokeLinecap={CAP} strokeLinejoin={JOIN} width="100%" height="100%">
      {children}
    </svg>
  );
}

const icons: Record<IconVariant, (color: string) => React.ReactElement> = {
  thermometer: (c) => (
    <Icon color={c}>
      <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
    </Icon>
  ),
  droplet: (c) => (
    <Icon color={c}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </Icon>
  ),
  gas: (c) => (
    <Icon color={c}>
      <circle cx="12" cy="8" r="3" />
      <path d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6" />
      <line x1="8" y1="2" x2="8" y2="4" />
      <line x1="16" y1="2" x2="16" y2="4" />
      <line x1="4" y1="6" x2="6" y2="7" />
      <line x1="18" y1="6" x2="20" y2="7" />
    </Icon>
  ),
  'shield-check': (c) => (
    <Icon color={c}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </Icon>
  ),
  clock: (c) => (
    <Icon color={c}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </Icon>
  ),
};

export function SensorIcon({ variant, size = 32, color = 'var(--color-text-primary)' }: Props) {
  return (
    <span style={{ width: size, height: size, display: 'inline-flex', flexShrink: 0 }}>
      {icons[variant](color)}
    </span>
  );
}
