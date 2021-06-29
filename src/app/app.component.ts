import { Component } from '@angular/core';

import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  imports: [SidebarComponent, NavbarComponent],
  selector: 'app-flight-app',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly title = 'Hello World!';
}
