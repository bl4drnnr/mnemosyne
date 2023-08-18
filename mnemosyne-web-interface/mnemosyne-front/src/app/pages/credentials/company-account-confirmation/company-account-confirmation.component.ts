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

  isCompanyAccConfirmed = false;
  isMfaNotSet = true;
  isRecoveryKeysNotSet = true;
  isUserDataNotSet = true;
  isPasswordNotSet = true;
  accountConfirmationError: boolean;

  hash: string;
  phone: string;
  code: string;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly translationService: TranslationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  confirmCompanyAccount(hash: string) {
    this.authenticationService
      .confirmCompanyAccount({
        confirmationHash: hash
      })
      .subscribe({
        next: ({ message }) => {
          switch (message) {
            case ConfirmCompanyAccountEnum.USER_DATA_NOT_SET:
              this.userDataNotSet();
              break;
            case ConfirmCompanyAccountEnum.PASSWORD_NOT_SET:
              this.userPasswordNotSet();
              break;
            case ConfirmCompanyAccountEnum.MFA_NOT_SET:
              this.userMfaNotSet();
              break;
            case ConfirmCompanyAccountEnum.RECOVERY_KEYS_NOT_SET:
              this.userRecoveryNotSet();
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

  userDataNotSet() {
    this.isCompanyAccConfirmed = true;
  }

  userPasswordNotSet() {
    this.isCompanyAccConfirmed = true;
  }

  userMfaNotSet() {
    this.isCompanyAccConfirmed = true;
  }

  userRecoveryNotSet() {
    this.isCompanyAccConfirmed = true;
  }

  companyAccountConfirmed() {
    this.isCompanyAccConfirmed = true;
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.translationService.setPageTitle(Titles.ACCOUNT_CONFIRMATION);

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
