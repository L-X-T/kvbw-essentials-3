# Angular Components Signal Inputs and Outputs

- [Angular Components Content Projection](#angular-components-content-projection)
  - [Create your first signal-based component \*](#create-your-first-signal-based-component-)
  - [Bonus: Also migrate your toggle component \*](#bonus-also-migrate-your-toggle-component-)

## Create your first signal-based component \*

In this exercise, you migrate the inputs of the `FlightCard` to signals.

1. Open the file `flight-card.component.ts` and migrate to signal-based inputs:

   ```typescript
   item = input.required<Flight>();
   selected = input(false);
   ```

2. Now add the parenthesis to all getters of the properties: change `item` to `item()` and `selected` to `selected()`.

3. Test your solution.

## Bonus: Also migrate your toggle component \*

Now migrate the `@Input` and `@Output` of the `FlightStatusToggleComponent` to signals. You can use `model(false)` for both bindings and update for the toggling.

```typescript
this.delayed.update((delayed) => !delayed);
```
