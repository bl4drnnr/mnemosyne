import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/authentication.service';

@Component({
  selector: 'layout-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private readonly authenticationService: AuthenticationService) {}

  ngOnInit() {
    const _at = localStorage.getItem('_at');
  }
}
