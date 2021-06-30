# Template Driven Forms

- [Template Driven Forms](#template-driven-forms)
  - [Using Angular Validators](#using-angular-validators)
  - [Reusable component for displaying the validation errors \*](#reusable-component-for-displaying-the-validation-errors-)
  - [Bonus: When to show errors](#bonus-when-to-show-errors)

## Using Angular Validators

In this exercise you will validate the entries in the search form of the `FlightSearchComponent` with the built-in validators `required`, `minlength`, `maxlength` and `pattern` and output any validation errors.

You can use the following procedure as a guide:

1. Make sure that the search fields are in a `form` element and set up a handle for this element. Also make sure that each input field has a `name` attribute.

   <details>
   <summary>Show source</summary>
   <p>

   ```html
   <form #flightSearchForm="ngForm">
     [...]
     <input [...] name="from" [(ngModel)]="from" [...] />
     [...]
     <input [...] name="to" [(ngModel)]="to" [...] />
     [...]
   </form>
   ```

   </p>
   </details>

2. Extend the search field `from` to include the validation attributes mentioned above and report any validation errors.

   <details>
   <summary>Show source</summary>
   <p>

   ```html
   <input
     [...]
     name="from"
     [(ngModel)]="from"
     [...]
     required
     minlength="3"
     maxlength="15"
     pattern="[a-zA-ZäöüÄÖÜß ]+"
   />

   @if (flightSearchForm.controls['from']) {
   <pre>{{ flightSearchForm.controls['from'].errors | json }}</pre>
   } [...] @if (flightSearchForm.controls['from']?.errors['minlength']) {
   <div class="text-danger">... minlength ...</div>
   } [...]
   ```

   </p>
   </details>

3. Test your solution

## Reusable component for displaying the validation errors \*

In order not to have to query the validation errors in the same way over and over again for each input field, it is advisable to use a central component.

1. Let's start with generating the new component:

```
ng g c flight-booking/flight-validation-errors
```

2. The component can receive the property `errors` of the validated `FormControl`. For example, the expression `flightSearchForm.controls['from'].errors` returns the following object if both the validator `minlength` and a possibly self-written`city` validator fail:

```json
{
  "minlength": {
    "requiredLength": 3,
    "actualLength": 1
  },
  "city": true
}
```

3. Implement the component, so that it receives this `errors` object (`@Input({ required: true }) errors: ValidationErrors;` or if you prefer to use a **signal** `errors = input.required<ValidationErrors>();`) and outputs an error message for each of the errors in it. Please note that `null`is used internally when there are no errors. To check whether this object exists and whether it indicates a specific error,`@if` can be used:

```html
<!--classic inputs-->
@if (errors['required']) {
<div class="alert alert-danger" role="alert">This field is required.</div>
} @if (errors['minlength']) {
<div class="alert alert-danger" role="alert">This field is too short.</div>
}
<!--[...]-->
```

```html
<!--signal inputs-->
@if (errors()['required']) {
<div class="alert alert-danger" role="alert">This field is required.</div>
} @if (errors()['minlength']) {
<div class="alert alert-danger" role="alert">This field is too short.</div>
}
<!--[...]-->
```

4. To make this component reusable for different fields, you might want to add another input for the field name like (`@Input() fieldLabel = 'Field';` or if you prefer to use a **signal** `fieldLabel = input('Field');`). Now you can also use the same component for the `to` field and also later for Reactive Forms.

5. This component should be able to be called up as follows:

```html
<div class="form-group">
  <input [...] name="from" [(ngModel)]="from" [...] required minlength="3" />

  @if (flightSearchForm.controls['from']?.errors) {
  <app-flight-validation-errors [errors]="flightSearchForm.controls['from'].errors" fieldLabel="From" />
  }
</div>
```

## Bonus: When to show errors

Currently, you can probably see the errors immediately if your fields `from` and `to` are empty. Is this a good solution? If not how would you improve this?
