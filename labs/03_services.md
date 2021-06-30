# Angular Services

- [Angular Services](#angular-services)
  - [Your first Angular service](#your-first-angular-service)
    - [Create a FlightService](#create-a-flightservice)
    - [Bonus: Save method \*](#bonus-save-method-)
    - [Bonus: (Re-)Use service class members \*](#bonus-re-use-service-class-members-)

## Your first Angular service

### Create a FlightService

In this exercise you will develop a `FlightService` that takes over the communication with the Flight API via HTTPS and use it within your component:

```
[FlightSearchComponent] --> [FlightService]
```

To do this, you can follow the points below or just look up if necessary.

1. Create a service in the _flight-search_ folder. The file for this service should be named _flight.service.ts_.

   You may want to use the generator in your terminal (or your IDE):

   ```
   ng g s flight-search/flight --dry-run
   ```

   Hint: Remove `--dry-run` to really create the service.

2. Implement a `FlightService` in that file, which requests the flights required by the application. The service must have the `HttpClient` injected (and imported) to do its job.

    <details>
    <summary>Show source</summary>
    <p>

   ```typescript
   @Injectable({ providedIn: 'root' })
   export class FlightService {
     private readonly http = inject(HttpClient);

     find(from: string, to: string): Observable<Flight[]> {
       const url = 'http://www.angular.at/api/flight';
       const headers = new HttpHeaders().set('Accept', 'application/json');
       const params = new HttpParams().set('from', from).set('to', to);

       return this.http.get<Flight[]>(url, { headers, params });
     }
   }
   ```

    </p>
    </details>

3. Open the _flight-search.component.ts_ file and inject the new service into the service. Make sure the corresponding import was added!

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   […]
   export class FlightSearchComponent {
     […]
     private readonly flightService = inject(FlightService);
     […]
   }
   ```

   </p>
   </details>

4. Use the injected `FlightService` in the _search_ method to search for flights.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   search(): void {
     this.flightService.find(this.from, this.to)
       .subscribe({
         next: (flights) => {
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

5. Test your solution in the browser.

6. Make sure with the DevTools debugger that the `FlightService` gets the `HttpClient` injected first and then the component gets the `FlightService` in the same way.

### Bonus: Save method \*

In case you did bonus task _Bonus: Edit flights_ above, you must now also outsource the _save_ method to the service.

<details>
<summary>Show source</summary>
<p>

```typescript
save(flight: Flight): Observable<Flight> {
 const url = 'http://www.angular.at/api/flight';
 const headers = new HttpHeaders().set('Accept', 'application/json');

 return this.http.post<Flight>(url, flight, { headers });
}
```

</p>
</details>

### Bonus: (Re-)Use service class members \*

Create a class member for the URL and the headers and use them in both methods:

```typescript
private readonly url = 'http://www.angular.at/api/flight';
private readonly headers = new HttpHeaders().set('Accept', 'application/json');
```
