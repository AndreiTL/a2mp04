import {Component, NgZone} from '@angular/core';
import {template} from './header.tpl';
import {WeatherModelService} from '../common/weather_model.service';

@Component({
  selector: 'my-header',
  template: template,
  providers: [ ]
})
export class HeaderComponent {

  lastUpddateTime: number;

  constructor(
    private weatherModelService: WeatherModelService,
    private zone: NgZone
  ) {
    weatherModelService.addListener(this.updateView.bind(this));
    this.lastUpddateTime = weatherModelService.getLastUpdateTime() || 0;
  }

  updateView(): void {
    // console.log('header zone run');
    this.lastUpddateTime = this.weatherModelService.getLastUpdateTime();
    this.zone.run(() => {});
  }

}
