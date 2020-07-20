import { Action } from '@ngrx/store';
import { WeatherForecast, DailyWeather } from '../../shared/models/weather.model';

export const UPDATE_DAILY_WEATHER = 'UPDATE_DAILY_WEATHER';
export const SHOW_DAILY_SPINNER = 'SHOW_DAILY_SPINNER';
export const UPDATE_FORECAST_WEATHER = 'UPDATE_FORECAST_WEATHER';
export const SHOW_FORECAST_SPINNER = 'SHOW_FORECAST_SPINNER';
export const REMOVE_DAILY_SPINNER = 'REMOVE_DAILY_SPINNER';
export const REMOVE_FORECAST_SPINNER = 'REMOVE_FORECAST_SPINNER';
export const ADD_FAVORITE = 'ADD_FAVORITE';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';
export const CHECK_IS_IN_FAVORITES = 'CHECK_IS_IN_FAVORITES';
export const LOAD_WEATHER_FROM_FAVORITES = 'LOAD_WEATHER_FROM_FAVORITES';

export class UpdateDailyWeather implements Action {
  readonly type = UPDATE_DAILY_WEATHER;
  constructor(public payload: DailyWeather) { }
}

export class ShowDailySpinner implements Action {
  readonly type = SHOW_DAILY_SPINNER;
}

export class UpdateForecastWeather implements Action {
  readonly type = UPDATE_FORECAST_WEATHER;
  constructor(public payload: WeatherForecast[]) { }
}

export class ShowForecastSpinner implements Action {
  readonly type = SHOW_FORECAST_SPINNER;
}

export class RemoveDailySpinner implements Action {
  readonly type = REMOVE_DAILY_SPINNER;
}

export class RemoveForecastSpinner implements Action {
  readonly type = REMOVE_FORECAST_SPINNER;
}

export class AddFavorite implements Action {
  readonly type = ADD_FAVORITE;
  constructor(public payload: {
    favoritesDailyWeather: {
      fetchedCityIndex: number,
      weatherText: string,
      dailyTemperature: number,
      weatherIcon: string,
      fetchedCityName: string
    },
    currentWeatherForecast: WeatherForecast[]
  }) { }
}

export class RemoveFavorite implements Action {
  readonly type = REMOVE_FAVORITE;
  constructor(public payload: { fetchedCityIndex: number }) { }
}

export class CheckIsInFavorites implements Action {
  readonly type = CHECK_IS_IN_FAVORITES;
  constructor(public payload: { fetchedCityIndex: number }) { }
}

export class LoadWeatherFromFavorites implements Action {
  readonly type = LOAD_WEATHER_FROM_FAVORITES;
  constructor(public payload: { fetchedCityIndex: number }) { }
}

export type WeatherActions =
  UpdateDailyWeather |
  ShowDailySpinner |
  UpdateForecastWeather |
  ShowForecastSpinner |
  RemoveDailySpinner |
  RemoveForecastSpinner |
  AddFavorite |
  RemoveFavorite |
  CheckIsInFavorites |
  LoadWeatherFromFavorites;