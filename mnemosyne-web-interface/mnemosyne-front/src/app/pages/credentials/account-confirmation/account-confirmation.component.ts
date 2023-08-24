import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { ConfirmAccountResponse } from '@responses/confirm-account.enum';
import { AuthenticationService } from '@services/authentication.service';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { StaticService } from '@services/static.service';

@Component({
  selector: 'page-account-confirmation',
  templateUrl: './account-confirmation.component.html',
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
export class AccountConfirmationComponent implements OnInit {
  step = 1;

  isAccountConfirmed = false;
  isMfaNotSet = true;
  isRecoveryKeysNotSet = true;
  accountConfirmationError: boolean;

  hash: string;
  phone: string;
  code: string;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly translationService: TranslationService,
    private readonly staticService: StaticService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  googleAuthAppLink = this.staticService.getMfaAuthApps().google;
  microsoftAuthAppLink = this.staticService.getMfaAuthApps().microsoft;

  confirmUserAccount(hash: string) {
    this.authenticationService
      .confirmAccount({
        confirmationHash: hash
      })
      .subscribe({
        next: ({ message }) => {
          switch (message) {
            case ConfirmAccountResponse.MFA_NOT_SET:
              this.userMfaNotSet();
              break;
            case ConfirmAccountResponse.RECOVERY_KEYS_NOT_SET:
              this.userRecoveryKeysNotSet();
              break;
            case ConfirmAccountResponse.ACCOUNT_CONFIRMED:
              this.accountConfirmed();
              break;
            default:
              this.isAccountConfirmed = true;
              break;
          }
        },
        error: () => (this.accountConfirmationError = true)
      });
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  userMfaNotSet() {
    this.isMfaNotSet = true;
    this.isRecoveryKeysNotSet = false;
    this.isAccountConfirmed = true;
  }

  userRecoveryKeysNotSet() {
    this.isMfaNotSet = false;
    this.isRecoveryKeysNotSet = true;
    this.isAccountConfirmed = true;
  }

  accountConfirmed() {
    this.isMfaNotSet = true;
    this.isRecoveryKeysNotSet = false;
    this.isAccountConfirmed = true;
  }

  ngOnInit() {
    this.translationService.setPageTitle(Titles.ACCOUNT_CONFIRMATION);

    this.route.paramMap.subscribe(async (params) => {
      const hash = params.get('hash');
      if (!hash) {
        await this.router.navigate(['login']);
      } else {
        this.hash = hash;
        this.confirmUserAccount(hash);
      }
    });
  }
}
