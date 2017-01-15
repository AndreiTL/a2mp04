export const template = `
<div>
    <div>Favorite Towns:</div>
    <div *ngIf="favoriteTownsTable.length > 0">
        <ul>
          <li *ngFor="let town of favoriteTownsTable" class="rowelement">
              <table class="tablerow">
                <tr>
                    <td><span class="townname">{{town.name}}</span></td>
                    <td></td>
                    <td><span>{{town.wind.deg | windDirectionTextPipe}}</span></td>
                    <td>
                        <button (click)="removeTownFavorite(town)">
                            <span>Unfav</span>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td><span>Temperature: </span><span>{{town.main.temp | temperatureCelciumPipe}}</span></td>
                    <td><span>Humidity: </span><span>{{town.main.humidity||''}}</span></td>
                    <td><span>Wind: </span><span>{{town.wind.speed||''}}</span><span> m/s</span></td>
                    <td></td>
                </tr>
            </table>
          </li>
      </ul>
    </div>

    <div>Weather in towns: </div>
      
    <div *ngIf="trigLoad">
        <ul>
          <li *ngFor="let town of townsTable" class="rowelement">
              <table class="tablerow">
                <tr>
                    <td><span class="townname">{{town.name}}</span></td>
                    <td></td>
                    <td><span>{{town.wind.deg | windDirectionTextPipe}}</span></td>
                    <td>
                        <button (click)="addTownFavorite(town)">
                            <span>Fav</span>
                        </button>
                    </td>
                </tr>
                <tr>
                    <td><span>Temperature: </span><span>{{town.main.temp | temperatureCelciumPipe}}</span></td>
                    <td><span>Humidity: </span><span>{{town.main.humidity||''}}</span></td>
                    <td><span>Wind: </span><span>{{town.wind.speed||''}}</span><span> m/s</span></td>
                    <td></td>
                </tr>
            </table>
          </li>
      </ul>
    </div>    
</div>
`;
