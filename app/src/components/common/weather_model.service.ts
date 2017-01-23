import {Injectable} from '@angular/core';
import {StorageService} from './storage.service';
import {RestService} from './rest.service';

@Injectable()
export class WeatherModelService {

  callFunctionsArray: Function[];
  weatherObject: Weather.IWeatherObject;

  // 10 minutes
  maxTimeValide: number = 10 * 60 * 1000;

  API: string = `94c7919f6854ca11558382472a998f8f`;

  typeRequest: string = 'GET';
  async: boolean = true;

  latitude: number = 0;
  longitude: number = 0;
  count: number = 1;

  lastUpdateTime: number;

  constructor(private storageService: StorageService,
          private restService: RestService
  ) {
    this.callFunctionsArray = [];
  }

  setWeatherParams(options: Weather.IWeatherParams) {
    this.longitude = options.longitude;
    this.latitude = options.latitude;
    this.count = options.count;
  }

  getWeatherInCircle(): Promise<Weather.IWeatherObject> {
    return new Promise((resolve, reject): void => {
      let lastUpdateTimeString: string = this.storageService.getData('lastUpdateTime');
      if (!lastUpdateTimeString) {
        // case: first load
        console.log('Nothing in storage. Load from internet.');
        this.initLoadInCircle(resolve, reject);
      } else {
        // in milliseconds
        this.lastUpdateTime = parseInt(lastUpdateTimeString, 10);
        let paramsString: string = this.storageService.getData('params');
        let params: Weather.IWeatherParams = <Weather.IWeatherParams> JSON.parse(paramsString);
        if ((this.lastUpdateTime > (Date.now() - this.maxTimeValide)) &&
            params.latitude === this.latitude &&
            params.longitude === this.longitude &&
            params.count === this.count
          ) {
            // case: in storage are valid data then load from storage
            console.log('Valid in storage. Load from storage.');
            let weatherString = this.storageService.getData('weather');
            this.weatherObject = <Weather.IWeatherObject> JSON.parse(weatherString);
            // call for model update
            this.callFunctionsInArray();
            resolve(this.weatherObject);
        } else {
          // case: in storage are expired data then load from internet
          console.log('Expired or invalid in storage. Load from internet.');
          this.initLoadInCircle(resolve, reject);
        }
      }
    });
  }

  // getFavoriteTownsWeather(): Weather.ITownWeather[] {
  //   let townsWeather: Weather.ITownWeather[] =
  //     <Weather.ITownWeather[]> JSON.parse(this.storageService.getData('favoriteTownsWeather'));
  //   return townsWeather? townsWeather : [];
  // }
  //
  // reloadFavoriteTownsWeather(): Promise<Weather.IWeatherObject> {
  //   let favoriteTownIds: number[] = JSON.parse(this.storageService.getData('favoriteTownsIds'));
  //   return new Promise((resolve, reject) => {
  //     if (favoriteTownIds) {
  //       this.loadWeatherByIds(favoriteTownIds).then(
  //         (weather: Weather.IWeatherObject) => {
  //           this.storageService.setData('favoriteTownsWeather', JSON.stringify(weather.list));
  //           resolve(weather);
  //         },
  //         () => {
  //           reject();
  //         }
  //       )
  //     } else {
  //       reject();
  //     }
  //   })
  // }

  // addToFavoriteById(id: number): Promise<Weather.IWeatherObject> {
  //   let townsIds: number[] =
  //     JSON.parse(this.storageService.getData('favoriteTownsIds'));
  //   if (!townsIds) {
  //     townsIds = [];
  //   }
  //   townsIds.push(id);
  //   this.storageService.setData('favoriteTownsIds', JSON.stringify(townsIds));
  //   return this.reloadFavoriteTownsWeather();
  // }
  //
  // addToFavorite(townWeather: Weather.ITownWeather): void {
  //   let townsWeather: Weather.ITownWeather[] =
  //     <Weather.ITownWeather[]> JSON.parse(this.storageService.getData('favoriteTownsWeather'));
  //   if (!townsWeather) {
  //     townsWeather = [];
  //   }
  //   townsWeather.push(townWeather);
  //   this.storageService.setData('favoriteTownsWeather', JSON.stringify(townsWeather));
  //
  //   // save ids
  //   let townsIds: number[] =
  //     JSON.parse(this.storageService.getData('favoriteTownsIds'));
  //   if (!townsIds) {
  //     townsIds = [];
  //   }
  //   townsIds.push(townWeather.id);
  //   this.storageService.setData('favoriteTownsIds', JSON.stringify(townsIds));
  // }

  // removeFromFavorite(townWeather: Weather.ITownWeather):void {
  //   let townsWeather: Weather.ITownWeather[] =
  //     <Weather.ITownWeather[]> JSON.parse(this.storageService.getData('favoriteTownsWeather'));
  //   let indexToDelete: number;
  //   if (townsWeather) {
  //     indexToDelete = townsWeather.findIndex((element) => {
  //       return element.id === townWeather.id;
  //     });
  //     townsWeather.splice(indexToDelete, 1);
  //   } else {
  //     townsWeather = [];
  //   }
  //   this.storageService.setData('favoriteTownsWeather', JSON.stringify(townsWeather));
  //
  //   // remove ids
  //   let townsIds: number[] = JSON.parse(this.storageService.getData('favoriteTownsIds'));
  //   let indexIdToDelete: number;
  //   if (townsIds) {
  //     indexIdToDelete = townsIds.findIndex((element) => {
  //       return element === townWeather.id;
  //     });
  //     townsIds.splice(indexIdToDelete, 1);
  //   } else {
  //     townsIds = [];
  //   }
  //   this.storageService.setData('favoriteTownsIds', JSON.stringify(townsIds));
  // }
  //
  // removeAllFavorites() {
  //   this.storageService.setData('favoriteTownsWeather', JSON.stringify([]));
  //   this.storageService.setData('favoriteTownsIds', JSON.stringify([]));
  // }

  getLastUpdateTime(): number {
    return parseInt(this.storageService.getData('lastUpdateTime'), 10);
  }

  getTownsWeather(): Weather.ITownWeather[] {
    return this.weatherObject.list;
  }

  loadWeatherByIds(ids: number[]): Promise<Weather.IWeatherObject> {
    return new Promise((resolve, reject): void => {
      let weather: Weather.IWeatherObject;
      let idsStringBody: string = '';
      ids.map((value: number, index: number) => {
        if (index > 0){
          idsStringBody = idsStringBody.concat(',', value.toString());
        } else {
          idsStringBody = value.toString();
        }
      });

      let urlTemplate = `http://api.openweathermap.org/data/2.5/group?id=` +
        `${idsStringBody}&appid=${this.API}`;

      this.restService.sendRequest(this.typeRequest, urlTemplate, this.async, '').then(
        (responseText: string) => {
          weather = <Weather.IWeatherObject> JSON.parse(responseText);
          resolve(weather);
        },
        () => {
          console.log('Cann\'t load data from weather portal!');
          alert('Cann\'t load data from weather portal!');
          reject();
        }
      );
    });
  }

  private initLoadInCircle(resolve: Function, reject: Function) {
    this.loadWeatherInCircle().then((weatherObj: Weather.IWeatherObject) => {
        this.lastUpdateTime = Date.now();
        this.weatherObject = weatherObj;
        this.storageService.setData('lastUpdateTime', JSON.stringify(this.lastUpdateTime));
        this.storageService.setData('weather', JSON.stringify(this.weatherObject));
        this.storageService.setData('params', JSON.stringify({
          longitude: this.longitude,
          latitude: this.latitude,
          count: this.count})
        );
        // call for model update
        this.callFunctionsInArray();
        resolve(this.weatherObject);
      },
      () => {
        reject();
      });
  }

  private loadWeatherInCircle(): Promise<Weather.IWeatherObject> {
    return new Promise((resolve, reject): void => {
      let weather: Weather.IWeatherObject;

      let urlTemplate = `http://api.openweathermap.org/data/2.5/find?lat=` +
        `${this.latitude}&lon=${this.longitude}&cnt=${this.count}&appid=${this.API}`;

      this.restService.sendRequest(this.typeRequest, urlTemplate, this.async, '').then(
        (responseText: string) => {
          weather = <Weather.IWeatherObject> JSON.parse(responseText);
          resolve(weather);
        },
        () => {
          console.log('Cann\'t load data from weather portal!');
          alert('Cann\'t load data from weather portal!');
          reject();
        }
      );
    });
  }

  // to deliver changes to other components
  addListener(callFunction: Function) {
    this.callFunctionsArray.push(callFunction);
  }

  private callFunctionsInArray() {
    this.callFunctionsArray.forEach( (value: Function) => {
      value();
    });
  }

}
