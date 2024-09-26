import { Directive } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  standalone: true,
  selector: 'form[roundTrip]',
  providers: [{ provide: NG_VALIDATORS, useExisting: RoundTripValidatorDirective, multi: true }],
})
export class RoundTripValidatorDirective implements Validator {
  validate(c: AbstractControl): ValidationErrors | null {
    const formGroup = c as FormGroup; // type cast
    const fromCtrl = formGroup.controls['from'];
    const toCtrl = formGroup.controls['to'];

    if (!fromCtrl || !toCtrl || !fromCtrl.value) {
      return null;
    }

    if (fromCtrl.value === toCtrl.value) {
      return { roundTrip: true };
    }

    return null;
  }
}
