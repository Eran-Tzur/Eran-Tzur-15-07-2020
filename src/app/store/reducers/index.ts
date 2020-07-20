import * as fromWeather from './weather.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
  weather: fromWeather.State;
}

export const appReducer: ActionReducerMap<any> = {
  weather: fromWeather.weatherReducer
}