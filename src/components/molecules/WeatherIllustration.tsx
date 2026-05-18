import type { CSSProperties } from 'react';
import styles from './WeatherIllustration.module.css';

interface Props {
  style?: CSSProperties;
}

export function WeatherIllustration({ style }: Props) {
  return (
    <div className={styles.root} style={style} aria-hidden="true">
      <svg viewBox="0 0 260 150" className={styles.svg} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sun rays */}
        <g stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round">
          <line x1="62" y1="6"  x2="62" y2="18" />
          <line x1="62" y1="64" x2="62" y2="76" />
          <line x1="30" y1="14" x2="38" y2="22" />
          <line x1="86" y1="60" x2="94" y2="68" />
          <line x1="16" y1="41" x2="28" y2="41" />
          <line x1="96" y1="41" x2="108" y2="41" />
          <line x1="30" y1="66" x2="38" y2="58" />
          <line x1="86" y1="22" x2="94" y2="14" />
        </g>

        {/* Sun body */}
        <circle cx="62" cy="41" r="22" fill="white" stroke="#1a1a1a" strokeWidth="2.5" />
        {/* Halftone dots on sun */}
        <g fill="#1a1a1a">
          <circle cx="55" cy="34" r="1.8" />
          <circle cx="62" cy="34" r="1.8" />
          <circle cx="69" cy="34" r="1.8" />
          <circle cx="55" cy="41" r="1.8" />
          <circle cx="62" cy="41" r="1.8" />
          <circle cx="69" cy="41" r="1.8" />
          <circle cx="55" cy="48" r="1.8" />
          <circle cx="62" cy="48" r="1.8" />
          <circle cx="69" cy="48" r="1.8" />
        </g>

        {/* Large cloud covering part of sun */}
        <path
          d="M52 105 Q50 82 72 80 Q78 64 100 68 Q112 56 132 66 Q154 58 158 80 Q178 80 178 98 Q178 116 158 116 L68 116 Q52 116 52 105Z"
          fill="white" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round"
        />
        {/* Cloud halftone dots */}
        <g fill="#1a1a1a" opacity="0.35">
          <circle cx="78"  cy="96"  r="2.2" />
          <circle cx="92"  cy="88"  r="2.2" />
          <circle cx="106" cy="96"  r="2.2" />
          <circle cx="120" cy="88"  r="2.2" />
          <circle cx="134" cy="96"  r="2.2" />
          <circle cx="148" cy="90"  r="2.2" />
          <circle cx="85"  cy="107" r="2.2" />
          <circle cx="99"  cy="107" r="2.2" />
          <circle cx="113" cy="107" r="2.2" />
          <circle cx="127" cy="107" r="2.2" />
          <circle cx="141" cy="107" r="2.2" />
        </g>

        {/* Small cloud top-right */}
        <path
          d="M172 72 Q172 58 185 58 Q190 48 204 52 Q218 48 220 62 Q232 62 232 74 Q232 86 220 86 L184 86 Q172 86 172 74Z"
          fill="white" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round"
        />
        <g fill="#1a1a1a" opacity="0.3">
          <circle cx="185" cy="70" r="1.8" />
          <circle cx="196" cy="64" r="1.8" />
          <circle cx="208" cy="70" r="1.8" />
          <circle cx="191" cy="79" r="1.8" />
          <circle cx="203" cy="79" r="1.8" />
        </g>
      </svg>
    </div>
  );
}
