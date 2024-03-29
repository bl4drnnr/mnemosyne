import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { AuthenticationService } from '@services/authentication.service';
import { ConfirmCompanyAccountResponse } from '@responses/confirm-company-account.enum';
import { StaticService } from '@services/static.service';
import { ConfirmCompanyAccountPayload } from '@payloads/confirm-company-account.interface';

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
  namePronunciation: string;
  homeAddress: string;
  homePhone: string;

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

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly translationService: TranslationService,
    private readonly staticService: StaticService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  googleAuthAppLink = this.staticService.getMfaAuthApps().google;
  microsoftAuthAppLink = this.staticService.getMfaAuthApps().microsoft;

  confirmCompanyAccount(hash: string) {
    const confirmationPayload: ConfirmCompanyAccountPayload = {
      confirmationHash: hash,
      firstName: this.firstName,
      lastName: this.lastName,
      password: this.password
    };

    if (this.namePronunciation)
      confirmationPayload.namePronunciation = this.namePronunciation;

    if (this.homeAddress) confirmationPayload.homeAddress = this.homeAddress;

    if (this.homePhone) confirmationPayload.homePhone = this.homePhone;

    this.authenticationService
      .confirmCompanyAccount({
        ...confirmationPayload
      })
      .subscribe({
        next: ({ message }) => {
          switch (message) {
            case ConfirmCompanyAccountResponse.USER_DATA_NOT_SET:
              this.ownerDataNotSet();
              break;
            case ConfirmCompanyAccountResponse.PASSWORD_NOT_SET:
              this.ownerPasswordNotSet();
              break;
            case ConfirmCompanyAccountResponse.MFA_NOT_SET:
              this.ownerMfaNotSet();
              break;
            case ConfirmCompanyAccountResponse.RECOVERY_KEYS_NOT_SET:
              this.ownerRecoveryNotSet();
              break;
            case ConfirmCompanyAccountResponse.COMPANY_ACCOUNT_CONFIRMED:
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
