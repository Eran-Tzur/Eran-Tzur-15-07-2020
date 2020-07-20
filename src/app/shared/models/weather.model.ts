export interface WeatherForecast {
  temperature: number;
  date: string;
  weatherIcon: string;
}

export interface DailyWeather {
  fetchedCityIndex: number;
  fetchedCityName: string;
  dailyTemperature: number;
  weatherText: string;
  weatherIcon: string;
}