export type WeatherApiResponse = {
  weather: Weather[];
  main: { temp: number; feels_like: number; humidity: number };
  wind: { speed: number };
};

type Weather = {
  description: string;
  icon: string;
};
