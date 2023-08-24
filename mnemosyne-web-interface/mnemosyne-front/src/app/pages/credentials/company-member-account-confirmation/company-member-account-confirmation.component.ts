import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@services/authentication.service';
import { TranslationService } from '@services/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Titles } from '@interfaces/titles.enum';
import { ConfirmCompanyMemberAccEnum } from '@responses/confirm-company-member-acc.enum';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-company-member-account-confirmation',
  templateUrl: './company-member-account-confirmation.component.html',
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
export class CompanyMemberAccountConfirmationComponent implements OnInit {
  step = 1;

  firstName: string;
  lastName: string;
  incorrectFirstName: boolean;
  incorrectLastName: boolean;
  password: string;
  incorrectPassword: boolean;

  isMemberAccConfirmed = false;
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

  confirmCompanyMemberAccount(hash: string) {
    this.authenticationService
      .confirmCompanyMembership({
        confirmationHash: hash,
        firstName: this.firstName,
        lastName: this.lastName,
        password: this.password
      })
      .subscribe({
        next: ({ message }) => {
          switch (message) {
            case ConfirmCompanyMemberAccEnum.USER_DATA_NOT_SET:
              this.memberDataNotSet();
              break;
            case ConfirmCompanyMemberAccEnum.PASSWORD_NOT_SET:
              this.memberPasswordNotSet();
              break;
            case ConfirmCompanyMemberAccEnum.MFA_NOT_SET:
              this.memberMfaNotSet();
              break;
            case ConfirmCompanyMemberAccEnum.RECOVERY_KEYS_NOT_SET:
              this.memberRecoveryNotSet();
              break;
            case ConfirmCompanyMemberAccEnum.COMPANY_MEMBER_ACC_CONFIRMED:
              this.memberAccountConfirmed();
              break;
            default:
              this.isMemberAccConfirmed = true;
              break;
          }
        },
        error: () => (this.accountConfirmationError = true)
      });
  }

  memberDataNotSet() {}

  memberPasswordNotSet() {}

  memberMfaNotSet() {}

  memberRecoveryNotSet() {}

  memberAccountConfirmed() {
    this.step = 3;
  }

  memberDataButtonDisabled() {
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
    this.translationService.setPageTitle(Titles.COMPANY_MEMBER_ACC_CONFIRM);

    this.route.paramMap.subscribe(async (params) => {
      const hash = params.get('hash');
      if (!hash) {
        await this.router.navigate(['login']);
      } else {
        this.hash = hash;
        this.confirmCompanyMemberAccount(hash);
      }
    });
  }
}
