# Angular Intro

- [Angular Intro](#angular-intro)
  - [Your first Angular component](#your-first-angular-component)
    - [Component for searching for flights](#component-for-searching-for-flights)
    - [Use the debugger](#use-the-debugger)
    - [Bonus: Edit flights \*](#bonus-edit-flights-)

## Your first Angular component

### Component for searching for flights

In this first part of the exercise you will implement the `FlightSearchComponent`. You can follow these tutorial steps or do it your own way and just look up here for reference:

1. Create a folder _entities_ in your _src/app_ folder.

2. In _entities_ create a new file _flight.ts_:

   ```typescript
   export type Flight = {
     id: number;
     from: string;
     to: string;
     date: string;
     delayed: boolean;
   };
   ```

3. In the folder _src/app_ create a `FlightSearchComponent`

   **Important:** There are several ways to generate a component:

   - **Visual Studio Code:** If you have installed the recommended Angular plugins go to context menu: `Angular: Generate a Component`.
   - **WebStorm/IntelliJ**: Here you'll find in your context menu the item `Angular Schematics`.
   - **Terminal/Shell**: Or you can do it in your terminal/shell by using the following commands:

   ```
   ng generate component flight-search
   ```

   Or use the shorthand:

   ```
   ng g c flight-search
   ```

   With the flag --help you'll see the information for these command parts:

   ```
   ng g --help
   ng g c --help
   ```

4. Add the following members to your class `FlightSearchComponent`:

   ```typescript
   @Component({
     selector: 'app-flight-search',
     templateUrl: './flight-search.component.html',
   })
   export class FlightSearchComponent {
     from = '';
     to = '';
     flights: Flight[] = [];
     selectedFlight?: Flight;

     private readonly http = inject(HttpClient);

     search(): void {
       // implementation will follow shortly
     }

     select(flight: Flight): void {
       this.selectedFlight = flight;
     }
   }
   ```

5. Now implement the method _search_, so that it takes the _from_ and _to_ parameter and uses the injected `HttpClient` to search for flights and put them into `flights`.

   Note: You can use this API endpoint: http://www.angular.at/api/flight

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   search(): void {
     const url = 'http://www.angular.at/api/flight';
     const headers = new HttpHeaders().set('Accept', 'application/json');
     const params = new HttpParams().set('from', this.from).set('to', this.to);

     // Please note, that we currently do not unsubscribe from this
     // We'll talk about this later in the workshop
     this.http.get<Flight[]>(url, {headers, params}).subscribe({
       next: (flights: Flight[]) => {
         this.flights = flights;
       },
       error: (errResp) => {
         console.error('Error loading flights', errResp);
       }
     });
   }
   ```

 </p>
 </details>

6. Switch to `flight-search.component.html`, the corresponding HTML template and insert a div with the search form. You can use the following HTML, but you have to add the **data binding**:

   ```html
   <div class="card">
     <div class="header">
       <h2 class="title">Flight Search</h2>
     </div>

     <div class="content">
       <form>
         <div class="form-group">
           <label for="fsf_from">From (*)</label>
           <input id="fsf_from" class="form-control" name="from" />
         </div>

         <div class="form-group">
           <label for="fsf_to">To (*)</label>
           <input id="fsf_to" class="form-control" name="to" />
         </div>

         <div class="form-group">
           <button type="submit" class="btn btn-default">Search</button>
         </div>
       </form>
     </div>
   </div>
   ```

7. Make sure the button is only enabled if `from` and `to` are set.

   <details>
   <summary>Show source incl. data bindings</summary>
   <p>

   ```html
   <div class="card">
     <div class="header">
       <h2 class="title">Flight Search</h2>
     </div>

     <div class="content">
       <form>
         <div class="form-group">
           <label for="fsf_to">From (*)</label>
           <input id="fsf_to" class="form-control" name="from" [(ngModel)]="from" />
         </div>

         <div class="form-group">
           <label for="fsf_from">To (*)</label>
           <input id="fsf_from" class="form-control" name="to" [(ngModel)]="to" />
         </div>

         <div class="form-group">
           <button type="submit" class="btn btn-default" [disabled]="!to || !from" (click)="search()">Search</button>
         </div>
       </form>
     </div>
   </div>
   ```

   </p>
   </details>

8. Make sure to import the `CommonModule` and the `FormsModule` into your new component:
   <details>
     <summary>Show source</summary>
     <p>

   ```typescript
   @Component({
     standalone: true,
     imports: [CommonModule, FormsModule],
     selector: 'app-flight-search',
     templateUrl: './flight-search.component.html',
     styleUrl: './flight-search.component.css',
   })
   export class FlightSearchComponent {}
   ```

     </p>
   </details>

9. Add another section to your template that lists the found flights in a table. Again you can use this HTML fragment, but you have to add the **data binding**:

   ```html
   <div class="card">
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
         <tr>
           <td>...</td>
           <td>...</td>
           <td>...</td>
           <td>...</td>
           <td><a>Select</a></td>
         </tr>
       </tbody>
     </table>
   </div>
   ```

   The selected row should receive the class `active` and thus be highlighted. If no flights were found the table should be hidden.

    <details>
    <summary>Show source incl. data binding</summary>
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
           <td>{{ flight.from }}</td>
           <td>{{ flight.to }}</td>
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

10. Add a third section to your template. It should present the selected flight:

```html
<div class="card">
  <div class="content">
    <pre>{{ selectedFlight | json }}</pre>
  </div>
</div>
```

11. Switch to the file _app.component.html_, to call the new component:

    ```html
    […]
    <div class="content">
      <app-flight-search />
    </div>
    […]
    ```

12. Check for compilation errors on the console.

13. Start your solution (`npm start`) and test it in the browser by search for flights from `Graz` to `Hamburg`. A list with other supported (European) cites can be found [here](http://angular.at/api/airport).

### Use the debugger

1. In Chrome, open the Developer Tools (F12).

2. Switch to the Source tab and close all files there.

3. Press STRG+P and search for _flight-search.component_.

4. Create a breakpoint in your _search_ method.

5. Look for flights and find that the browser stops execution at your breakpoint.

6. Take a look at the information the debugger provides about each variable. These are displayed when you mouse-over and go through your method step by step.

### Bonus: Edit flights \*

Create a possibility to edit the selected flight. Therefore, you'll show a form after the selection.

Note that you cannot edit the data records with IDs 1 to 5 so that these data records are available in every demo. You can assign ID 0 to create a new flight. After saving on the server, this will be replaced by the next free ID.

Follow these steps:

1. Add a member _message_ to your **existing** component, this will store either the success or the fail message.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   @Component({
     selector: 'app-flight-search',
     templateUrl: './flight-search.component.html'
   })
   export class FlightSearchComponent {
     [...]

     message = '';

     [...]
   }
   ```

   </p>
   </details>

2. Add a method to your **existing** component for saving the selected flight. Use the `HttpClient` to POST the _selectedFlight_ back to the backend server (don't forget to subscribe):

   ```typescript
     this.http
       .post<Flight>(url, this.selectedFlight, { headers })
       .subscribe( ... );
   ```

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   save(): void {
     if (this.selectedFlight) {
       const url = 'http://www.angular.at/api/flight';
       const headers = new HttpHeaders().set('Accept', 'application/json');

       this.http.post<Flight>(url, this.selectedFlight, { headers }).subscribe({
         next: flight => {
           this.selectedFlight = flight;
           this.message = 'Success!';
         },
         error: errResponse => {
           console.error('Error', errResponse);
           this.message = 'Error: ';
         }
       });
     }
   }
   ```

   </p>
   </details>

3. Create the option to edit the _selectedFlight_ in the template. In order to avoid zero accesses, you should check with _@if_ whether there is a selected flight. You can use the following HTML fragment, which you still need to add data binding expressions:

   ```html
   @if (selectedFlight) {
   <div>
     <div>{{ message }}</div>

     <div class="form-group">
       <label>Id</label>
       <input class="form-control" />
     </div>

     <div class="form-group">
       <label>From</label>
       <input class="form-control" />
     </div>

     <!-- add fields for other attributes -->

     […]

     <button type="submit" class="btn btn-default">Save</button>
   </div>
   }
   ```

   <details>
   <summary>Show source incl. data binding</summary>
   <p>

   ```html
   @if (selectedFlight) {
   <div>{{ message }}</div>

   <div class="form-group">
     <label>Id</label>
     <input class="form-control" [(ngModel)]="selectedFlight.id" />
   </div>

   <div class="form-group">
     <label>From</label>
     <input class="form-control" [(ngModel)]="selectedFlight.from" />
   </div>

   <!-- add fields for other attributes -->

   […]

   <button type="submit" class="btn btn-default" (click)="save()">Save</button>
   }
   ```

   </p>
   </details>

4. Run the application and test it.
