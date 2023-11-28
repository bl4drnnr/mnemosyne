import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyService } from '@services/company.service';
import { CompanyOwnershipTransferredEnum } from '@responses/company-ownership-transferred.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { animate, style, transition, trigger } from '@angular/animations';
import { PhoneService } from '@services/phone.service';

@Component({
  selector: 'dashboard-company-security-settings',
  templateUrl: './company-security-settings.component.html',
  styleUrls: ['./company-security-settings.component.scss'],
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
export class CompanySecuritySettingsComponent {
  @Input() companyOwnerEmail: string;
  @Output() transferCompanyOwnership = new EventEmitter<string>();

  showOwnershipTransferModal = false;
  deleteCompanyModal = false;

  newCompanyOwnerEmail: string;
  incorrectNewCompanyOwnerEmail: boolean;
  transferOwnershipPhoneCode: string;
  transferOwnershipMfaCode: string;
  transferOwnershipStep = 1;
  transferOwnershipIsPhoneRequired: boolean;
  transferOwnershipIsMfaRequired: boolean;
  transferOwnershipPhoneCodeSent = false;

  constructor(
    private readonly companyService: CompanyService,
    private readonly phoneService: PhoneService
  ) {}

  closeOwnershipTransferModal() {
    this.newCompanyOwnerEmail = '';
    this.showOwnershipTransferModal = false;
  }

  closeDeleteCompanyModal() {
    this.deleteCompanyModal = false;
  }

  transferOwnership() {
    this.companyService
      .transferCompanyOwnership({
        newCompanyOwnerEmail: this.newCompanyOwnerEmail,
        phoneCode: this.transferOwnershipPhoneCode,
        mfaCode: this.transferOwnershipMfaCode
      })
      .subscribe({
        next: async ({ message }) => {
          switch (message) {
            case CompanyOwnershipTransferredEnum.FULL_MFA_REQUIRED:
              this.transferOwnershipStep = 2;
              this.transferOwnershipIsPhoneRequired = true;
              this.transferOwnershipIsMfaRequired = true;
              break;
            case CompanyOwnershipTransferredEnum.TOKEN_TWO_FA_REQUIRED:
              this.transferOwnershipStep = 2;
              this.transferOwnershipIsMfaRequired = true;
              break;
            case CompanyOwnershipTransferredEnum.PHONE_REQUIRED:
              this.transferOwnershipStep = 2;
              this.transferOwnershipIsPhoneRequired = true;
              break;
            case CompanyOwnershipTransferredEnum.COMPANY_OWNERSHIP_TRANSFERRED:
              this.transferOwnershipStep = 3;
              this.transferCompanyOwnership.emit(message);
              break;
          }
        },
        error: (err: HttpErrorResponse) => {
          //
        }
      });
  }

  transferOwnershipResendSmsCode() {
    this.phoneService.getSmsCode().subscribe({
      next: () => (this.transferOwnershipPhoneCodeSent = true)
    });
  }

  disabledTransferOwnershipButton() {
    return this.incorrectNewCompanyOwnerEmail || !this.newCompanyOwnerEmail;
  }
}
