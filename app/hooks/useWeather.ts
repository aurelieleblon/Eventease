import { useState } from 'react';
import { getWeather as fetchWeather } from '../services/weather';

export function useWeather() {
  const [weather, setWeather] = useState<any>(null);

  const load = async (city: string) => {
    const data = await fetchWeather(city);
    setWeather(data);
  };

  return { weather, load };
}