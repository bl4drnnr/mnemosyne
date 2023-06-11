import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthenticationService } from '@pages/shared/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../credentials.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0s', style({ opacity: 0 })),
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ForgotPasswordComponent {
  email: string;
  incorrectEmail: boolean;

  constructor(private authenticationService: AuthenticationService) {}

  handleForgotPassword() {
    if (this.incorrectEmail) return;

    this.authenticationService
      .forgotPassword({
        email: this.email
      })
      .subscribe(() => {
        //
      });
  }
}
