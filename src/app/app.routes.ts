import { Route } from '@angular/router';

import { AirportsComponent } from './components/airports/airports.component';
import { HomeComponent } from './components/home/home.component';

import flightBookingRoutes from './flight-booking/flight-booking.routes';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'airports',
    component: AirportsComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },

  {
    path: 'flight-booking',
    children: flightBookingRoutes,
    // loadChildren: () => import('./flights/flights.routes').then((f) => f.flightBookingRoutes),
  },

  /*{
    path: '**',
    redirectTo: '',
  },*/
];
