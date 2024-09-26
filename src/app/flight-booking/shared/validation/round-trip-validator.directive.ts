import { Directive, input } from '@angular/core';
import { AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  standalone: true,
  selector: 'form[roundTrip]',
  providers: [{ provide: NG_VALIDATORS, useExisting: RoundTripValidatorDirective, multi: true }],
})
export class RoundTripValidatorDirective implements Validator {
  roundTrip = input<string[]>([]);

  validate(c: AbstractControl): ValidationErrors | null {
    if (this.roundTrip()?.length !== 2) {
      return null;
    }

    const formGroup = c as FormGroup; // type cast
    const fromCtrl = formGroup.controls[this.roundTrip()[0]];
    const toCtrl = formGroup.controls[this.roundTrip()[1]];

    if (!fromCtrl || !toCtrl || !fromCtrl.value) {
      return null;
    }

    if (fromCtrl.value === toCtrl.value) {
      return { roundTrip: true };
    }

    return null;
  }
}
