import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class SidebarComponent {
  @Input() isSidebarOpen = false;

  @Output() closeSidebar = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  constructor(private readonly router: Router) {}

  handleLogout() {
    this.logout.emit();
  }

  handleCloseSidebar() {
    this.isSidebarOpen = false;
    this.closeSidebar.emit();
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }
}
