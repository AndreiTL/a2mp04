export const template = `
<div>
    <div>Weather in towns: </div>
      
    <div *ngIf="trigLoad">
        <ul>
          <li *ngFor="let town of townsTable" class="rowelement">
              <table class="tablerow">
                <tr>
                    <td><span class="townname">{{town.name}}</span></td>
                    <td></td>
                    <td><span>{{town.wind.deg | windDirectionTextPipe}}</span></td>
                </tr>
                <tr>
                    <td><span>Temperature: </span><span>{{town.main.temp | temperatureCelciumPipe}}</span></td>
                    <td><span>Humidity: </span><span>{{town.main.humidity||''}}</span></td>
                    <td><span>Wind: </span><span>{{town.wind.speed||''}}</span><span> m/s</span></td>
                </tr>
            </table>
          </li>
      </ul>
    </div>    
</div>
`;
