# Reactive Forms

- [Reactive Forms](#reactive-forms)
  - [Edit flights \*](#edit-flights-)
  - [Using Angular Validators \*](#using-angular-validators-)
  - [Bonus: Load flight \*](#bonus-load-flight-)
  - [Bonus: Save flight \*](#bonus-save-flight-)

## Edit flights \*

In this exercise, you will create a reactive form for editing flights.

Caution: This lab assumes you already know some basics and thus is a bit more difficult and some things are left out intentionally ;-)

1. **If** you do not have a `FlightEditComponent` yet: Create a `FlightEditComponent` in the `FlightBookingModule` and call it up in the template of the `FlightSearchComponent`.

**Important** if you cannot see your `FlightEditComponent`, make sure you've either added it, e.g. to the `SearchFormComponent` at the bottom, or you access it directly via the router. If you cannot see any debug messages in your `DevTools Console`, please make sure you checked `Verbose` in your browsers `Default Levels` settings.

2. Import the `ReactiveFormsModule` into your `FlightEditComponent`.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   [...]
   import { ReactiveFormsModule } from '@angular/forms';
   [...]

   @Component({
     [...]
     imports: [
       [...]
       ReactiveFormsModule
     ],
     [...]
   })
   export class FlightEditComponent {}
   ```

   </p>
   </details>

3. Add a FormGroup with the name `editForm` to your `FlightEditComponent`.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   [...]
   import { FormGroup } from '@angular/forms';

   @Component({ [...] })
   export class FlightEditComponent {
     @Input({ required: true }) flight?: Flight | null;

     editForm?: FormGroup;

     message = '';

     [...]
   }
   ```

   </p>
   </details>

4. Inject the FormBuilder into the `FlightEditComponent`.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   import {[...], FormBuilder} from '@angular/forms';

   @Component({
     [...]
   })
   export class FlightEditComponent {
     [...]

     private readonly fb = inject(FormBuilder);

     [...]
   }
   ```

   </p>
   </details>

5. Use the `FormsBuilder` to create a `FormGroup` that describes a flight. Add this to the `editForm`.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   export class FlightEditComponent {
     @Input({ required: true }) flight?: Flight | null;

     readonly editForm = this.fb.group({
       id: [0],
       from: [''],
       to: [''],
       date: [''] // there are better ways to handle dates, but we'll keep things easy here
     });

     message = '';

     [...]
   }
   ```

   </p>
   </details>

6. With the code completion of your IDE/editor, explore the methods of editForm. For demonstration, output the properties `value`, `valid`, `touched` and `dirty` on the console.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript

   export class FlightEditComponent {
     [...]

     constructor() {
       console.log(this.editForm.value);
       console.log(this.editForm.valid);
       console.log(this.editForm.touched);
       console.log(this.editForm.dirty);
     }

     [...]
   }
   ```

   </p>
   </details>

7. Make sure you update the form value when the `flight` member is changed. You can use the lifecycle method `ngOnChanges` and the `patchValue()` of the `FormGroup` object. You might also need to add the import of the `OnChanges` interface.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   export class FlightEditComponent implements OnChanges {
       [...]

       ngOnChanges(): void {
         if (this.flight) {
            this.editForm.patchValue(this.flight);
         }
       }

       [...]
   }
   ```

   </p>
   </details>

8. Register for `valueChanges` on your `editForm` and output the received value on the console in order to keep up to date with changes to the form. Please note: If you cannot see any debug messages in your DevTools Console, please make sure you checked "Verbose" in your "Default Levels" settings.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   export class FlightEditComponent {
       [...]

       constructor() {
         [...]

         this.editForm.valueChanges.subscribe((formValue) => {
           console.debug('formValue: ', formValue);
         });
       }

       [...]
   }
   ```

   </p>
   </details>

**Please note** that later you should also add a subscription management (e.g. unsubscribe in ngOnDestroy) here.

9. Now switch to the file `flight-edit.component.html`. Create a form there that you can link to the `FormGroups` in the `editForm` property.

   <details>
   <summary>Show source</summary>
   <p>

   ```html
   <form [formGroup]="editForm">
     <div class="form-group">
       <label for="id">Id:</label>
       <input formControlName="id" id="id" class="form-control" />
     </div>

     <div class="form-group">
       <label for="from">From:</label>
       <input formControlName="from" id="from" class="form-control" />
     </div>

     <div class="form-group">
       <label for="to">To:</label>
       <input formControlName="to" id="to" class="form-control" />
     </div>

     <div class="form-group">
       <label for="date">Date:</label>
       <input formControlName="date" id="date" class="form-control" />
     </div>

     <div class="form-group">
       <button type="submit" class="btn btn-default">Save</button>
     </div>
   </form>
   ```

   </p>
   </details>

10. Test your solution. If everything works, you should see every change you make to the form in the console output.

## Using Angular Validators \*

In this exercise you will validate the _from_ field with the built-in validators `required` and `minlength`.

1. Switch to the flight-edit.component.ts file and specify when setting up the FormGroup that the from property is to be validated with `required` and `minlength`. The latter validator is intended to ensure that at least three characters are recorded.

   <details>
   <summary>Show source</summary>
   <p>

   ```typescript
   readonly editForm = this.fb.group({
     id: [0, Validators.required],
     from: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
     to: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
     date: ['', [Validators.required, Validators.minLength(33), Validators.maxLength(33)]]
   });
   ```

   </p>
   </details>

2. Switch to the `flight-edit.component.html` file and enter the `errors` property of the `from` control there. You can use the built-in json pipe.

   <details>
   <summary>Show source</summary>
   <p>

   ```html
   <input formControlName="from" [...] /> [...] errors: {{ editForm.controls['from'].errors | json }}
   ```

   </p>
   </details>

3. Also use the control's `errors` object to find out whether the `minlength` error has occurred.

   <details>
   <summary>Show source</summary>
   <p>

   ```html
   <input formControlName="from" [...] />

   @if (editForm.controls['from'].errors['minlength']) {
   <div class="text-danger">...minlength...</div>
   }
   ```

   </p>
   </details>

4. If you've implemented the flight-validation-errors component make sure to use that here as well.

## Bonus: Load flight \*

Load any flight whose id you save as a constant for the time being and write it in the form. To do this, you can transfer the flight to the `patchValue` method of `editForm`.

<details>
<summary>Show source for FlightService</summary>
<p>

```typescript
findById(id: string): Observable<Flight> {
  const params = new HttpParams().set('id', id);
  const headers = new HttpHeaders().set('Accept', 'application/json');
  return this.http.get<Flight>(this.url, { params, headers });
}
```

</p>
</details>

<details>
<summary>Show source for FlightEditComponent</summary>
<p>

```typescript
this.flightService.findById(this.id).subscribe({
  next: (flight) => {
    this.flight = flight;
    this.editForm.patchValue(this.flight);
    this.message = 'Success loading!';
  },
  error: (err: HttpErrorResponse) => {
    console.error('Error', err);
    this.message = 'Error Loading!';
  },
});
```

</p>
</details>

<!--
**Extension**: **If** you have already implemented routing, you can also receive the ID of the flight via the url.
-->

## Bonus: Save flight \*

Create a save button. This should retrieve the current flight from the form (`editForm.value`) and transfer it to a `save` method of the `FlightService`.

This should send the flight to the server with the `post` method of the `HttpClient` (`http.post<Flight>(url, flight).subscribe(...)`).

**Please note** that you cannot save data sets with IDs 1 to 5. These are reserved for presentations. To insert a new data record, assign the ID 0.
