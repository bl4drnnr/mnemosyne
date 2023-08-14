import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslocoService } from '@ngneat/transloco';
import { AuthenticationService } from '@services/authentication.service';
import { TranslationService } from '@services/translation.service';
import { TitlesEnum } from '@interfaces/titles.enum';

@Component({
  selector: 'page-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../shared/credentials.component.scss'],
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
export class ForgotPasswordComponent implements OnInit {
  step = 1;

  email: string;
  incorrectEmail: boolean;

  resendMessage: string;
  time = 180;
  isCountdownRunning = false;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly pageTitleService: TranslationService,
    private readonly translocoService: TranslocoService
  ) {}

  sendForgotPasswordEmailDisable() {
    return this.incorrectEmail || !this.email;
  }

  forgotPasswordButtonDisable() {
    return this.incorrectEmail || !this.email || this.isCountdownRunning;
  }

  handleForgotPassword() {
    if (this.step === 1 && this.sendForgotPasswordEmailDisable()) return;
    else if (this.step === 2 && this.forgotPasswordButtonDisable()) return;

    this.authenticationService.forgotPassword({ email: this.email }).subscribe({
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
      this.resendMessage = this.translocoService.translate(
        'resendEmailIn',
        { time: this.time, s: this.time !== 1 ? 's' : '' },
        'components/input'
      );
    }, 1000);
  }

  ngOnInit() {
    this.pageTitleService.setPageTitle(TitlesEnum.FORGOT_PASSWORD);
  }
}
