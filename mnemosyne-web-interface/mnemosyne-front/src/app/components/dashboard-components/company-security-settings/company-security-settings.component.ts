import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CompanyService } from '@services/company.service';
import { CompanyOwnershipTransferredResponse } from '@responses/company-ownership-transferred.enum';
import { animate, style, transition, trigger } from '@angular/animations';
import { PhoneService } from '@services/phone.service';
import { TransferCompanyOwnershipPayload } from '@payloads/transfer-company-ownership.interface';
import { ValidationService } from '@services/validation.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { DeleteCompanyPayload } from '@payloads/delete-company.interface';
import { CompanyDeletedResponse } from '@responses/company-deleted.enum';

@Component({
  selector: 'dashboard-company-security-settings',
  templateUrl: './company-security-settings.component.html',
  styleUrls: [
    './company-security-settings.component.scss',
    '../shared/security-setting-section/security-setting-section.component.scss'
  ],
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
  @Output() deleteCompanyAccount = new EventEmitter<string>();

  // @TODO Creation, modification, deletion and assigning of roles to users + front end section (also check if there is something that can be done to current role controller and service) -- delete seeder, add companyId to the table with roles, once the company is created, add 3 default roles to the roles table
  // @TODO GENERAL -- Complete all unfinished functions and perform the global test
  // @TODO Implement logs but for clients (both end users and companies)
  // @TODO Add read write scopes for existing scopes
  // @TODO Refactor error codes for custom errors and check on the Internet what should be thrown
  showOwnershipTransferModal = false;

  deleteCompanyModal = false;
  deleteCompanyPassword: string;
  deleteCompanyPassphrase: string;
  deleteCompanyIncorrectPassphrase: boolean;
  deleteCompanyIncorrectPassword: boolean;
  deleteCompanyRecoveryKey1: string;
  deleteCompanyIncorrectRecoveryKey1: boolean;
  deleteCompanyRecoveryKey2: string;
  deleteCompanyIncorrectRecoveryKey2: boolean;
  deleteCompanyRecoveryKey3: string;
  deleteCompanyIncorrectRecoveryKey3: boolean;
  deleteCompanyRecoveryKey4: string;
  deleteCompanyIncorrectRecoveryKey4: boolean;
  deleteCompanyRecoveryKey5: string;
  deleteCompanyIncorrectRecoveryKey5: boolean;
  deleteCompanyMfaCode: string;
  deleteCompanyPhoneCode: string;
  deleteCompanyIsPhoneRequired: boolean;
  deleteCompanyIsMfaRequired: boolean;
  deleteCompanyPhoneCodeSent = false;
  deleteCompanyStep = 1;

  newCompanyOwnerEmail: string;
  incorrectNewCompanyOwnerEmail: boolean;
  transferOwnershipPhoneCode: string;
  transferOwnershipMfaCode: string;
  transferOwnershipStep = 1;
  transferOwnershipIsPhoneRequired: boolean;
  transferOwnershipIsMfaRequired: boolean;
  transferOwnershipPhoneCodeSent = false;

  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly validationService: ValidationService,
    private readonly companyService: CompanyService,
    private readonly phoneService: PhoneService
  ) {}

  closeOwnershipTransferModal() {
    if (this.transferOwnershipIsPhoneRequired) this.clearSmsCode();

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
    if (this.deleteCompanyIsPhoneRequired) this.clearSmsCode();

    this.deleteCompanyStep = 1;
    this.deleteCompanyModal = false;
    this.deleteCompanyPassword = '';
    this.deleteCompanyPassphrase = '';
    this.deleteCompanyIncorrectPassphrase = false;
    this.deleteCompanyIncorrectPassword = false;
    this.deleteCompanyRecoveryKey1 = '';
    this.deleteCompanyIncorrectRecoveryKey1 = false;
    this.deleteCompanyRecoveryKey2 = '';
    this.deleteCompanyIncorrectRecoveryKey2 = false;
    this.deleteCompanyRecoveryKey3 = '';
    this.deleteCompanyIncorrectRecoveryKey3 = false;
    this.deleteCompanyRecoveryKey4 = '';
    this.deleteCompanyIncorrectRecoveryKey4 = false;
    this.deleteCompanyRecoveryKey5 = '';
    this.deleteCompanyIncorrectRecoveryKey5 = false;
    this.deleteCompanyIsPhoneRequired = false;
    this.deleteCompanyIsMfaRequired = false;
    this.deleteCompanyPhoneCodeSent = false;
    this.deleteCompanyMfaCode = '';
    this.deleteCompanyPhoneCode = '';
  }

  deleteCompany() {
    const payload: DeleteCompanyPayload = {
      password: this.deleteCompanyPassword,
      passphrase: this.deleteCompanyPassphrase,
      recoveryKeys: [
        this.deleteCompanyRecoveryKey1,
        this.deleteCompanyRecoveryKey2,
        this.deleteCompanyRecoveryKey3,
        this.deleteCompanyRecoveryKey4,
        this.deleteCompanyRecoveryKey5
      ]
    };

    if (this.deleteCompanyPhoneCode?.length === 6)
      payload.phoneCode = this.deleteCompanyPhoneCode;

    if (this.deleteCompanyMfaCode?.length === 6)
      payload.mfaCode = this.deleteCompanyMfaCode;

    this.companyService
      .deleteCompany({
        ...payload
      })
      .subscribe({
        next: async ({ message }) => {
          switch (message) {
            case CompanyDeletedResponse.FULL_MFA_REQUIRED:
              this.deleteCompanyStep = 2;
              this.deleteCompanyIsMfaRequired = true;
              this.deleteCompanyIsPhoneRequired = true;
              this.deleteCompanyPhoneCodeSent = true;
              break;
            case CompanyDeletedResponse.TOKEN_TWO_FA_REQUIRED:
              this.deleteCompanyStep = 2;
              this.deleteCompanyIsMfaRequired = true;
              break;
            case CompanyDeletedResponse.PHONE_REQUIRED:
              this.deleteCompanyStep = 2;
              this.deleteCompanyIsPhoneRequired = true;
              this.deleteCompanyPhoneCodeSent = true;
              break;
            case CompanyDeletedResponse.COMPANY_DELETED:
              this.deleteCompanyAccount.emit(message);
              location.reload();
              break;
          }
        }
      });
  }

  deleteCompanyVerifyPhoneDisable() {
    return this.deleteCompanyPhoneCode?.length !== 6;
  }

  deleteCompanyTwoFaButtonDisable() {
    return this.deleteCompanyMfaCode?.length !== 6;
  }

  deleteCompanyRecoveryKeysButtonDisable() {
    return (
      !this.deleteCompanyRecoveryKey1 ||
      !this.deleteCompanyRecoveryKey2 ||
      !this.deleteCompanyRecoveryKey3 ||
      !this.deleteCompanyRecoveryKey4 ||
      !this.deleteCompanyRecoveryKey5 ||
      this.deleteCompanyIncorrectRecoveryKey1 ||
      this.deleteCompanyIncorrectRecoveryKey2 ||
      this.deleteCompanyIncorrectRecoveryKey3 ||
      this.deleteCompanyIncorrectRecoveryKey4 ||
      this.deleteCompanyIncorrectRecoveryKey5
    );
  }

  deleteCompanyResendSmsCode() {
    this.phoneService.getSmsCode().subscribe({
      next: () => (this.deleteCompanyPhoneCodeSent = true)
    });
  }

  disabledCompanyDeletionButton() {
    switch (this.deleteCompanyStep) {
      case 1:
        return (
          this.deleteCompanyIncorrectPassword ||
          this.deleteCompanyIncorrectPassphrase ||
          this.deleteCompanyRecoveryKeysButtonDisable()
        );
      case 2:
        if (this.deleteCompanyIsPhoneRequired) {
          return this.deleteCompanyVerifyPhoneDisable();
        } else if (this.deleteCompanyIsMfaRequired) {
          return this.deleteCompanyTwoFaButtonDisable();
        } else {
          return (
            this.deleteCompanyVerifyPhoneDisable() &&
            this.deleteCompanyTwoFaButtonDisable()
          );
        }
      default:
        return false;
    }
  }

  transferOwnership() {
    const payload: TransferCompanyOwnershipPayload = {
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
            case CompanyOwnershipTransferredResponse.FULL_MFA_REQUIRED:
              this.transferOwnershipStep = 2;
              this.transferOwnershipIsPhoneRequired = true;
              this.transferOwnershipIsMfaRequired = true;
              this.transferOwnershipPhoneCodeSent = true;
              break;
            case CompanyOwnershipTransferredResponse.TOKEN_TWO_FA_REQUIRED:
              this.transferOwnershipStep = 2;
              this.transferOwnershipIsMfaRequired = true;
              break;
            case CompanyOwnershipTransferredResponse.PHONE_REQUIRED:
              this.transferOwnershipStep = 2;
              this.transferOwnershipIsPhoneRequired = true;
              this.transferOwnershipPhoneCodeSent = true;
              break;
            case CompanyOwnershipTransferredResponse.COMPANY_OWNERSHIP_TRANSFERRED:
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

  clearSmsCode() {
    this.phoneService.clearSmsCode().subscribe();
  }

  isPassphraseValid() {
    return this.validationService.checkLength({
      str: this.deleteCompanyPassphrase,
      min: 8,
      max: 128
    });
  }

  selectFile(event: any): void {
    const file = event.target.files[0];

    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const recoveryKeysStr = fileReader.result;
      if (!recoveryKeysStr) return;

      const recoveryKeys = (recoveryKeysStr as string).split('\n\n');
      const areKeyValid =
        this.validationService.checkRecoveryKeys(recoveryKeys);

      if (!areKeyValid) {
        await this.globalMessageService.handleError({
          message: 'invalid-recovery-keys'
        });
      } else {
        this.deleteCompanyRecoveryKey1 = recoveryKeys[0];
        this.deleteCompanyRecoveryKey2 = recoveryKeys[1];
        this.deleteCompanyRecoveryKey3 = recoveryKeys[2];
        this.deleteCompanyRecoveryKey4 = recoveryKeys[3];
        this.deleteCompanyRecoveryKey5 = recoveryKeys[4];
      }
    };

    fileReader.readAsText(file);
  }
}
