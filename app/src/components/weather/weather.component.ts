import {Component, Input, NgZone} from '@angular/core';
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
  townsTable: Weather.ITownWeather[] ;

  constructor(
      private zone: NgZone,
      private weatherModelService: WeatherModelService
    ) {
    console.log('WeatherComponent init.');
    this.townsTable = [];
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
  }

  private updateTableList() {
    this.trigLoad = true;
    this.zone.run(() => {});
  }
}
