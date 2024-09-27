import { Directive, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import { validateCity } from './city-validator';

@Directive({
  standalone: true,
  selector: 'input[city]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CityValidatorDirective, multi: true }],
})
export class CityValidatorDirective implements Validator {
  // validCities = ['Graz', 'Wien', 'Hamburg', 'Berlin'];

  city = input.required<string[]>();

  validate(c: AbstractControl): ValidationErrors | null {
    return validateCity(this.city())(c);
  }
}
