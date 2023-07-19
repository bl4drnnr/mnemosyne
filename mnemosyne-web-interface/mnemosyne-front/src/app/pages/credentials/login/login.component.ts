import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { LoginResponse } from '@responses/login.response';
import { AuthenticationService } from '@services/authentication.service';
import { ValidationService } from '@services/validation.service';
import { SmsService } from '@services/sms.service';

@Component({
  selector: 'page-login',
  templateUrl: './login.component.html',
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
export class LoginComponent {
  step = 1;

  email: string;
  password: string;

  incorrectEmail: boolean;
  incorrectPassword: boolean;

  isMfaSet: boolean;
  isPhoneRequired: boolean;
  isMfaRequired: boolean;

  phoneCode: string;
  mfaCode: string;

  constructor(
    private authenticationService: AuthenticationService,
    private smsService: SmsService,
    private validationService: ValidationService,
    private router: Router
  ) {}

  isAllCredentialsCorrect() {
    return (
      !this.email ||
      !this.password ||
      this.incorrectEmail ||
      this.incorrectPassword
    );
  }

  loginMfaButtonDisabled() {
    return this.validationService.mfaButtonDisable({
      isPhoneRequired: this.isPhoneRequired,
      isMfaRequired: this.isMfaRequired,
      phoneCode: this.phoneCode,
      mfaCode: this.mfaCode
    });
  }

  resendSmsCode() {
    this.smsService
      .loginSendSmsCode({
        email: this.email,
        password: this.password
      })
      .subscribe();
  }

  handleLogIn() {
    this.authenticationService
      .login({
        email: this.email,
        password: this.password,
        phoneCode: this.phoneCode,
        mfaCode: this.mfaCode
      })
      .subscribe({
        next: async ({ message, _at }) => {
          switch (message) {
            case LoginResponse.MFA_NOT_SET:
              this.step = 0;
              this.isMfaSet = false;
              break;
            case LoginResponse.MFA_REQUIRED:
              this.step = 2;
              this.isPhoneRequired = true;
              this.isMfaRequired = true;
              break;
            case LoginResponse.PHONE_REQUIRED:
              this.step = 2;
              this.isPhoneRequired = true;
              break;
            case LoginResponse.TWO_FA_REQUIRED:
              this.step = 2;
              this.isMfaRequired = true;
              break;
            default:
              localStorage.setItem('_at', _at);
              await this.router.navigate(['dashboard']);
          }
        }
      });
  }

  confirmUserMfa() {
    this.step = 1;
  }

  mfaChangeHandler({
    phoneCode,
    mfaCode
  }: {
    phoneCode?: string;
    mfaCode?: string;
  }) {
    this.mfaCode = mfaCode as string;
    this.phoneCode = phoneCode as string;

    if (
      this.isMfaRequired &&
      !this.isPhoneRequired &&
      this.mfaCode.length === 6
    ) {
      this.handleLogIn();
    } else if (
      !this.isMfaRequired &&
      this.isPhoneRequired &&
      this.phoneCode.length === 6
    ) {
      this.handleLogIn();
    } else if (
      this.isMfaRequired &&
      this.isPhoneRequired &&
      this.phoneCode.length === 6 &&
      this.mfaCode.length === 6
    ) {
      this.handleLogIn();
    }
  }
}
