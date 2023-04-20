import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  standalone: true,
  selector: 'input[city]',
  providers: [{ provide: NG_VALIDATORS, useExisting: CityValidatorDirective, multi: true }],
})
export class CityValidatorDirective implements Validator {
  validCities = ['Graz', 'Wien', 'Hamburg', 'Berlin'];

  validate(c: AbstractControl): ValidationErrors | null {
    if (c.value && this.validCities.indexOf(c.value) === -1) {
      return {
        city: {
          actualCity: c.value,
          validCities: this.validCities.join(', '),
        },
      };
    }

    return null; // no error
  }
}
