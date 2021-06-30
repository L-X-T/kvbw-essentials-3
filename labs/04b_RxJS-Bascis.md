# RxJS Basics

<!-- TOC -->

- [RxJS Basics](#rxjs-basics)
  - [Preparation: Airport component](#preparation-airport-component)
  - [Observable and Observer](#observable-and-observer)
  - [Closing the Observable](#closing-the-observable)
    - [1. Unsubscribe with Subscription](#1-unsubscribe-with-subscription)
    - [2. Unsubscribe with takeUntil Subject](#2-unsubscribe-with-takeuntil-subject)
    - [3. Using the async pipe](#3-using-the-async-pipe)
  - [Use takeUntilDestroyed Pipe \*](#bonus-use-takeuntildestroyed-pipe-)
  - [Bonus: Share Hot Observable \*](#bonus-share-hot-observable-)
  - [Bonus: Add delays and show a loading state \*\*](#bonus-add-delays-and-show-a-loading-state-)
  - [Bonus: Add basic Error Handling \*\*\*](#bonus-add-basic-error-handling-)
  <!-- TOC -->

## Preparation: Airport component

In this exercise, you will expand your application by one page that lists all airports. You can orientate yourself by the existing `FlightSearchComponent`. The web API with the airports can be found here: `http://www.angular.at/api/airport`.

Please note that the returned data is just an array with strings. For data access you will write an `AirportService` within the component's folder.

You can follow these steps:

1. Start by creating your new `AirportsComponent` in your project's root. To generate the files needed, run the following command (or use your IDE):

   ```
   ng g c airports
   ```

2. Implement these files in the same way as the files for the `FlightSearchComponent` so that they will later list all the airports.

   Note: we don't need a `Airport` class, the airports will just use type string:

   ```typescript
   airports: string[] = [];
   ```

   <details>
   <summary>Show code</summary> 
   <p>

   ```typescript
   import { Component, inject } from '@angular/core';

   import { AirportService } from './airport.service';

   @Component({
     selector: 'app-airports',
     templateUrl: './airports.component.html',
   })
   export class AirportsComponent {
     airports: string[] = [];

     private readonly airportService = inject(AirportService);

     constructor() {
       this.airportService.findAll().subscribe((airports) => {
         this.airports = airports;
       });
     }
   }
   ```

   </p>
   </details>

   <details>
   <summary>Show code (HTML)</summary>
   <p>

   ```html
   <div class="card">
     <div class="header">
       <h1 class="title">Airports</h1>
     </div>

     <div class="content">
       <div class="row">
         @for (airport of airports; track airport) {
         <div class="col-lg-3">{{ airport }}</div>
         }
       </div>
     </div>
   </div>
   ```

   </p>
   </details>

3. Consider the Web API at `http://www.angular.at/api/airport` (if you need a secure URL try this one: `https://demo.angulararchitects.io/api/Airport`). Note that this Web API responds with either XML or JSON, and the answer is just an **array of strings**.

   An example of the JSON-based answer can be found here: http://www.angular.at/help. While the XML response uses Pascal-Case (eg ` From`), the JSON response uses the usual Camel case (eg ` from`). Thus, the practices of the two standards are taken into account.

4. In your project, create a `airports/airport.service.ts` file with a `AirportService` class:

   ```
   ng g s airports/airport
   ```

   Similar to `FlightService` this class should offer the possibility to search for airports. For this, create a method findAll that returns a `Observable<string[]>` with the airport names:

   `findAll(): Observable<string[]>`

   **Attention:** The web API at http://www.angular.at/api/airport returns all airports as an array with string. This string contains the names of the airports. That's why you do not need an interface to represent airports.

   <details>
   <summary>Show code</summary>
   <p>

   ```typescript
   import { inject, Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';

   import { Observable } from 'rxjs';

   @Injectable({
     providedIn: 'root',
   })
   export class AirportService {
     private readonly url = 'http://www.angular.at/api/airport';

     private readonly httpClient = inject(HttpClient);

     findAll(): Observable<string[]> {
       return this.httpClient.get<string[]>(this.url);
     }
   }
   ```

   </p>
   </details>

5. Switch to the file _app.component.html_, and temporarily switch to the new component:

   ```html
   […]
   <div class="content">
     <!--<app-flight-search />-->
     <app-airports />
   </div>
   […]
   ```

6. Test your solution.

## Observable and Observer

Now we want to explicitly declare the `Observable` and the `Observer`. Add two members in the airport component:

```typescript
  airports: string[] = []; // already there
  airports$?: Observable<string[]>;
  airportsObserver?: Observer<string[]>;
```

Make sure you've added the import of `Observable` and `Observer` from `RxJS`. In your component `constructor` assign the `Observable` you get from the service to the component member in a first step. Then create an `Observer` as a second step. You can, if you want, add a (dummy) error handling and a complete function to your `Observer`. Finally subscribe to the `Observable` with the created `Observer`.

<details>
<summary>Show code</summary>
<p>

```typescript
  constructor() {
    this.airports$ = this.airportService.findAll();

    this.airportsObserver = {
      next: (airports) => (this.airports = airports),
      error: (err) => console.error(err),
      complete: () => console.log('Observable completed!')
    };

    this.airports$.subscribe(this.airportsObserver);
  }
```

</p>
</details>

Test your solution to see if everything still works.

## Subscription Management

In this part we'll try out the three recommended best practices of how to unsubscribe from our `Observable`.

### 1. Unsubscribe with Subscription

This is probably the most primitive but also intuitive approach. All we need to do here is create a subscription when subscribing and then unsubscribe from it in the `ngOnDestroy` component lifecylce hook.

We'll add the subscription as a member first:

```typescript
  airportsObserver?: Observer<string[]>; // already there
  airportsSubscription?: Subscription;
```

Make sure you've added the import of `Subscription` from `RxJS`. Now we just need to assign the subscription in the `constructor` and then unsubscribe in `ngOnDestroy`. Since we're using `ngOnDestroy` we also need to add it's interface `OnDestroy` to the component:

```typescript
export class AirportComponent implements OnDestroy {
  [...]
}
```

**Attention:** Note that we need to check if the subscription does still exist. This is to avoid an error when trying to unsubscribe from the already closed subscription.

<details>
<summary>Show code</summary>
<p>

```typescript
  constructor() {
    [...]

    this.airportsSubscription = this.airports$.subscribe(this.airportsObserver);
  }


  ngOnDestroy(): void {
    this.airportsSubscription?.unsubscribe(); // note the "?" for optional chaining
  }
```

</p>
</details>

### 2. Unsubscribe with takeUntil Subject

This approach is useful when you have a lot of `Subscriptions` in your component and you don't want to add the unsubscribe for each `Subscription` to your `ngOnDestroy` hook. In our example, we just have one subscription so far, but you will still be able to try and understand it. To keep the existing code and to be able to compare we'll duplicate some stuff in this and the next approach.

First let's add a `Subject` to the component members:

```typescript
  airportsSubscription?: Subscription; // already there

  takeUntilAirports: string[] = [];
  onDestroySubject = new Subject<void>();
```

Make sure you've added the import of `Subject` from `RxJS`. Now let's jump to the `ngOnDestroy` hook and create an emit for this `Subject` and close it afterwards.

<details>
<summary>Show code</summary>
<p>

```typescript
  ngOnDestroy(): void {
    this.airportsSubscription?.unsubscribe(); // already there

    this.onDestroySubject.next();
    this.onDestroySubject.complete();
  }
```

</p>
</details>

Now we can use our `Subject` when subscribing to the `Observable`. As already mentioned we duplicate the subscribe block here and use the newly added member `takeUntilAirports`.

```typescript
  constructor() {
    [...]

    this.airports$.pipe(takeUntil(this.onDestroySubject)).subscribe(this.airportsObserver);
  }
```

Import `takeUntil` from `rxjs/operators`. Now let's show this airports in another (duplicated) card in our template (and maybe change the title).

<details>
<summary>Show code (HTML)</summary>
<p>

```html
<div class="card">
  <div class="header">
    <h1 class="title">Take Until Airports</h1>
  </div>

  <div class="content">
    <div class="row">
      @for (airport of takeUntilAirports; track airport) {
      <div class="col-lg-3">{{ airport }}</div>
      }
    </div>
  </div>
</div>
```

</p>
</details>

You should now see two cards with airports. Test your solution.

### 3. Using the async pipe

In the third and last approach we'll use the Angular `async` Pipe. We don't need any new code in the components' TypeScript file, so we can directly jump to its HTML-Template and again duplicate the `card` showing our `airports` (and maybe change the title).

<details>
<summary>Show code (HTML)</summary>
<p>

```html
<div class="card">
  <div class="header">
    <h1 class="title">Async Airports</h1>
  </div>

  <div class="content">
    <div class="row">
      @for (airport of airports; track airport) {
      <div class="col-lg-3">{{ airport }}</div>
      }
    </div>
  </div>
</div>
```

</p>
</details>

Now all we need to do is replace the `airports` with our `Observable` and then add the `async` Pipe right after that.

```html
@for (airport of airports$ | async; track airport) {
<div class="col-lg-3">{{ airport }}</div>
}
```

Test your solution.

Now Angular takes care of subscribing and unsubscribing of its own. That was quite easy, huh? That's why the Angular `async` Pipe was invented: To make our live easier. But there will be cases when you will need to subscribe and unsubscribe yourself.

## Use takeUntilDestroyed Pipe \*\*

Instead of the approach with the `takeUntil` pipe and the `Subject` try using Angular 16's `takeUntilDestroyed` pipe.

```typescript
  constructor() {
    [...]

    this.airports$.pipe(takeUntilDestroyed()).subscribe(this.airportsObserver);
  }
```

## Bonus: Share Hot Observable \*

Open the Chrome dev tools and notice that we do the API call three times: Once for every subscription. Try sharing the same observable for the three variants by creating a Hot Observable. You can use `share()` operator to achieve this.

```typescript
this.airports$ = this.airportService.findAll().pipe(share());
```

## Bonus: Add delays and show a loading state \*\*

In this bonus task add a delay to the observable to simulate a slow API / backend:

```typescript
this.airports$ = this.airportService.findAll().pipe(delay(3000), share());
```

Import `delay` from `rxjs/operators`. Now add a flag that shows a loading indicator (like "...is loading") for each of the three variants while the delay.

**Attention:** For the third approach you will not be able to work with a flag in the TypeScript. Instead you will need to handle this in the HTML-Template. You can assign a local variable with the `async` Pipe to achieve this.

<details>
<summary>Show code (HTML)</summary>
<p>

```html
<div class="content">
  <div class="row">
    @let asyncAirports = airports$ | async; @if (asyncAirports) { @for (airport of asyncAirports; track airport) {
    <div class="col-lg-3">{{ airport }}</div>
    } } @else {
    <div class="col-lg-3">...isLoadingAirports...</div>
    }
  </div>
</div>
```

</p>
</details>

## Bonus: Add basic Error Handling \*\*\*

In the next step try to add an error handling. You can cause an error by simply changing the request URL. Again add flags for variant 1 & 2 and think about how to add an error handling in the 3rd variant.

**Attention:** Again for the third approach you will not be able to work with a flag in the TypeScript. A solution could be to use the `catchError()` operator and return an empty array with `of()` in case of an error.
