import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'airports',
    loadComponent: () => import('./components/airports/airports.component'),
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component'),
  },

  {
    path: 'flight-booking',
    loadChildren: () => import('./flight-booking/flight-booking.routes'),
  },

  /*{
    path: '**',
    redirectTo: '',
  },*/
];
