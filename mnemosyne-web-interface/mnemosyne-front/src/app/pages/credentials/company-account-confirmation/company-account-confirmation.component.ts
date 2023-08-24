import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { AuthenticationService } from '@services/authentication.service';
import { ConfirmCompanyAccountEnum } from '@responses/confirm-company-account.enum';

@Component({
  selector: 'page-company-account-confirmation',
  templateUrl: './company-account-confirmation.component.html',
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
export class CompanyAccountConfirmationComponent implements OnInit {
  step = 1;

  firstName: string;
  lastName: string;
  incorrectFirstName: boolean;
  incorrectLastName: boolean;
  password: string;
  incorrectPassword: boolean;

  isCompanyAccConfirmed = false;
  isOwnerDataNotSet = true;
  isPasswordNotSet = true;
  isMfaNotSet = true;
  isRecoveryKeysNotSet = true;
  accountConfirmationError: boolean;

  hash: string;

  googleAuthenticatorAppLink =
    'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pli=1';
  microsoftAuthenticatorAppLink =
    'https://support.microsoft.com/en-us/account-billing/download-and-install-the-microsoft-authenticator-app-351498fc-850a-45da-b7b6-27e523b8702a';

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly translationService: TranslationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  confirmCompanyAccount(hash: string) {
    this.authenticationService
      .confirmCompanyAccount({
        confirmationHash: hash,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password
      })
      .subscribe({
        next: ({ message }) => {
          switch (message) {
            case ConfirmCompanyAccountEnum.USER_DATA_NOT_SET:
              this.ownerDataNotSet();
              break;
            case ConfirmCompanyAccountEnum.PASSWORD_NOT_SET:
              this.ownerPasswordNotSet();
              break;
            case ConfirmCompanyAccountEnum.MFA_NOT_SET:
              this.ownerMfaNotSet();
              break;
            case ConfirmCompanyAccountEnum.RECOVERY_KEYS_NOT_SET:
              this.ownerRecoveryNotSet();
              break;
            case ConfirmCompanyAccountEnum.COMPANY_ACCOUNT_CONFIRMED:
              this.companyAccountConfirmed();
              break;
            default:
              this.isCompanyAccConfirmed = true;
              break;
          }
        },
        error: () => (this.accountConfirmationError = true)
      });
  }

  ownerDataNotSet() {
    this.isOwnerDataNotSet = true;
    this.isPasswordNotSet = false;
    this.isMfaNotSet = false;
    this.isRecoveryKeysNotSet = false;
    this.isCompanyAccConfirmed = true;
  }

  ownerPasswordNotSet() {
    this.isOwnerDataNotSet = false;
    this.isPasswordNotSet = true;
    this.isMfaNotSet = false;
    this.isRecoveryKeysNotSet = false;
    this.isCompanyAccConfirmed = true;
  }

  ownerMfaNotSet() {
    this.isOwnerDataNotSet = false;
    this.isPasswordNotSet = false;
    this.isMfaNotSet = true;
    this.isRecoveryKeysNotSet = false;
    this.isCompanyAccConfirmed = true;
  }

  ownerRecoveryNotSet() {
    this.isOwnerDataNotSet = false;
    this.isPasswordNotSet = false;
    this.isMfaNotSet = false;
    this.isRecoveryKeysNotSet = true;
    this.isCompanyAccConfirmed = true;
  }

  companyAccountConfirmed() {
    this.step = 3;
  }

  ownerDataButtonDisabled() {
    return (
      !this.firstName ||
      !this.lastName ||
      this.incorrectFirstName ||
      this.incorrectLastName
    );
  }

  passwordButtonDisabled() {
    return this.incorrectPassword;
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.translationService.setPageTitle(Titles.COMPANY_ACC_CONFIRMATION);

    this.route.paramMap.subscribe(async (params) => {
      const hash = params.get('hash');
      if (!hash) {
        await this.router.navigate(['login']);
      } else {
        this.hash = hash;
        this.confirmCompanyAccount(hash);
      }
    });
  }
}
