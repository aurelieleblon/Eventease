// utils/weather.ts
const API_KEY = '87607f398bbf24869160e3df39cb694e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getWeather = async (city: string, date?: string) => {
  try {
    const response = await fetch(`${BASE_URL}?q=${city}&units=metric&lang=fr&appid=${API_KEY}`);
    const data = await response.json();

    if (data.cod !== 200) {
      console.error('Erreur météo :', data.message);
      return null;
    }

    return {
      city: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error('Erreur de connexion API météo →', error);
    return null;
  }
};
