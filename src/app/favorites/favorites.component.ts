import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as WeatherActions from './../store/actions/weather.actions';
import * as fromApp from '../store/reducers';
import { Subscription } from 'rxjs';
import { DailyWeather } from '../shared/models/weather.model';
import { fade } from './../aminations/animations';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  animations: [fade]
})
export class FavoritesComponent implements OnInit, OnDestroy {
  dataSubscription: Subscription;
  checkFavoritesSubscription: Subscription;
  favoritesDailyWeather: DailyWeather[] = [];
  selectedIndex: number;

  constructor(private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.initData()
  }

  initData(): void {
    this.dataSubscription = this.store.select('weather').subscribe(
      weatherStateData => {
        this.favoritesDailyWeather = weatherStateData.favoritesDailyWeather;
      })
  }

  navigateToHome(weatherItem: DailyWeather): void {
    this.checkFavoritesSubscription = this.store.select('weather').subscribe(
      weatherStateData => this.selectedIndex = weatherStateData.favoritesList.indexOf(weatherItem.fetchedCityIndex));
    this.store.dispatch(new WeatherActions.LoadWeatherFromFavorites({ fetchedCityIndex: this.selectedIndex }));
    this.router.navigate([`/`]);
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    if (this.checkFavoritesSubscription) this.checkFavoritesSubscription.unsubscribe();
  }
}