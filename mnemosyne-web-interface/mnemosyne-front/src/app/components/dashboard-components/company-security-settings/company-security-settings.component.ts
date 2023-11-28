import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyService } from '@services/company.service';
import { CompanyOwnershipTransferredEnum } from '@responses/company-ownership-transferred.enum';
import { animate, style, transition, trigger } from '@angular/animations';
import { PhoneService } from '@services/phone.service';
import { TransferCompanyOwnershipInterface } from '@payloads/transfer-company-ownership.interface';

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
    this.transferOwnershipStep = 1;
    this.newCompanyOwnerEmail = '';
    this.transferOwnershipPhoneCode = '';
    this.transferOwnershipMfaCode = '';
    this.transferOwnershipIsPhoneRequired = false;
    this.transferOwnershipIsMfaRequired = false;
    this.transferOwnershipPhoneCodeSent = false;
    this.showOwnershipTransferModal = false;
  }

  closeDeleteCompanyModal() {
    this.deleteCompanyModal = false;
  }

  transferOwnership() {
    const payload: TransferCompanyOwnershipInterface = {
      newCompanyOwnerEmail: this.newCompanyOwnerEmail
    };

    if (this.transferOwnershipPhoneCode?.length === 6)
      payload.phoneCode = this.transferOwnershipPhoneCode;

    if (this.transferOwnershipMfaCode?.length === 6)
      payload.mfaCode = this.transferOwnershipMfaCode;

    this.companyService
      .transferCompanyOwnership({
        ...payload
      })
      .subscribe({
        next: async ({ message }) => {
          switch (message) {
            case CompanyOwnershipTransferredEnum.FULL_MFA_REQUIRED:
              this.transferOwnershipStep = 2;
              this.transferOwnershipIsPhoneRequired = true;
              this.transferOwnershipIsMfaRequired = true;
              this.transferOwnershipPhoneCodeSent = true;
              break;
            case CompanyOwnershipTransferredEnum.TOKEN_TWO_FA_REQUIRED:
              this.transferOwnershipStep = 2;
              this.transferOwnershipIsMfaRequired = true;
              break;
            case CompanyOwnershipTransferredEnum.PHONE_REQUIRED:
              this.transferOwnershipStep = 2;
              this.transferOwnershipIsPhoneRequired = true;
              this.transferOwnershipPhoneCodeSent = true;
              break;
            case CompanyOwnershipTransferredEnum.COMPANY_OWNERSHIP_TRANSFERRED:
              this.transferOwnershipStep = 3;
              this.transferCompanyOwnership.emit(message);
              break;
          }
        }
      });
  }

  transferOwnershipVerifyPhoneDisable() {
    return this.transferOwnershipPhoneCode?.length !== 6;
  }

  transferOwnershipTwoFaButtonDisable() {
    return this.transferOwnershipMfaCode?.length !== 6;
  }

  transferOwnershipResendSmsCode() {
    this.phoneService.getSmsCode().subscribe({
      next: () => (this.transferOwnershipPhoneCodeSent = true)
    });
  }

  disabledTransferOwnershipButton() {
    switch (this.transferOwnershipStep) {
      case 1:
        return this.incorrectNewCompanyOwnerEmail || !this.newCompanyOwnerEmail;
      case 2:
        if (this.transferOwnershipIsPhoneRequired) {
          return this.transferOwnershipVerifyPhoneDisable();
        } else if (this.transferOwnershipIsMfaRequired) {
          return this.transferOwnershipTwoFaButtonDisable();
        } else {
          return (
            this.transferOwnershipVerifyPhoneDisable() &&
            this.transferOwnershipTwoFaButtonDisable()
          );
        }
      default:
        return false;
    }
  }
}
