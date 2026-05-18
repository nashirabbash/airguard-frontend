import type { WeatherCondition } from '../../types';
import { weatherKey } from '../../utils/weather';
import { WeatherIllustration } from './WeatherIllustration';
import styles from './WeatherDisplay.module.css';

const S = '#1a1a1a';
const SW = 2.5;

const ICONS: Record<string, React.ReactElement> = {
  'clear-day': (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke={S} strokeWidth={SW} strokeLinecap="round">
        <line x1="100" y1="8"   x2="100" y2="24" />
        <line x1="100" y1="116" x2="100" y2="132" />
        <line x1="16"  y1="70"  x2="32"  y2="70" />
        <line x1="168" y1="70"  x2="184" y2="70" />
        <line x1="34"  y1="24"  x2="46"  y2="36" />
        <line x1="154" y1="24"  x2="142" y2="36" />
        <line x1="34"  y1="116" x2="46"  y2="104" />
        <line x1="154" y1="116" x2="142" y2="104" />
      </g>
      <circle cx="100" cy="70" r="34" fill="white" stroke={S} strokeWidth={SW} />
      <g fill={S}>
        <circle cx="90" cy="60" r="2" /><circle cx="100" cy="60" r="2" /><circle cx="110" cy="60" r="2" />
        <circle cx="90" cy="70" r="2" /><circle cx="100" cy="70" r="2" /><circle cx="110" cy="70" r="2" />
        <circle cx="90" cy="80" r="2" /><circle cx="100" cy="80" r="2" /><circle cx="110" cy="80" r="2" />
      </g>
    </svg>
  ),

  'clear-night': (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={S}>
        <circle cx="155" cy="25" r="3" /><circle cx="170" cy="50" r="2" /><circle cx="148" cy="15" r="2" />
        <circle cx="175" cy="32" r="1.5" /><circle cx="160" cy="68" r="1.5" />
      </g>
      <path
        d="M 108 18 C 55 14 28 40 28 70 C 28 100 58 126 108 124 C 80 114 62 94 62 70 C 62 46 80 28 108 18 Z"
        fill="white" stroke={S} strokeWidth={SW} strokeLinejoin="round"
      />
      <g fill={S} opacity="0.4">
        <circle cx="50" cy="65" r="2" /><circle cx="44" cy="78" r="2" /><circle cx="56" cy="80" r="2" />
      </g>
    </svg>
  ),

  'partly-cloudy-day': (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke={S} strokeWidth={2} strokeLinecap="round" opacity="0.7">
        <line x1="52" y1="6"  x2="52" y2="18" /><line x1="52" y1="62" x2="52" y2="74" />
        <line x1="14" y1="38" x2="26" y2="38" /><line x1="78" y1="38" x2="90" y2="38" />
        <line x1="26" y1="14" x2="34" y2="22" /><line x1="70" y1="54" x2="78" y2="62" />
        <line x1="70" y1="14" x2="62" y2="22" /><line x1="26" y1="54" x2="34" y2="46" />
      </g>
      <circle cx="52" cy="38" r="22" fill="white" stroke={S} strokeWidth={2} />
      <g fill={S} opacity="0.5">
        <circle cx="46" cy="32" r="1.5" /><circle cx="52" cy="32" r="1.5" /><circle cx="58" cy="32" r="1.5" />
        <circle cx="46" cy="38" r="1.5" /><circle cx="52" cy="38" r="1.5" /><circle cx="58" cy="38" r="1.5" />
      </g>
      <path
        d="M 54 108 Q 52 84 72 82 Q 78 66 100 70 Q 112 58 128 68 Q 148 62 150 82 Q 168 82 168 98 Q 168 114 150 114 L 68 114 Q 54 114 54 108 Z"
        fill="white" stroke={S} strokeWidth={SW} strokeLinejoin="round"
      />
      <g fill={S} opacity="0.3">
        <circle cx="78"  cy="98"  r="2" /><circle cx="92"  cy="90"  r="2" /><circle cx="106" cy="98"  r="2" />
        <circle cx="120" cy="90"  r="2" /><circle cx="134" cy="98"  r="2" /><circle cx="85"  cy="108" r="2" />
        <circle cx="99"  cy="108" r="2" /><circle cx="113" cy="108" r="2" /><circle cx="127" cy="108" r="2" />
      </g>
    </svg>
  ),

  'partly-cloudy-night': (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill={S}>
        <circle cx="160" cy="18" r="2.5" /><circle cx="172" cy="36" r="1.8" /><circle cx="152" cy="10" r="1.8" />
      </g>
      <path
        d="M 75 14 C 40 12 22 32 22 52 C 22 72 40 88 68 88 C 50 80 40 68 40 52 C 40 36 52 22 75 14 Z"
        fill="white" stroke={S} strokeWidth={2} strokeLinejoin="round"
      />
      <path
        d="M 60 108 Q 58 86 76 84 Q 82 68 102 72 Q 112 60 130 70 Q 150 64 152 82 Q 168 84 168 98 Q 168 114 152 114 L 72 114 Q 60 114 60 108 Z"
        fill="white" stroke={S} strokeWidth={SW} strokeLinejoin="round"
      />
      <g fill={S} opacity="0.3">
        <circle cx="82"  cy="98"  r="2" /><circle cx="96"  cy="90"  r="2" /><circle cx="110" cy="98"  r="2" />
        <circle cx="124" cy="90"  r="2" /><circle cx="90"  cy="108" r="2" /><circle cx="108" cy="108" r="2" />
      </g>
    </svg>
  ),

  'cloudy': (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 28 88 Q 26 64 50 60 Q 56 42 80 48 Q 90 34 112 44 Q 136 36 140 58 Q 162 58 164 78 Q 166 100 144 104 L 48 104 Q 28 104 28 88 Z"
        fill="white" stroke={S} strokeWidth={SW} strokeLinejoin="round"
      />
      <g fill={S} opacity="0.35">
        <circle cx="52" cy="82"  r="2.2" /><circle cx="68"  cy="72"  r="2.2" /><circle cx="84"  cy="82"  r="2.2" />
        <circle cx="100" cy="72" r="2.2" /><circle cx="116" cy="82"  r="2.2" /><circle cx="132" cy="74"  r="2.2" />
        <circle cx="58"  cy="94" r="2.2" /><circle cx="74"  cy="94"  r="2.2" /><circle cx="90"  cy="94"  r="2.2" />
        <circle cx="106" cy="94" r="2.2" /><circle cx="122" cy="94"  r="2.2" />
      </g>
    </svg>
  ),

  'rain': (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 24 72 Q 22 50 46 46 Q 52 30 76 36 Q 86 22 106 32 Q 130 24 134 46 Q 156 46 158 64 Q 160 84 140 88 L 42 88 Q 24 88 24 72 Z"
        fill="white" stroke={S} strokeWidth={SW} strokeLinejoin="round"
      />
      <g stroke={S} strokeWidth={2} strokeLinecap="round">
        <line x1="56"  y1="100" x2="50"  y2="118" />
        <line x1="80"  y1="100" x2="74"  y2="118" />
        <line x1="104" y1="100" x2="98"  y2="118" />
        <line x1="128" y1="100" x2="122" y2="118" />
        <line x1="68"  y1="108" x2="62"  y2="126" />
        <line x1="116" y1="108" x2="110" y2="126" />
      </g>
    </svg>
  ),

  'drizzle': (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 24 72 Q 22 50 46 46 Q 52 30 76 36 Q 86 22 106 32 Q 130 24 134 46 Q 156 46 158 64 Q 160 84 140 88 L 42 88 Q 24 88 24 72 Z"
        fill="white" stroke={S} strokeWidth={SW} strokeLinejoin="round"
      />
      <g fill={S}>
        <circle cx="58"  cy="106" r="2.5" /><circle cx="82"  cy="100" r="2.5" />
        <circle cx="106" cy="108" r="2.5" /><circle cx="130" cy="102" r="2.5" />
        <circle cx="70"  cy="118" r="2.5" /><circle cx="118" cy="120" r="2.5" />
      </g>
    </svg>
  ),

  'snow': (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 24 72 Q 22 50 46 46 Q 52 30 76 36 Q 86 22 106 32 Q 130 24 134 46 Q 156 46 158 64 Q 160 84 140 88 L 42 88 Q 24 88 24 72 Z"
        fill="white" stroke={S} strokeWidth={SW} strokeLinejoin="round"
      />
      {/* 3 snowflakes */}
      {[60, 100, 140].map(cx => (
        <g key={cx} stroke={S} strokeWidth={1.8} strokeLinecap="round">
          <line x1={cx} y1="100" x2={cx} y2="128" />
          <line x1={cx - 12} y1="114" x2={cx + 12} y2="114" />
          <line x1={cx - 8}  y1="106" x2={cx + 8}  y2="122" />
          <line x1={cx + 8}  y1="106" x2={cx - 8}  y2="122" />
          <circle cx={cx} cy="100" r="2" fill={S} stroke="none" />
          <circle cx={cx} cy="128" r="2" fill={S} stroke="none" />
          <circle cx={cx - 12} cy="114" r="2" fill={S} stroke="none" />
          <circle cx={cx + 12} cy="114" r="2" fill={S} stroke="none" />
        </g>
      ))}
    </svg>
  ),

  'thunderstorm': (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 20 68 Q 18 46 44 42 Q 50 26 76 32 Q 86 18 108 28 Q 134 20 138 42 Q 160 42 162 62 Q 164 84 142 86 L 38 86 Q 20 86 20 68 Z"
        fill="white" stroke={S} strokeWidth={SW} strokeLinejoin="round"
      />
      <g fill={S} opacity="0.25">
        <circle cx="48" cy="70" r="2" /><circle cx="66" cy="62" r="2" /><circle cx="84" cy="70" r="2" />
        <circle cx="102" cy="62" r="2" /><circle cx="120" cy="70" r="2" /><circle cx="138" cy="64" r="2" />
      </g>
      {/* Lightning bolt */}
      <polyline
        points="108,92 92,114 104,114 86,134"
        stroke={S} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
    </svg>
  ),

  'fog': (
    <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke={S} strokeWidth={3} strokeLinecap="round" opacity="0.7">
        <path d="M 28 38 Q 60 32 100 38 Q 140 44 172 38" />
        <path d="M 20 58 Q 55 52 100 58 Q 145 64 180 58" />
        <path d="M 28 78 Q 62 72 100 78 Q 138 84 172 78" />
        <path d="M 34 98 Q 66 92 100 98 Q 134 104 166 98" />
        <path d="M 42 118 Q 70 112 100 118 Q 130 124 158 118" />
      </g>
    </svg>
  ),
};

// fallback = partly-cloudy-day
ICONS['rain'] = ICONS['rain'];

interface Props {
  condition: WeatherCondition;
  isDay: boolean;
  city: string;
  loading: boolean;
}

export function WeatherDisplay({ condition, isDay, city, loading }: Props) {
  if (loading) {
    return <WeatherIllustration />;
  }

  const key = weatherKey(condition, isDay);
  const icon = ICONS[key] ?? ICONS['partly-cloudy-day'];

  return (
    <div className={styles.root}>
      <div className={styles.iconWrap} aria-hidden="true">{icon}</div>
      {city && <span className={styles.city}>{city.toUpperCase()}</span>}
    </div>
  );
}
