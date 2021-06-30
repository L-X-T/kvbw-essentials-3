# Angular Pipes

- [Angular Pipes](#angular-pipes)
  - [Your first Angular pipe](#your-first-angular-pipe)
  - [Bonus: Create more pipes](#bonus-create-more-pipes)
    - [StatusColorPipe](#statuscolorpipe)
    - [StatusFilterPipe \*](#statusfilterpipe-)
    - [Service for a Pipe \*](#service-for-a-pipe-)
    - [Asynchronous service for a Pipe \*\*](#asynchronous-service-for-a-pipe-)

## Your first Angular pipe

1. In the _src/app_ folder, create the sub-folders _shared/pipes_. In this folder, create a new file _city.pipe.ts_ with a `CityPipe`.

   You may want to use the generator in your terminal (or your IDE):

   ```
   ng g p shared/pipes/city --dry-run
   ```

   Hint: Remove `--dry-run` to really create the pipe.

2. This pipe should transfrom the city names such as ` Graz` or `Hamburg` depending on a transferred parameter either on airport codes such as `GRZ` or ` HAM` or on long names such as `Flughafen Graz Thalerhof` or ` Airport Hamburg Helmut Schmidt`.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   import { Pipe, PipeTransform } from '@angular/core';

   @Pipe({
     standalone: true,
     name: 'city',
     pure: true, // actually not necessary since it's the default
   })
   export class CityPipe implements PipeTransform {
     transform(value: string, fmt: string): string {
       let short, long;

       switch (value) {
         case 'Graz':
           short = 'GRZ';
           long = 'Airport Graz Thalerhof';
           break;
         case 'Hamburg':
           short = 'HAM';
           long = 'Airport Hamburg Fulsbüttel Helmut Schmidt';
           break;
         case 'Wien':
           short = 'VIE';
           long = 'Airport Wien Schwechat';
           break;
         default:
           short = long = value; // shorthand, but maybe not very readable ;-)
       }

       if (fmt === 'short') {
         return short;
       }

       return long;
     }
   }
   ```

   </p>
   </details>

3. Make sure to import the `CityPipe` into your component:
   <details>
     <summary>Show source</summary>
     <p>

   ```typescript
   @Component({
     standalone: true,
     imports: [CommonModule, FormsModule, CityPipe],
     selector: 'app-flight-search',
     templateUrl: './flight-search.component.html',
     styleUrl: './flight-search.component.css',
   })
   export class FlightSearchComponent {}
   ```

     </p>
   </details>

4. Open the file _flight-search.component.html_ and use the `CityPipe` to format the cities of the flights found.

   <details>
   <summary>Show source</summary>
   <p>

   ```html
   <div class="card">
     @if (flights.length > 0) {
     <table class="table table-condensed">
       <thead>
         <tr>
           <th>Id</th>
           <th>From</th>
           <th>To</th>
           <th>Date</th>
           <th></th>
         </tr>
       </thead>

       <tbody>
         @for (flight of flights; track flight.id) {
         <tr [class.active]="flight === selectedFlight">
           <td>{{ flight.id }}</td>
           <td>{{ flight.from | city:'short' }}</td>
           <td>{{ flight.to | city:'long' }}</td>
           <td>{{ flight.date | date:'dd.MM.yyyy HH:mm' }}</td>
           <td><a (click)="select(flight)">Select</a></td>
         </tr>
         }
       </tbody>
     </table>
     }
   </div>
   ```

   </p>
   </details>

5. Test your solution.

## Bonus: Create more pipes

### StatusColorPipe

Create a `StatusColorPipe`, which maps the property _delayed_ of the flight (true or false) to a color. Use this pipe together with the _ngStyle_ directive to assign this color to the CSS property _color_ of the output status:

```html
<td [style.color]="flight.delayed | statusColor">{{ flight.date | date:'dd.MM.yyyy HH:mm'}}</td>
```

### StatusFilterPipe \*

Create a _StatusFilterPipe_, which filters an array with flights, so that only flights with a certain value for _delayed_ are returned. The pipe should be able to be used as follows:

```html
@for (flight of flights | statusFilter:true; track flight.id) {
<tr>
  […]
</tr>
}
```

The parameter _true_ indicates that only the flights with _delayed = true_ are to be returned.

The transform method of this pipe takes the entire array and then returns a filtered version:

```typescript
transform(flights: Flight[], delayed: boolean): Flight[] {
 […]
}
```

A description of the methods offered by the Array class can be found here:
[https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array)

### Service for a Pipe \*

Outsource the logic with the switch block to a new `AirportService`. Inject the `AirportService` into the pipe (works like components). Then call the service in the `transform` method and test your solution.

### Asynchronous service for a Pipe \*\*

Under the following urls you will find two services that provide the official short and the official long name of an airport (as a string):

- [http://angular-at.azurewebsites.net/api/airport/code?name=Graz](http://angular-at.azurewebsites.net/api/airport/code?name=Graz)
- [http://angular-at.azurewebsites.net/api/airport/fullName?name=Graz](http://angular-at.azurewebsites.net/api/airport/fullName?name=Graz)

Expand your airport service with methods that return the long or short name of an airport as `Observable<String>`.

Write a new `AsyncCityPipe` that injects this service. The `transform` method should delegate to the service and return the desired result in the form of the received as `Observable<string>`. In order for Angular to be able to resolve this observable, the async pipe must also be used in the template:

```html
[...] {{ flight.from | asyncCity:'short' | async }} [...]
```

**Important:** The pipe must be `pure` to avoid problems with the data binding. Pipes that are not pure are re-executed after each event. The fact that the pipe itself triggers a data event through the server request would result in an infinite loop.
