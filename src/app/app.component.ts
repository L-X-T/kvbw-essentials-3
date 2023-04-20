import { Component } from '@angular/core';

import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FlightSearchComponent } from './flight-booking/flight-search/flight-search.component';
import { AirportsComponent } from './components/airports/airports.component';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, FlightSearchComponent, AirportsComponent, RouterOutlet],
  selector: 'app-flight-app',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
