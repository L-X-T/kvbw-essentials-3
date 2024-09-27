import { Directive, inject } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors } from '@angular/forms';

import { Observable } from 'rxjs';

import { FlightService } from '../services/flight.service';
import { validateAsyncCity } from './async-city-validator';

@Directive({
  standalone: true,
  selector: 'input[asyncCity]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: AsyncCityValidatorDirective,
      multi: true,
    },
  ],
})
export class AsyncCityValidatorDirective implements AsyncValidator {
  private readonly flightService = inject(FlightService);

  validate(c: AbstractControl): Observable<ValidationErrors | null> | Promise<ValidationErrors | null> {
    return validateAsyncCity(this.flightService)(c);
  }
}
