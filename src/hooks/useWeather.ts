import { useState, useEffect } from 'react';
import type { WeatherState } from '../types';
import { wmoToCondition } from '../utils/weather';

const DEFAULT: WeatherState = {
  condition: 'clear',
  isDay: true,
  city: '',
  loading: true,
};

export function useWeather(): WeatherState {
  const [state, setState] = useState<WeatherState>(DEFAULT);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const geoRes = await fetch('https://ipapi.co/json/');
        if (!geoRes.ok) throw new Error('geo');
        const geo: { latitude: number; longitude: number; city: string } = await geoRes.json();

        const wxRes = await fetch(
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${geo.latitude}&longitude=${geo.longitude}` +
          `&current=weather_code,is_day&timezone=auto`
        );
        if (!wxRes.ok) throw new Error('wx');
        const wx: { current: { weather_code: number; is_day: number } } = await wxRes.json();

        if (!cancelled) {
          setState({
            condition: wmoToCondition(wx.current.weather_code),
            isDay: wx.current.is_day === 1,
            city: geo.city ?? '',
            loading: false,
          });
        }
      } catch {
        if (!cancelled) {
          setState({ condition: 'clear', isDay: true, city: '', loading: false });
        }
      }
    };

    load();
    // refresh weather every 15 minutes
    const interval = setInterval(load, 15 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return state;
}
