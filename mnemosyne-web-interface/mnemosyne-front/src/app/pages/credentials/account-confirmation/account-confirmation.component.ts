import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@pages/shared/authentication.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ConfirmAccountResponse } from '@responses/confirm-account.response';

@Component({
  selector: 'page-account-confirmation',
  templateUrl: './account-confirmation.component.html',
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
export class AccountConfirmationComponent implements OnInit {
  step = 1;

  isAccountConfirmed = false;
  isMfaNotSet = true;
  accountConfirmationError: boolean;

  hash: string;
  phone: string;
  code: string;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  confirmUserMfa() {
    this.step = 3;
  }

  async confirmUserAccount(hash: string) {
    this.authenticationService.confirmAccount({ hash }).subscribe({
      next: ({ message }) => {
        this.isAccountConfirmed = true;
        if (message !== ConfirmAccountResponse.ACCOUNT_CONFIRMED)
          this.isMfaNotSet = message === ConfirmAccountResponse.MFA_NOT_SET;
      },
      error: () => (this.accountConfirmationError = true)
    });
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
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
