import { describe, expect, it } from 'vitest';
import { getWeatherStyle, weatherKey, wmoToCondition } from '../../src/utils/weather';

describe('weather utils', () => {
  it('builds day/night keys correctly', () => {
    expect(weatherKey('clear', true)).toBe('clear-day');
    expect(weatherKey('clear', false)).toBe('clear-night');
    expect(weatherKey('rain', false)).toBe('rain');
  });

  it('maps WMO code to app condition', () => {
    expect(wmoToCondition(0)).toBe('clear');
    expect(wmoToCondition(3)).toBe('cloudy');
    expect(wmoToCondition(55)).toBe('drizzle');
    expect(wmoToCondition(95)).toBe('thunderstorm');
  });

  it('returns weather style payload', () => {
    const style = getWeatherStyle('partly-cloudy', false);
    expect(style.gradient).toContain('linear-gradient');
    expect(style.isDark).toBe(true);
  });
});
