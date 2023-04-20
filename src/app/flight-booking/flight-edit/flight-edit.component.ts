import { Component, DestroyRef, inject, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Flight } from '../../entities/flight';
import { FlightService } from '../shared/services/flight.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-flight-edit',
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css'],
  imports: [ReactiveFormsModule],
})
export class FlightEditComponent implements OnChanges {
  @Input() flight?: Flight | null;

  private readonly destroyRef = inject(DestroyRef);
  private readonly flightService = inject(FlightService);

  editForm: FormGroup = inject(FormBuilder).group({
    id: [0],
    from: [''],
    to: [''],
    date: [''],
  });

  message = '';

  private readonly valueChangesLogger = this.editForm.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
    console.log(value);
  });

  ngOnChanges(): void {
    if (this.flight) {
      this.editForm.patchValue(this.flight);
    }
  }

  onSave(): void {
    this.flightService
      .save(this.editForm.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (flight) => {
          this.message = 'Success!';
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error', err);
          this.message = 'Error!';
        },
      });
  }
}
