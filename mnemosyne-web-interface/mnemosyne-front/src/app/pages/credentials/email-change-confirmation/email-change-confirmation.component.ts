import { Component, OnInit } from '@angular/core';
import { EmailService } from '@services/email.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmEmailChangePayload } from '@payloads/confirm-email-change-payload.interface';
import { ConfirmEmailChangeResponse } from '@responses/confirm-email-change.enum';
import { animate, style, transition, trigger } from '@angular/animations';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { ValidationService } from '@services/validation.service';
import { PhoneService } from '@services/phone.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Status } from '@interfaces/statuses.enum';

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
  hash: string;

  password: string;
  incorrectPassword: boolean;
  phoneCode: string;
  mfaCode: string;

  isPhoneRequired: boolean;
  isMfaRequired: boolean;

  emailChangeError: boolean;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly emailService: EmailService,
    private readonly phoneService: PhoneService,
    private readonly pageTitleService: TranslationService,
    private readonly validationService: ValidationService
  ) {}

  confirmEmailChange() {
    const confirmEmailChangePayload: ConfirmEmailChangePayload | null = {};

    if (this.password) confirmEmailChangePayload.password = this.password;
    if (this.phoneCode) confirmEmailChangePayload.phoneCode = this.phoneCode;
    if (this.mfaCode) confirmEmailChangePayload.mfaCode = this.mfaCode;

    if (this.disableContinueButton() && this.step === 2) return;

    this.emailService
      .confirmEmailChange({
        hash: this.hash,
        payload: confirmEmailChangePayload
      })
      .subscribe({
        next: ({ message }) => {
          switch (message) {
            case ConfirmEmailChangeResponse.FULL_MFA_REQUIRED:
              this.step = 2;
              this.isPhoneRequired = true;
              this.isMfaRequired = true;
              break;
            case ConfirmEmailChangeResponse.TOKEN_TWO_FA_REQUIRED:
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
        },
        error: (err: HttpErrorResponse) => {
          this.emailChangeError = err.status === Status.NOT_FOUND;
        }
      });
  }

  resendSmsCode() {
    this.phoneService
      .hashSendSmsCode({
        hash: this.hash
      })
      .subscribe();
  }

  disableContinueButton() {
    return (
      this.incorrectPassword ||
      this.validationService.mfaButtonDisable({
        isPhoneRequired: this.isPhoneRequired,
        isMfaRequired: this.isMfaRequired,
        phoneCode: this.phoneCode,
        mfaCode: this.mfaCode
      })
    );
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.pageTitleService.setPageTitle(Titles.EMAIL_CHANGE_CONFIRMATION);

    this.route.paramMap.subscribe(async (params) => {
      const hash = params.get('hash');

      if (!hash) await this.handleRedirect('login');
      else {
        this.hash = hash;
        this.confirmEmailChange();
      }
    });
  }
}
