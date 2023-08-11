import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { ResetUserPasswordResponse } from '@responses/reset-user-password.response';
import { AuthenticationService } from '@services/authentication.service';
import { ValidationService } from '@services/validation.service';
import { PhoneService } from '@services/phone.service';
import { PageTitleService } from '@services/page-title.service';
import { TitlesPages } from '@interfaces/titles.pages';

@Component({
  selector: 'page-reset-password',
  templateUrl: './reset-password.component.html',
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
export class ResetPasswordComponent implements OnInit {
  step = 1;
  hash: string;
  password: string;
  incorrectPassword = true;
  phoneCode: string;
  mfaCode: string;

  isPhoneRequired: boolean;
  isMfaRequired: boolean;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly validationService: ValidationService,
    private readonly pageTitleService: PageTitleService,
    private readonly phoneService: PhoneService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  resendSmsCode() {
    this.phoneService
      .hashSendSmsCode({
        hash: this.hash
      })
      .subscribe();
  }

  resetUserPassword() {
    if (this.step === 1 && this.incorrectPassword) return;
    else if (this.step === 2 && this.mfaButtonDisabled()) return;

    this.authenticationService
      .resetUserPassword({
        hash: this.hash,
        password: this.password,
        phoneCode: this.phoneCode,
        mfaCode: this.mfaCode
      })
      .subscribe({
        next: async (response) => {
          if (response && response.message) {
            switch (response.message) {
              case ResetUserPasswordResponse.FULL_MFA_REQUIRED:
                this.step = 2;
                this.isPhoneRequired = true;
                this.isMfaRequired = true;
                break;
              case ResetUserPasswordResponse.PHONE_REQUIRED:
                this.step = 2;
                this.isPhoneRequired = true;
                break;
              case ResetUserPasswordResponse.TOKEN_TWO_FA_REQUIRED:
                this.step = 2;
                this.isMfaRequired = true;
                break;
              case ResetUserPasswordResponse.PASSWORD_RESET:
                this.step = 3;
                break;
              default:
                await this.handleRedirect('login');
                break;
            }
          }
        }
      });
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  mfaButtonDisabled() {
    return this.validationService.mfaButtonDisable({
      isPhoneRequired: this.isPhoneRequired,
      isMfaRequired: this.isMfaRequired,
      phoneCode: this.phoneCode,
      mfaCode: this.mfaCode
    });
  }

  ngOnInit() {
    this.pageTitleService.setPageTitle(TitlesPages.RESET_PASSWORD);

    this.route.paramMap.subscribe(async (params) => {
      const hash = params.get('hash');
      if (!hash) await this.handleRedirect('login');
      else {
        this.hash = hash;
        await this.resetUserPassword();
      }
    });
  }
}
