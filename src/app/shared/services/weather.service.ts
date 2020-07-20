import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { DailyWeatherResponse, WeatherForecastResponse, WeatherAutocompleteResponse, GeolocationResponse } from '../models/weather-response.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private weatherAPIKey = environment.weatherAPIKey;
  private apiDaily = environment.apiDaily;
  private apiAutocomplete = environment.apiAutocomplete;
  private apiForecast = environment.apiForecast;
  private apiGeoLocation = environment.apiGeoLocation;

  constructor(private http: HttpClient) { }

  getAutocompleteSearch(searchedQuery: string): Observable<WeatherAutocompleteResponse[]> {
    return this.http.get<WeatherAutocompleteResponse[]>(`${this.apiAutocomplete}?apikey=${this.weatherAPIKey}&q=${searchedQuery}`);
  }

  getDailyWeather(fetchedCityIndex: number): Observable<DailyWeatherResponse[]> {
    return this.http.get<DailyWeatherResponse[]>(`${this.apiDaily}/${fetchedCityIndex}?apikey=${this.weatherAPIKey}`);
  }

  getForecastWeather(fetchedCityIndex: number): Observable<WeatherForecastResponse[]> {
    return this.http.get<WeatherForecastResponse[]>(`${this.apiForecast}/${fetchedCityIndex}?apikey=${this.weatherAPIKey}&metric=true`);
  }

  getGeolocation(latitude: number, longitude: number): Observable<GeolocationResponse> {
    return this.http.get<GeolocationResponse>(`${this.apiGeoLocation}?apikey=${this.weatherAPIKey}&q=${latitude},${longitude}&toplevel=true`);
  }

}