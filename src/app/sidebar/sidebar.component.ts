import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  imports: [RouterLinkActive, RouterLink],
})
export class SidebarComponent {}
