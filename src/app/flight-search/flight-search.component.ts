import { Component, DestroyRef, inject, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Flight } from '../entities/flight';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlightService } from './flight.service';
import { CityPipe } from '../shared/pipes/city.pipe';
import { Observable, Observer, share, Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, CityPipe],
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrl: './flight-search.component.css',
})
export class FlightSearchComponent implements OnDestroy {
  protected from = 'Hamburg';
  protected to = 'Graz';
  protected flights: Flight[] = [];
  protected flights$?: Observable<Flight[]>;
  private flightsSubscription?: Subscription;
  private readonly onDestroySubject = new Subject<void>();
  readonly terminator$ = this.onDestroySubject.asObservable();

  protected selectedFlight?: Flight;

  protected message = '';

  private readonly destroyRef = inject(DestroyRef);
  private readonly flightService = inject(FlightService);

  constructor() {
    this.onSearch();
  }

  ngOnDestroy(): void {
    // 4a. my unsubscribe
    this.flightsSubscription?.unsubscribe();

    // 4b. subject emit thru terminator$
    this.onDestroySubject.next();
    this.onDestroySubject.complete();
  }

  protected onSearch(): void {
    // 1. my observable
    this.flights$ = this.flightService.find(this.from, this.to).pipe(share());

    // 2. my observer
    const flightsObserver: Observer<Flight[]> = {
      next: (flights) => (this.flights = flights),
      error: (errResp: HttpErrorResponse) => console.error('Error loading flights', errResp),
      complete: () => console.debug('Flights loading completed.'),
    };

    // 3a. my subscription
    this.flightsSubscription?.unsubscribe();
    this.flightsSubscription = this.flights$.subscribe(flightsObserver);

    // 3b. takeUntil terminator$ emits
    this.flights$.pipe(takeUntil(this.terminator$)).subscribe(flightsObserver);

    // 3c. takeUntilDestroyed
    this.flights$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(flightsObserver);
  }

  protected onSelect(selectedFlight: Flight): void {
    this.selectedFlight = selectedFlight;
  }

  protected onSave(): void {
    if (this.selectedFlight) {
      this.flightService
        .save(this.selectedFlight)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (flight) => {
            console.log('Flight saved: ', flight);
            this.selectedFlight = flight;
            this.message = 'Success!';
          },
          error: (errResponse: HttpErrorResponse) => {
            console.error('Error saving flight', errResponse);
            this.message = 'Error: ' + errResponse.message;
          },
        });
    }
  }
}
