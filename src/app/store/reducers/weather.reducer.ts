import * as WeatherActions from '../actions/weather.actions';
import { WeatherForecast, DailyWeather } from '../../shared/models/weather.model';

export interface State {
  currentDailyWeather: DailyWeather,
  isDailyLoading: boolean,
  currentWeatherForecast: WeatherForecast[],
  isForecastLoading: boolean,
  favoritesList: number[],
  isInFavorites: boolean,
  favoritesDailyWeather: DailyWeather[],
  favoritesForecastWeather: WeatherForecast[],
}

const initialState: State = {
  currentDailyWeather: {
    fetchedCityIndex: null,
    fetchedCityName: '',
    dailyTemperature: null,
    weatherText: '',
    weatherIcon: ''
  },
  isDailyLoading: false,
  currentWeatherForecast: [],
  isForecastLoading: false,
  favoritesList: [],
  isInFavorites: false,
  favoritesDailyWeather: [],
  favoritesForecastWeather: []
}

export function weatherReducer(state: State = initialState, action: WeatherActions.WeatherActions) {
  switch (action.type) {
    case WeatherActions.UPDATE_DAILY_WEATHER:
      return {
        ...state,
        currentDailyWeather: action.payload,
        isDailyLoading: false
      }
    case WeatherActions.UPDATE_FORECAST_WEATHER:
      return {
        ...state,
        currentWeatherForecast: action.payload,
        isForecastLoading: false
      }
    case WeatherActions.SHOW_DAILY_SPINNER:
      return {
        ...state,
        isDailyLoading: true
      }
    case WeatherActions.SHOW_FORECAST_SPINNER:
      return {
        ...state,
        isForecastLoading: true
      }
    case WeatherActions.REMOVE_DAILY_SPINNER:
      return {
        ...state,
        isDailyLoading: false
      }
    case WeatherActions.REMOVE_FORECAST_SPINNER:
      return {
        ...state,
        isForecastLoading: false
      }
    case WeatherActions.ADD_FAVORITE:
      return {
        ...state,
        favoritesList: [...state.favoritesList, action.payload.favoritesDailyWeather.fetchedCityIndex],
        isInFavorites: true,
        favoritesDailyWeather: [...state.favoritesDailyWeather, action.payload.favoritesDailyWeather],
        favoritesForecastWeather: [...state.favoritesForecastWeather, action.payload.currentWeatherForecast]
      }
    case WeatherActions.REMOVE_FAVORITE:
      return {
        ...state,
        favoritesList: state.favoritesList.filter(favoriteItem => {
          return favoriteItem !== action.payload.fetchedCityIndex
        }),
        isInFavorites: false,
        favoritesDailyWeather: state.favoritesDailyWeather.filter((favoriteWeatherItem: any) => {
          return favoriteWeatherItem.fetchedCityIndex !== action.payload.fetchedCityIndex
        }),
        favoritesForecastWeather: state.favoritesForecastWeather.filter((favoriteWeatherItem, index) => {
          return index !== state.favoritesList.indexOf(action.payload.fetchedCityIndex)
        })
      }
    case WeatherActions.CHECK_IS_IN_FAVORITES:
      return {
        ...state,
        isInFavorites: state.favoritesList.includes(action.payload.fetchedCityIndex)
      }
    case WeatherActions.LOAD_WEATHER_FROM_FAVORITES:
      return {
        ...state,
        currentDailyWeather: state.favoritesDailyWeather[action.payload.fetchedCityIndex],
        currentWeatherForecast: state.favoritesForecastWeather[action.payload.fetchedCityIndex]
      }
    default:
      return state;
  }
}