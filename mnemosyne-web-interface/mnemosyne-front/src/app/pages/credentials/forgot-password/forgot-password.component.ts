import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthenticationService } from '@pages/shared/authentication.service';

@Component({
  selector: 'page-forgot-password',
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
  step = 1;

  email: string;
  incorrectEmail: boolean;

  resendMessage: string;
  time = 180;
  isCountdownRunning = false;

  constructor(private authenticationService: AuthenticationService) {}

  handleForgotPassword() {
    if (this.incorrectEmail) return;

    this.authenticationService
      .forgotPassword({
        email: this.email
      })
      .subscribe({
        next: () => {
          this.step = 2;
          this.startCountdown();
        }
      });
  }

  private startCountdown() {
    this.isCountdownRunning = true;
    const countdownInterval = setInterval(() => {
      this.time -= 1;
      if (this.time <= 0) {
        clearInterval(countdownInterval);
        this.isCountdownRunning = false;
        this.time = 180;
      }
      this.resendMessage = `You can resend email in ${this.time} seconds.`;
    }, 1000);
  }
}
