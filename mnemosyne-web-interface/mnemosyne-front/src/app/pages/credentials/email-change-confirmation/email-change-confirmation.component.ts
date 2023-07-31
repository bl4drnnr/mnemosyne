import { Component, OnInit } from '@angular/core';
import { EmailService } from '@services/email.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEmailChangePayload } from '@payloads/confirm-email-change.payload';
import { ConfirmEmailChangeResponse } from '@responses/confirm-email-change.response';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-email-change-confirmation',
  templateUrl: './email-change-confirmation.component.html',
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
export class EmailChangeConfirmationComponent implements OnInit {
  step = 1;

  password: string;
  phoneCode: string;
  mfaCode: string;

  isPhoneRequired: boolean;
  isMfaRequired: boolean;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly emailService: EmailService
  ) {}

  confirmEmailChange(hash: string) {
    const confirmEmailChangePayload: ConfirmEmailChangePayload | null = {};

    if (this.password) confirmEmailChangePayload.password = this.password;
    if (this.phoneCode) confirmEmailChangePayload.phoneCode = this.phoneCode;
    if (this.mfaCode) confirmEmailChangePayload.mfaCode = this.mfaCode;

    this.emailService
      .confirmEmailChange({
        hash,
        payload: confirmEmailChangePayload
      })
      .subscribe({
        next: ({ message }) => {
          switch (message) {
            case ConfirmEmailChangeResponse.MFA_REQUIRED:
              this.step = 2;
              this.isPhoneRequired = true;
              this.isMfaRequired = true;
              break;
            case ConfirmEmailChangeResponse.TWO_FA_REQUIRED:
              this.step = 2;
              this.isMfaRequired = true;
              break;
            case ConfirmEmailChangeResponse.PHONE_REQUIRED:
              this.step = 2;
              this.isPhoneRequired = true;
              break;
            case ConfirmEmailChangeResponse.EMAIL_CHANGED:
              this.step = 3;
              break;
          }
        }
      });
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const hash = params.get('hash');

      if (!hash) await this.handleRedirect('login');
      else this.confirmEmailChange(hash);
    });
  }
}
