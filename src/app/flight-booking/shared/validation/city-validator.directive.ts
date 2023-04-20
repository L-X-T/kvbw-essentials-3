import { Directive, input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  standalone: true,
  selector: 'input[city]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CityValidatorDirective, multi: true }],
})
export class CityValidatorDirective implements Validator {
  // validCities = ['Graz', 'Wien', 'Hamburg', 'Berlin'];

  city = input.required<string[]>();

  validate(c: AbstractControl): ValidationErrors | null {
    if (c.value && !this.city().includes(c.value)) {
      return {
        city: {
          actualCity: c.value,
          validCities: this.city().join(', '),
        },
      };
    }

    return null; // no error
  }
}
