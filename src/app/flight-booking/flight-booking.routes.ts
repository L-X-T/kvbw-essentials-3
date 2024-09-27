import { Routes } from '@angular/router';

import { FlightEditComponent } from './flight-edit/flight-edit.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { PassengerSearchComponent } from './passenger-search/passenger-search.component';

const flightBookingRoutes: Routes = [
  {
    path: 'flight-edit/:id',
    component: FlightEditComponent,
  },
  {
    path: 'flight-search',
    component: FlightSearchComponent,
  },
  {
    path: 'passenger-search',
    component: PassengerSearchComponent,
  },
];

export default flightBookingRoutes;
