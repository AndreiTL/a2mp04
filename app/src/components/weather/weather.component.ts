import {Component, Input, ChangeDetectorRef} from '@angular/core';
import {template} from './weather.tpl';

import {WeatherModelService} from '../common/weather_model.service';

@Component({
  selector: 'weather',
  template: template
})
export class WeatherComponent {
  @Input() location: ILocation.ICoordinates;
  @Input() amounttowns: string;

  weatherObject: Weather.IWeatherObject;

  trigLoad: boolean = false;
  trigLoadFavorite: boolean = false;
  townsTable: Weather.ITownWeather[] ;
  favoriteTownsTable: Weather.ITownWeather[];

  constructor(
      private cd: ChangeDetectorRef,
      private weatherModelService: WeatherModelService
    ) {
    console.log('WeatherComponent init.');
    this.townsTable = [];
    this.favoriteTownsTable = this.weatherModelService.getFavoriteTownsWeather();
  }

  ngAfterContentInit() {
    this.weatherModelService.setWeatherParams({
      latitude: this.location.latitude,
      longitude: this.location.longitude,
      count: parseInt(this.amounttowns, 10)
    });
    this.weatherModelService.getWeatherInCircle().then(
      (weatherObj: Weather.IWeatherObject) => {
        this.weatherObject = weatherObj;
        this.townsTable = this.weatherObject.list;
      },
      () => {
        console.log('Cann\'t update table list! Input parameter is empty!');
        alert('Cann\'t update table list! Input parameter is empty!');
      }
    ).then( () => {
      this.updateTableList();
    });
    // this.favoriteTownsTable = this.weatherModelService.getFavoriteTownsWeather();
  }

  addTownFavorite(town: Weather.ITownWeather) {
    console.log(" Add to favorite " + town.id);
    this.weatherModelService.addToFavorite(town);
    this.favoriteTownsTable = this.weatherModelService.getFavoriteTownsWeather();
  }

  removeTownFavorite(town: Weather.ITownWeather) {
    console.log(" Remove from favorite " + town.id);
    this.weatherModelService.removeFromFavorite(town);
    this.favoriteTownsTable = this.weatherModelService.getFavoriteTownsWeather();
  }

  reloadFavoritesTownsWeather(): void {
    this.trigLoadFavorite = true;
    this.weatherModelService.reloadFavoriteTownsWeather().then(
      (weather: Weather.IWeatherObject) => {
        this.favoriteTownsTable = weather.list;
        this.trigLoadFavorite = false;
      },
      () => {
        this.trigLoadFavorite = false;
        console.log(" Cann't reload weather for favorite towns. ");
        alert(" Cann't reload weather for favorite towns. ");
      }
    );
  }

  private updateTableList() {
    this.trigLoad = true;
    this.cd.detectChanges();
  }
}
