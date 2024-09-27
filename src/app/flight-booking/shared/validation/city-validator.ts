import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validateCity(validCities: string[]): ValidatorFn {
  // const validCities: string[] = ['Graz', 'Wien', 'Hamburg', 'Berlin'];
  return (c: AbstractControl): ValidationErrors | null => {
    if (c.value && !validCities.includes(c.value)) {
      return {
        city: {
          actualCity: c.value,
          validCities: validCities.join(', '),
        },
      };
    }

    return null;
  };
}
