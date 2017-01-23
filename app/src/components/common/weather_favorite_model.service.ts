import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {WeatherModelService} from './weather_model.service';

@Injectable()
export class WeatherFavoriteModelService {

  callFunctionsArray: Function[];
  weatherObject: Weather.IWeatherObject;

  // 10 minutes
  // maxTimeValide: number = 10 * 60 * 1000;

  // API: string = `94c7919f6854ca11558382472a998f8f`;

  // typeRequest: string = 'GET';
  // async: boolean = true;

  // latitude: number = 0;
  // longitude: number = 0;
  // count: number = 1;

  lastUpdateTime: number;

  constructor(
      private weatherModelService: WeatherModelService,
      private storageService: StorageService,


  ) {
    this.callFunctionsArray = [];
  }

  getFavoriteTownsWeather(): Weather.ITownWeather[] {
    let townsWeather: Weather.ITownWeather[] =
      <Weather.ITownWeather[]> JSON.parse(this.storageService.getData('favoriteTownsWeather'));
    return townsWeather? townsWeather : [];
  }

  reloadFavoriteTownsWeather(): Promise<Weather.IWeatherObject> {
    let favoriteTownIds: number[] = JSON.parse(this.storageService.getData('favoriteTownsIds'));
    return new Promise((resolve, reject) => {
      if (favoriteTownIds) {
        this.weatherModelService.loadWeatherByIds(favoriteTownIds).then(
          (weather: Weather.IWeatherObject) => {
            this.storageService.setData('favoriteTownsWeather', JSON.stringify(weather.list));
            resolve(weather);
          },
          () => {
            reject();
          }
        )
      } else {
        reject();
      }
    })
  }

  addToFavoriteById(id: number): Promise<Weather.IWeatherObject> {
    let townsIds: number[] =
      JSON.parse(this.storageService.getData('favoriteTownsIds'));
    if (!townsIds) {
      townsIds = [];
    }
    townsIds.push(id);
    this.storageService.setData('favoriteTownsIds', JSON.stringify(townsIds));
    return this.reloadFavoriteTownsWeather();
  }

  addToFavorite(townWeather: Weather.ITownWeather): void {
    let townsWeather: Weather.ITownWeather[] =
      <Weather.ITownWeather[]> JSON.parse(this.storageService.getData('favoriteTownsWeather'));
    if (!townsWeather) {
      townsWeather = [];
    }
    townsWeather.push(townWeather);
    this.storageService.setData('favoriteTownsWeather', JSON.stringify(townsWeather));

    // save ids
    let townsIds: number[] =
      JSON.parse(this.storageService.getData('favoriteTownsIds'));
    if (!townsIds) {
      townsIds = [];
    }
    townsIds.push(townWeather.id);
    this.storageService.setData('favoriteTownsIds', JSON.stringify(townsIds));
  }

  removeFromFavorite(townWeather: Weather.ITownWeather):void {
    let townsWeather: Weather.ITownWeather[] =
      <Weather.ITownWeather[]> JSON.parse(this.storageService.getData('favoriteTownsWeather'));
    let indexToDelete: number;
    if (townsWeather) {
      indexToDelete = townsWeather.findIndex((element) => {
        return element.id === townWeather.id;
      });
      townsWeather.splice(indexToDelete, 1);
    } else {
      townsWeather = [];
    }
    this.storageService.setData('favoriteTownsWeather', JSON.stringify(townsWeather));

    // remove ids
    let townsIds: number[] = JSON.parse(this.storageService.getData('favoriteTownsIds'));
    let indexIdToDelete: number;
    if (townsIds) {
      indexIdToDelete = townsIds.findIndex((element) => {
        return element === townWeather.id;
      });
      townsIds.splice(indexIdToDelete, 1);
    } else {
      townsIds = [];
    }
    this.storageService.setData('favoriteTownsIds', JSON.stringify(townsIds));
  }

  removeAllFavorites() {
    this.storageService.setData('favoriteTownsWeather', JSON.stringify([]));
    this.storageService.setData('favoriteTownsIds', JSON.stringify([]));
  }

  // getLastUpdateTime(): number {
  //   return parseInt(this.storageService.getData('lastUpdateTime'), 10);
  // }
  //
  // getTownsWeather(): Weather.ITownWeather[] {
  //   return this.weatherObject.list;
  // }

}
