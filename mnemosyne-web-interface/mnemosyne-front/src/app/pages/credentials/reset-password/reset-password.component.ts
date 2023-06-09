import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@pages/shared/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { ResetUserPasswordResponse } from '@responses/reset-user-password.response';
import { ValidationService } from '@shared/validation.service';

@Component({
  selector: 'page-reset-password',
  templateUrl: './reset-password.component.html',
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
    private authenticationService: AuthenticationService,
    private validationService: ValidationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async resetUserPassword() {
    await this.authenticationService
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
              case ResetUserPasswordResponse.MFA_REQUIRED:
                this.isPhoneRequired = true;
                this.isMfaRequired = true;
                break;
              case ResetUserPasswordResponse.PHONE_REQUIRED:
                this.isPhoneRequired = true;
                break;
              case ResetUserPasswordResponse.TWO_FA_REQUIRED:
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
        },
        error: async () => {
          await this.handleRedirect('login');
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
