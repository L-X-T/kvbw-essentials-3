# Router

- [Router](#router)
  - [Routing](#routing)
  - [Bonus: Routes with hash fragment and tracing \*](#bonus-routes-with-hash-fragment-and-tracing-)
  - [Parametrizable Routes](#parametrizable-routes)
  - [Bonus: Edit flights \*](#bonus-edit-flights-)
  - [Bonus: Programatic Routing \*](#bonus-programatic-routing-)

## Routing

In this exercise, you will implement the following menu structure with routing:

```
   AppComponent
      +----------- HomeComponent (Dummy)
      +----------- AirportComponent
      +----------- FlightSearchComponent
      +----------- PassengerSearchComponent (Dummy)
```

The following pattern is taken into account:

- The `AppComponent` and `HomeComponent` are part of the `app.routes.ts`
- The other two components are part of the `flight-booking.routes.ts` in the `flight-booking` folder.

If you want, guide the following through the exercise:

1. Add the following additional (dummy) components that are to serve as routing targets:

   - HomeComponent (folder `src/app/home`)
   - PassengerSearchComponent (folder `src/app/flight-booking/passenger-search`)

2. Create a route configuration `app.routes.ts` in the `src/app` folder.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   import { Route } from '@angular/router';

   import { AirportsComponent } from './airports/airports.component';
   import { HomeComponent } from './home/home.component';

   import flightBookingRoutes from './flight-booking/flight-booking.routes';

   export const appRoutes: Route[] = [
     {
       path: '',
       redirectTo: 'home',
       pathMatch: 'full',
     },

     {
       path: 'airports',
       component: AirportsComponent,
     },
     {
       path: 'home',
       component: HomeComponent,
     },

     {
       path: 'flight-booking',
       children: flightBookingRoutes,
     },

     /*{
       path: '**',
       redirectTo: '',
      },*/
   ];
   ```

   </p>
   </details>

3. In the folder `src/app/flight-booking` create a file `flight-booking.routes.ts` with a route configuration for the `FlightSearchComponent` and the `PassengerSearchComponent`.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   export const flightBookingRoutes: Routes = [
     {
       path: 'flight-search',
       component: FlightSearchComponent,
     },
     {
       path: 'passenger-search',
       component: PassengerSearchComponent,
     },
   ];
   ```

   </p>
   </details>

4. Open your `app.config.ts` and add `provideRouter`:

   ```typescript
   export const appConfig: ApplicationConfig = {
     providers: [
       provideHttpClient(),
       provideRouter(
         appRoutes,
         // withDebugTracing(),
         // withEnabledBlockingInitialNavigation()
       ),
     ],
   };
   ```

5. Open the `app.component.html` file and replace the call to `app-flight-search` with a placeholder (`<router-outlet> </router-outlet>`) for the Router.

   <details>
   <summary>Show source</summary>
   <p>

   ```html
   <div class="content">
     <!-- <app-flight-search /> -->
     <!-- <app-airports /> -->
     <!-- old -->

     <router-outlet />
     <!-- new -->
   </div>
   ```

   </p>
   </details>

   Make sure to add the `RouterOutlet` import to your `app.component.ts` file.

6. Open the `sidebar.component.html` file and update the menu entries with the routerLink attribute in order to activate the individual routes.

   <details>
   <summary>Show source</summary>
   <p>

   ```html
   <ul class="nav">
     <li routerLinkActive="active">
       <a routerLink="/home">
         <i class="ti-home"></i>
         <p>Home</p>
       </a>
     </li>

     <li routerLinkActive="active">
       <a routerLink="/airports">
         <i class="ti-arrow-top-right"></i>
         <p>Airports</p>
       </a>
     </li>

     <li routerLinkActive="active">
       <a routerLink="/flight-booking/flight-search">
         <i class="ti-arrow-top-right"></i>
         <p>Flight Search</p>
       </a>
     </li>

     <li routerLinkActive="active">
       <a routerLink="/flight-booking/passenger-search">
         <i class="ti-user"></i>
         <p>Passenger Search</p>
       </a>
     </li>

     [...]
   </ul>
   ```

   </p>
   </details>

7. Make sure to add all necessary imports (e.g. `routerLinkActive`, `routerLink`) to the `sidebar.component.ts`.

8. Check with the TypeScript compiler in your IDE whether there are any compilation errors and correct them if necessary.

9. Test your solution.

## Bonus: Routes with hash fragment and tracing \*

In order to influence the way the router works, the `forRoot` method accepts an object via the second optional parameter. This can be used to specify, for example, that routes are to be positioned in the hash fragment of the url (e.g. http://localhost:4200/#route instead of http://localhost:4200/route) or that the router should output tracing messages on the console:

```typescript
RouterModule.forRoot(appRoutes, { useHash: true, enableTracing: true });
```

Activate these options and make sure that the route is then placed in the hash fragment and that the router outputs information about the routing to the console.

Afterwards disable the hash fragment again for the upcoming exercises: `useHash: false`

## Parametrizable Routes

In this exercise you will create a new component `FlightEditComponent` in the `FlightBookingModule`:

```
   AppComponent
      +----------- HomeComponent
      +----------- FlightSearchComponent ---- id ----+
      +----------- PassengerSearchComponent          |
      +----------- FlightEditComponent [new!] <------+
```

This should receive an Id as a url segment and a matrix parameter showDetails which for the time being will only be printed in the template. The component should be able to be called up via your `FlightCardComponents`.

1. Use your existing or if not create a `FlightEditComponent` (as a dummy component) in the folder `src/app/flight-booking/flight-edit`.

2. Have the ActivatedRoute injected into the `FlightEditComponent` and call up the matrix parameters `id` and `showDetails`.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   @Component({
     selector: 'app-flight-edit',
     templateUrl: './flight-edit.component.html',
   })
   export class FlightEditComponent implements OnChanges {
     id?: number | null;
     showDetails = false;

     private readonly route = inject(ActivatedRoute);
     private readonly paramsSubscription = this.route.params.subscribe((params) => {
       this.id = +params['id'];
       this.showDetails = params['showDetails'] === 'true';
     });
   }
   ```

   </p>
   </details>

3. Open the file `flight-edit.component.html` and output the parameters you have called up there.

   <details>
   <summary>Show source</summary>
   <p>

   ```html
   <div class="card">
     <div class="header">
       <h1 class="title">Flight Edit</h1>
     </div>

     <div class="content">
       <p>Id: {{ id }}</p>
       <p>ShowDetails: {{ showDetails }}</p>
     </div>
   </div>
   ```

   </p>
   </details>

4. Open the file `flight-booking.routes.ts` and add a route for the new `FlightEditComponent`.

    <details>
    <summary>Show source</summary>
    <p>

   ```typescript
   export const flightBookingRoutes: Routes = [
     […],
     {
       path: 'flight-edit/:id',
       component: FlightEditComponent
     }
   ];
   ```

   The segment `:id` stands here as a placeholder for the parameter id. Since there is no placeholder for the `showDetails` parameter, it must be transferred as a matrix parameter.

    </p>
    </details>

5. Open the file `flight-card.component.html` and insert a link for the new route.

   <details>
   <summary>Show source</summary>
   <p>

   ```html
   <a class="btn btn-default" [routerLink]="['/flight-booking', 'flight-edit', item.id, { showDetails: true }]">
     Edit
   </a>
   ```

   </p>
   </details>

6. Check with the TypeScript compiler in your IDE whether there are any compilation errors and correct them if necessary.

7. Test your solution: Search for flights and click on Edit for one of the flights found.

## Bonus: Edit flights \*

In this exercise you create the opportunity to edit the flight presented in the `FlightEditComponent`.

1. Open the file `flight.service.ts` and add a method `findById`, which delivers a flight within the scope of an observable based on the ID, and a method save, which receives a flight and saves it.

   To retrieve a flight using the id, you can use the `HttpClient` to make a GET call with the id parameter.

   To save, you can send a flight to the server using the `post` method of the `HttpClient`:

   ```typescript
   return this.http.post<Flight>(url, flight, { headers });
   ```

   Note that the data records with IDs 1 to 5 cannot be saved as they are reserved for presentations.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   findById(id: string): Observable<Flight> {
     const url = 'http://www.angular.at/api/flight';
     const params = new HttpParams().set('id', id);
     const headers = new HttpHeaders().set('Accept', 'application/json');

     return this.http.get<Flight>(url, { params, headers });
   }

   save(flight: Flight): Observable<Flight> {
     const url = 'http://www.angular.at/api/flight';
     const headers = new HttpHeaders().set('Accept', 'application/json');

     return this.http.post<Flight>(url, flight, { headers });
   }
   ```

  </p>
  </details>

2. Open the `flight-edit.component.ts` and add a flight property of the Flight type and an errors property of the string type. This property is intended to accommodate any errors that may arise when saving. Also, get the FlightService injected.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   @Component({
     selector: 'app-flight-edit',
     templateUrl: './flight-edit.component.html'
   })
   export class FlightEditComponent implements OnChanges {
     id = '';
     showDetails = false;

     flight?: Flight | null;

     message = '';

     private readonly route = inject(ActivatedRoute);
     private readonly flightService = inject(FlightService);

     […]
   }
   ```

   </p>
   </details>

3. Load the respective flight in the `FlightEditComponent` after calling up the `id` parameter and offer a `save` method for saving.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   @Component({
     selector: 'app-flight-edit',
     templateUrl: './flight-edit.component.html'
   })
   export class FlightEditComponent implements OnChanges {
     […]

     private readonly paramsSubscription = this.route.params.subscribe((params) => this.handleRouteParams(params));

     [...]

     private handleRouteParams(params: Params): void {
       this.id = +params['id'];
       this.showDetails = params['showDetails'] === 'true';

       this.flightService.findById(this.id).subscribe({
         next: (flight) => {
           this.flight = flight;
           this.editForm.patchValue(flight);
           this.message = 'Success loading!';
         },
         error: (err: HttpErrorResponse) => {
           console.error('Error', err);
           this.message = 'Error Loading!';
         }
       });
     }

     onSave(): void {
       this.flightService.save(this.editForm.value as Flight).subscribe({
         next: (flight) => {
           this.flight = flight;
           this.message = 'Success saving!';
         },
         error: (err: HttpErrorResponse) => {
           console.error('Error', err);
           this.message = 'Error saving!';
         }
       });
     }
   }
   ```

   </p>
   </details>

4. Open the file `flight-edit.component.html` and provide a form for editing the loaded flight:

   ```html
   @if (flightToEdit) {
   <form [formGroup]="editForm">
     <!-- Add more fields for the other attributes of flight -->

     <button type="submit" class="btn btn-default" (click)="save()">Save</button>
   </form>
   }
   ```

5. If - and only if - you have not provided your `FlightService` in root (the `AppModule` via the `@Injectable()` decorator). Open the file `flight-booking.module.ts` and make sure that the `FlightService` is registered here.

    <details>
    <summary>Show source</summary>
    <p>

   ```typescript
   @NgModule({
     imports: [CommonModule, FormsModule, SharedModule, RouterModule.forChild(flightBookingRoutes)],
     declarations: [FlightSearchComponent, FlightCardComponent, PassengerSearchComponent, FlightEditComponent],
     providers: [
       FlightService, // <-- this is important
     ],
     exports: [FlightSearchComponent],
   })
   export class FlightBookingModule {}
   ```

    </p>
    </details>

   This registers the `FlightService` as a global service in the feature module. Since it is now used by several components, this is useful. You might also move it to the directory `src/app/flight-booking/services` – if you do so, make sure all imports are updated correctly by your IDE. Alternatively, it could also be registered for the FlightBookingComponent.

6. Check with the TypeScript compiler in your IDE whether there are any compilation errors and correct them if necessary.

7. Test your solution. Again note that you cannot change data records 1 to 5 and that you can create a new data record by specifying ID 0.

## Bonus: Programatic Routing \*

See the documentation for the router's navigate method under [1]. Let the router inject you into the `FlightEditComponent` and use its `navigate` method after successful saving to lead the user back to the search mask.

<details>
<summary>Show source</summary>
<p>

```typescript
setTimeout(() => this.router.navigate(['/flight-search']), 3000); // delayed by 3s
```

</p>
</details>

Extension: After redirecting to the search mask, display a success message for the last save process.
