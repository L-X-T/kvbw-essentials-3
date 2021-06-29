import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrl: 'navbar.component.css',
})
export class NavbarComponent {
  private sidebarVisible = false;

  protected sidebarToggle(): void {
    const body = document.getElementsByTagName('body')[0];

    if (!this.sidebarVisible) {
      body.classList.add('nav-open');
      this.sidebarVisible = true;
    } else {
      this.sidebarVisible = false;
      body.classList.remove('nav-open');
    }
  }
}
