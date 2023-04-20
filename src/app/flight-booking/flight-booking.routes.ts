import { Routes } from '@angular/router';

import { FlightSearchComponent } from './flight-search/flight-search.component';
import { PassengerSearchComponent } from './passenger-search/passenger-search.component';

const flightBookingRoutes: Routes = [
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
