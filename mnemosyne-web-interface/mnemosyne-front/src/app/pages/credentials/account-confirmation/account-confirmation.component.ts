import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { ConfirmAccountResponse } from '@responses/confirm-account.enum';
import { AuthenticationService } from '@services/authentication.service';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';

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
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  async confirmUserAccount(hash: string) {
    this.authenticationService
      .confirmAccount({
        confirmationHash: hash
      })
      .subscribe({
        next: ({ message }) => {
          switch (message) {
            case ConfirmAccountResponse.MFA_NOT_SET:
              this.isMfaNotSet = true;
              this.isRecoveryKeysNotSet = false;
              this.isAccountConfirmed = true;
              break;
            case ConfirmAccountResponse.RECOVERY_KEYS_NOT_SET:
              this.isMfaNotSet = false;
              this.isRecoveryKeysNotSet = true;
              this.isAccountConfirmed = true;
              break;
            case ConfirmAccountResponse.ACCOUNT_CONFIRMED:
              this.isMfaNotSet = true;
              this.isRecoveryKeysNotSet = false;
              this.isAccountConfirmed = true;
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

  ngOnInit() {
    this.translationService.setPageTitle(Titles.ACCOUNT_CONFIRMATION);

    this.route.paramMap.subscribe(async (params) => {
      const hash = params.get('hash');
      if (!hash) {
        await this.router.navigate(['login']);
      } else {
        this.hash = hash;
        await this.confirmUserAccount(hash);
      }
    });
  }
}
