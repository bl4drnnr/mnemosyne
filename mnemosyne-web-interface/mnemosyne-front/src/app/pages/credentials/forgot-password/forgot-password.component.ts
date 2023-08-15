import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthenticationService } from '@services/authentication.service';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { ComponentsTranslation } from '@translations/components.enum';

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
    private readonly translationService: TranslationService
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
    const countdownInterval = setInterval(async () => {
      this.time -= 1;
      if (this.time <= 0) {
        clearInterval(countdownInterval);
        this.isCountdownRunning = false;
        this.time = 180;
      }
      this.resendMessage = await this.translationService.translateText(
        'resendEmailIn',
        ComponentsTranslation.INPUT,
        { time: this.time, s: this.time !== 1 ? 's' : '' }
      );
    }, 1000);
  }

  ngOnInit() {
    this.translationService.setPageTitle(Titles.FORGOT_PASSWORD);
  }
}
