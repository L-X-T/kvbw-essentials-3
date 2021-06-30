# Reactive Forms - Custom Validators

- [Reactive Forms - Custom Validators](#reactive-forms---custom-validators)
  - [Custom Validators \*](#custom-validators-)
  - [Parameterizable Validators \*](#parametrizable-validators-)
  - [Async Validator \*\*](#async-validator-)
  - [Bonus: Parameterizable Async Validator \*\*](#bonus-parametrizable-async-validator-)
  - [Bonus: Multifield Validators \*](#bonus-multifield-validators-)

## Custom Validators \*

In this exercise, you will write your own validator for your reactive form, which checks the cities entered against a hard-coded whitelist.

1. Create a `validation` folder in the `shared` folder (if it does not already exist).

2. Create a city-validator.ts file in the validation folder. Place a validation function `validateCity` there, which receives an `AbstractControl`, checks the recorded city against hard-coded values and returns an error description object.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   import { AbstractControl, ValidationErrors } from '@angular/forms';

   export const validateCity = (c: AbstractControl): ValidationErrors | null => {
     const validCities: string[] = ['Graz', 'Wien', 'Hamburg', 'Berlin'];

     if (c.value && !validCities.includes(c.value)) {
       return {
         city: {
           actualValue: c.value,
           validCities: validCities.join(', '),
         },
       };
     }

     return null;
   };
   ```

   </p>
   </details>

3. Switch to the `flight-edit.component.ts` file and register the new validation function for the `from` field there.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   [...]
   import { validateCity } from '[...]';

   @Component({
     [...]
   })
   export class FlightEditComponent {
     [...]

     readonly editForm = this.fb.group({
       [...]
       from: ['', [[...], validateCity]],
       [...]
     });
   }
   ```

   </p>
   </details>

4. Go to the file `flight-edit.component.html` and check whether the custom error `city` has occurred. In this case, issue an error message - you might use your previously created `FieldValidationErrorsComponent` again here

   <details>
   <summary>Show source</summary>
   <p>

   ```html
   [...]
   
   <!-- better use your Validation Errors component -->
   @if (editForm.controls['from']?.errors['city']) {
      <div class="text-danger">...city...</div>
   }
   
   [...]
   ```

   </p>
   </details>

5. Test your solution

## Parameterizable Validators \*

In this exercise, you will make the validator from the last exercise parameterizable so that it checks the entries against a whitelist that is passed as parameters.

1. Switch to the `city-validator.ts` file and expand the `validateCity` const function so that it accepts a whitelist with city names as a string array and returns the actual validation function.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

   export const validateCity =
     (validCities: string[]): ValidatorFn =>
     (c: AbstractControl): ValidationErrors | null => {
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
   ```

   </p>
   </details>

2. Open the file `flight-edit.component.ts` and update the use of `validateCity` here so that a whitelist is transferred.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   [...]

   readonly editForm = this.fb.group({
     [...]
     from: ['', [[...], validateCity(['Graz', 'Wien', 'Hamburg', 'Berlin'])]],
     [...]
   });

   [...]
   ```

   </p>
   </details>

3. Test your solution.

## Async Validator \*\*

In this lab we want to add an asynchronous validator for validating the `from` city field.

1. Add a file `async-city-validator.ts`:

   ```typescript
   import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
   import { delay, map } from 'rxjs';
   import { FlightService } from '../../flight-search/flight.service';

   export const validateAsyncCity =
     (flightService: FlightService): AsyncValidatorFn =>
     (c: AbstractControl): Observable<ValidationErrors | null> =>
       flightService.find(c.value, '').pipe(
         map((flights) => (flights.length > 0 ? null : { asyncCity: c.value })),
         delay(2000), // <-- delay; can be removed later...
       );
   ```

2. Add the async validator to the from and to field in your `flight-edit.component.ts`. Be careful to not mix the async validator with the synchronous ones.

3. Add a pending flag to your `flight-edit.component.html` like this:

   ```html
   @if (editForm.controls['from']?.pending) {
      <div class="text-warning">Async city check</div>
   }
   ```

4. Don't forget to display the error.

5. Try out your application.

## Bonus: Parameterizable Async Validator \*\*

Now try to use the just created validator for both fields.

## Bonus: Multifield Validators \*

In this exercise you will write a multifield validator that ensures that a different value is recorded in the fields `from` and `to`.

1. Create a file `round-trip-validator.ts` under shared / validation.

2. Add a validation function to this new file called `validateRoundTrip`, which receives a `FormGroup`, determines its controls `from` and `to` and - if they exist - checks whether they have the same value.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

   export const validateRoundTrip = (c: AbstractControl): ValidationErrors | null => {
     const formGroup = c as FormGroup;
     const fromCtrl = formGroup.controls['from'];
     const toCtrl = formGroup.controls['to'];

     if (!fromCtrl || !toCtrl || !fromCtrl.value) {
       return null;
     }

     if (fromCtrl.value === toCtrl.value) {
       return { roundTrip: true };
     }

     return null;
   };
   ```

   </p>
   </details>

3. Switch to the `flight-edit.component.ts` file and register the new validator with the `FormGroup`.

    <details>
    <summary>Show source</summary>
    <p>

   ```typescript
   [...]
   import { validateRountTrip } from '[...]';

   @Component({
     [...]
   })
   export class FlightEditComponent {
     [...]

     constructor([...]) {
       [...]

       this.editForm.validator = validateRoundTrip;
     }

     [...]
   }
   ```

    </p>
    </details>

   Alternatively, you could also add this `form` validator on the initialization of the `editForm`

    <details>
    <summary>Show source</summary>
    <p>

   ```typescript
   [...]
   import { validateRountTrip } from '[...]';

   @Component({
     [...]
   })
   export class FlightEditComponent {
     [...]

     readonly editForm = this.fb.group(
       {
         id: [0, Validators.required],
         from: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)], validateAsyncCity(this.flightService)],
         to: [
           '',
           [Validators.required, Validators.minLength(3), Validators.maxLength(15), validateCity(['Graz', 'Wien', 'Hamburg', 'Berlin'])]
         ],
         date: ['', [Validators.required, Validators.minLength(33), Validators.maxLength(33)]]
       },
       { validators: validateRoundTrip }
     );

     [...]
   }
   ```

    </p>
    </details>

4. Open the file `flight-edit.component.html` and check whether the error `rountTrip` has occurred. In this case, issue an error message.

   <details>
   <summary>Show source</summary>
   <p>

   ```html
   [...]
   
   @if (editForm.errors['roundTrip']) {
      <div class="text-danger">Round trips are not allowed</div>
   }
   
   [...]
   ```

   </p>
   </details>

5. Optionally add this error to your Validation Errors component and also use that component for the `form` errors.
