import { Component, OnInit, OnDestroy } from '@angular/core';
import { WeatherService } from '../shared/services/weather.service';
import { map } from 'rxjs/operators';
import { Subscription, forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { DailyWeatherResponse, WeatherAutocompleteResponse, GeolocationResponse, WeatherForecastResponse, DailyForecast } from '../shared/models/weather-response.model';
import { WeatherForecast, DailyWeather } from '../shared/models/weather.model';
import { AutocompleteData } from '../shared/models/autocomplete.model';
import * as WeatherActions from '../store/actions/weather.actions';
import * as fromApp from '../store/reducers';
import { fade } from './../aminations/animations';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  animations: [fade]
})

export class WeatherComponent implements OnInit, OnDestroy {
  dataSubscription: Subscription;
  searchSubscription: Subscription;
  fetchedCityIndex: number;
  fetchedCityName: string;
  dailyTemperature: number;
  weatherText: string;
  weatherIcon: string;
  isDailyLoading: boolean = false;
  currentWeatherForecast: WeatherForecast[];
  isForecastLoading: boolean = false;
  isInFavorites: boolean = false;
  isInitialDataLoading: boolean = false;
  keyword: string = 'name';
  autocompleteData: AutocompleteData[] = [];
  placeholder: string = 'Search for a city';
  isSearchValid: boolean = true;

  constructor(private weatherService: WeatherService,
    private store: Store<fromApp.AppState>,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initData()
    this.checkIsInFavorites();
    this.isInitialDataLoading = !this.fetchedCityIndex;
    if (this.isInitialDataLoading) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.weatherService.getGeolocation(latitude, longitude)
            .subscribe(getLocationResponse => this.fetchWeatherData(this.mapGeolocationData(getLocationResponse)));
        }, error => {
          this.toastr.error('Please accept geolocation in order to let the app set your default location', 'Error!');
        });
      } else {
        this.toastr.error('No support for geolocation', 'Error!');
      }
    }
  }

  initData(): void {
    this.dataSubscription = this.store.select('weather').subscribe(
      weatherStateData => {
        this.fetchedCityIndex = weatherStateData.currentDailyWeather.fetchedCityIndex;
        this.fetchedCityName = weatherStateData.currentDailyWeather.fetchedCityName;
        this.dailyTemperature = weatherStateData.currentDailyWeather.dailyTemperature;
        this.weatherText = weatherStateData.currentDailyWeather.weatherText;
        this.weatherIcon = weatherStateData.currentDailyWeather.weatherIcon;
        this.isDailyLoading = weatherStateData.isDailyLoading;
        this.currentWeatherForecast = weatherStateData.currentWeatherForecast;
        this.isForecastLoading = weatherStateData.isForecastLoading;
        this.isInFavorites = weatherStateData.isInFavorites;
      })

  }

  fetchWeatherData(selectedQuery: AutocompleteData): void {
    forkJoin([this.weatherService.getDailyWeather(selectedQuery.id),
    this.weatherService.getForecastWeather(selectedQuery.id)])
      .pipe(map(weatherData => {
        return this.mapAllWeatherData(weatherData, selectedQuery);
      })).subscribe(weatherData => {
        this.store.dispatch(new WeatherActions.UpdateDailyWeather(weatherData[0]));
        this.store.dispatch(new WeatherActions.UpdateForecastWeather(weatherData[1]));
      }, error => {
        this.toastr.error('An error occurred, Please try again later', 'Error!');
        this.store.dispatch(new WeatherActions.RemoveDailySpinner());
        this.store.dispatch(new WeatherActions.RemoveForecastSpinner());
      })
  }

  mapAllWeatherData(weatherForecastData: any, selectedQuery: AutocompleteData): [DailyWeather, WeatherForecast[]] {
    return [this.mapDailyWeatherData(weatherForecastData[0][0], selectedQuery), this.mapForecastWeatherData(weatherForecastData[1].DailyForecasts)];
  }

  mapDailyWeatherData(weatherDailyData: DailyWeatherResponse, selectedQuery: AutocompleteData): DailyWeather {
    return {
      fetchedCityIndex: selectedQuery.id,
      fetchedCityName: selectedQuery.name,
      dailyTemperature: weatherDailyData.Temperature.Metric.Value,
      weatherText: weatherDailyData.WeatherText,
      weatherIcon: weatherDailyData.WeatherIcon < 10 ? (0 + (weatherDailyData.WeatherIcon).toString()) : (weatherDailyData.WeatherIcon).toString()
    }
  }

  mapForecastWeatherData(dailyForecastsData: DailyForecast[]): WeatherForecast[] {
    return dailyForecastsData.map(mappedData => ({
      temperature: mappedData.Temperature.Minimum.Value,
      date: mappedData.Date,
      weatherIcon: mappedData.Day.Icon < 10 ? (0 + (mappedData.Day.Icon).toString()) : (mappedData.Day.Icon).toString(),
    }))
  }

  mapGeolocationData(geoLocationResponse: GeolocationResponse): AutocompleteData {
    return {
      id: +geoLocationResponse.Key,
      name: geoLocationResponse.LocalizedName,
      country: geoLocationResponse.Country.LocalizedName
    }
  }

  checkIsInFavorites(fetchedCityIndex: number = this.fetchedCityIndex): void {
    this.store.dispatch(new WeatherActions.CheckIsInFavorites({ fetchedCityIndex: fetchedCityIndex }));
  }

  AddToFavorites(): void {
    this.store.dispatch(new WeatherActions.AddFavorite({
      favoritesDailyWeather: {
        fetchedCityIndex: this.fetchedCityIndex,
        weatherText: this.weatherText,
        dailyTemperature: this.dailyTemperature,
        weatherIcon: this.weatherIcon,
        fetchedCityName: this.fetchedCityName
      },
      currentWeatherForecast: this.currentWeatherForecast
    }));
  }

  removeFromFavorites(): void {
    this.store.dispatch(new WeatherActions.RemoveFavorite({ fetchedCityIndex: this.fetchedCityIndex }));
  }

  onSelectEvent(selectedQuery: AutocompleteData): void {
    this.checkIsInFavorites(selectedQuery.id);
    this.fetchWeatherData(selectedQuery)
  }

  onChangeSearch(searchedQuery: string): void {
    if (searchedQuery !== '') {
      this.searchSubscription = this.weatherService.getAutocompleteSearch(searchedQuery)
        .pipe(map(autocompleteResults => {
          return this.mapAutoCompleteData(autocompleteResults);
        }))
        .subscribe(autocompleteResults => {
          this.autocompleteData = autocompleteResults;
        }, error => {
          this.toastr.error('An error occurred, Please try again later', 'Error!');
        })
    }
  }

  mapAutoCompleteData(autocompleteResults: WeatherAutocompleteResponse[]): AutocompleteData[] {
    return autocompleteResults.map(mappedData => ({
      id: +mappedData.Key,
      name: mappedData.LocalizedName,
      country: mappedData.Country.LocalizedName
    }))
  }

  allowEnglishLettersOnKeyUp(event: KeyboardEvent): void {
    const pattern = /^[A-Za-z ]+$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      this.isSearchValid = false;
      event.preventDefault();
    } else {
      this.isSearchValid = true;
    }
  }

  onAutocompleteCleared(): void {
    this.autocompleteData = [];
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    if (this.searchSubscription) this.searchSubscription.unsubscribe();
  }
}