import { Component } from '@angular/core';

import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';

@Component({
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, FlightSearchComponent],
  selector: 'app-flight-app',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly title = 'Hello World!';
}
