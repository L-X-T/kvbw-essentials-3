import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validateCity(c: AbstractControl): ValidationErrors | null {
  const validCities: string[] = ['Graz', 'Wien', 'Hamburg', 'Berlin'];
  if (c.value && !validCities.includes(c.value)) {
    return {
      city: {
        actualCity: c.value,
        validCities: validCities.join(', ')
      }
    };
  }

  return null;
}
