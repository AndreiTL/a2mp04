import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';

import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';

import { GooglemapComponent } from './components/googlemap/googlemap.component';
import { WeatherComponent } from './components/weather/weather.component';

import {GoogleMapLoaderService} from './components/common/google_maps_loader.service';
import {LocationService} from './components/common/location.service';
import {StorageService} from './components/common/storage.service';
import {MarkersService} from './components/common/markers.service';
import {RestService} from './components/common/rest.service';
import {WeatherModelService} from './components/common/weather_model.service';

import {TemperatureCelciumPipe} from './components/common/pipes/temperature.pipe';
import {WindDirectionTextPipe} from './components/common/pipes/winddirectiontext.pipe';

@NgModule({
  imports:      [ BrowserModule ],
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    GooglemapComponent,
    WeatherComponent,
    TemperatureCelciumPipe,
    WindDirectionTextPipe
  ],
  providers: [
    RestService,
    MarkersService,
    StorageService,
    LocationService,
    WeatherModelService,
    GoogleMapLoaderService],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
