import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSecurityResponse } from '@responses/user-security.interface';
import { MfaService } from '@services/mfa.service';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { PhoneService } from '@services/phone.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { UsersService } from '@services/users.service';
import { PasswordChangedResponse } from '@responses/password-changed.enum';
import { ChangePasswordPayload } from '@payloads/change-password.interface';
import { EmailService } from '@services/email.service';
import { TranslationService } from '@services/translation.service';
import { AccountTranslation } from '@translations/account.enum';
import { AccountDeletedResponse } from '@responses/account-deleted.enum';

@Component({
  selector: 'dashboard-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss']
})
export class SecuritySettingsComponent {
  @Input() userSecurity: UserSecurityResponse;
  @Output() setTwoFa = new EventEmitter<void>();
  @Output() unsetTwoFa = new EventEmitter<void>();
  @Output() setPhone = new EventEmitter<void>();
  @Output() unsetPhone = new EventEmitter<void>();
  @Output() passwordChanged = new EventEmitter<void>();
  @Output() userSettingsReInit = new EventEmitter<void>();
  @Output() changeEmailSent = new EventEmitter<void>();
  @Output() accountDeleted = new EventEmitter<void>();

  /**
   * Set token MFA
   */
  set2faModal: boolean;
  qrCode: string;
  twoFaToken: string;
  mfaCode = '';
  showQr = true;

  /**
   * Disable token MFA
   */
  disable2faModal: boolean;
  disableTwoFaCode = '';

  /**
   * Set mobile phone MFA
   */
  setMobilePhoneModal: boolean;
  phone: string;
  phoneCode = '';
  phoneCodeSent = false;

  /**
   * Disable mobile phone MFA
   */
  disableMobilePhoneModal: boolean;

  /**
   * Email change
   */
  changeEmailModal: boolean;
  newEmail: string;
  incorrectNewEmail: boolean;

  /**
   * Password change
   */
  changePasswordModal: boolean;
  currentPassword: string;
  incorrectPassword: boolean;
  newPassword: string;
  incorrectNewPassword: boolean;
  changePassMfaRequired: boolean;
  changePassMfaCode: string;
  changePassPhoneRequired: boolean;
  changePassPhoneCode: string;

  /**
   * Recovery key re-generating
   */
  generateRecoveryKeysModal: boolean;

  /**
   * Account deletion
   */
  deleteAccountModal: boolean;
  deleteAccPassword: string;
  deleteAccIncorrectPass: boolean;
  deleteAccMfaCode: string;
  deleteAccPhoneCode: string;
  deleteAccFullName: string;
  deleteAccMfaRequired: boolean;
  deleteAccPhoneRequired: boolean;
  deleteAccConfirmationRequired: boolean;

  constructor(
    private readonly mfaService: MfaService,
    private readonly phoneService: PhoneService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  generateTwoFaQrCode() {
    this.mfaService.generateTwoFaQrCode().subscribe({
      next: ({ qr, secret }) => {
        this.qrCode = qr;
        this.twoFaToken = secret;
      },
      error: () => this.refreshTokensService.handleLogout()
    });
    this.set2faModal = true;
  }

  disableVerifyTwoFaQr() {
    return this.mfaCode.length !== 6;
  }

  verifyTwoFaQrCode() {
    if (this.disableVerifyTwoFaQr()) return;

    this.mfaService
      .verifyTwoFaQrCode({
        twoFaToken: this.twoFaToken,
        code: this.mfaCode
      })
      .subscribe({
        next: () => {
          this.closeSet2faModal();
          this.setTwoFa.emit();
          this.userSettingsReInit.emit();
        }
      });
  }

  twoFaButtonDisable() {
    return this.disableTwoFaCode.length !== 6;
  }

  disableTwoFa() {
    if (this.twoFaButtonDisable()) return;

    this.mfaService.disableTwoFa({ code: this.disableTwoFaCode }).subscribe({
      next: () => {
        this.closeDisable2faModal();
        this.unsetTwoFa.emit();
        this.userSettingsReInit.emit();
      }
    });
  }

  sendSmsCode(phone: string | null) {
    if (phone) {
      this.phone = phone;

      this.phoneService.sendSmsCode({ phone: this.phone }).subscribe({
        next: () => (this.phoneCodeSent = true)
      });
    } else {
      this.phoneService.getSmsCode().subscribe({
        next: () => (this.phoneCodeSent = true)
      });
    }
  }

  verifyPhoneDisable() {
    return !this.phoneCodeSent || this.phoneCode.length !== 6;
  }

  verifyMobilePhone() {
    if (this.verifyPhoneDisable()) return;

    this.phoneService
      .verifyMobilePhone({
        code: this.phoneCode,
        phone: this.phone
      })
      .subscribe({
        next: () => {
          this.closeSetMobilePhoneModal();
          this.setPhone.emit();
          this.userSettingsReInit.emit();
        }
      });
  }

  disableMobilePhone() {
    this.phoneService
      .disablePhone({
        code: this.phoneCode
      })
      .subscribe({
        next: () => {
          this.closeDisableMobilePhoneModal();
          this.unsetPhone.emit();
          this.userSettingsReInit.emit();
        }
      });
  }

  changePassword() {
    const changePasswordPayload: ChangePasswordPayload = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    if (this.changePassMfaCode?.length === 6)
      changePasswordPayload.mfaCode = this.changePassMfaCode;
    if (this.changePassPhoneCode?.length === 6)
      changePasswordPayload.phoneCode = this.changePassPhoneCode;

    this.usersService
      .changePassword({
        ...changePasswordPayload
      })
      .subscribe({
        next: async ({ message }) => {
          switch (message) {
            case PasswordChangedResponse.FULL_MFA_REQUIRED:
              this.changePassMfaRequired = true;
              this.changePassPhoneRequired = true;
              this.phoneCodeSent = true;
              break;
            case PasswordChangedResponse.PHONE_REQUIRED:
              this.changePassPhoneRequired = true;
              this.phoneCodeSent = true;
              break;
            case PasswordChangedResponse.TOKEN_TWO_FA_REQUIRED:
              this.changePassMfaRequired = true;
              break;
            case PasswordChangedResponse.PASSWORD_CHANGED:
              this.closeChangePasswordModal();
              this.passwordChanged.emit();
              this.userSettingsReInit.emit();
              break;
          }
        }
      });
  }

  hidePasswordCreateFields() {
    return !this.changePassMfaRequired && !this.changePassPhoneRequired;
  }

  disableChangePasswordButton() {
    return (
      !this.currentPassword ||
      !this.newPassword ||
      this.incorrectPassword ||
      this.incorrectNewPassword
    );
  }

  disableChangePasswordMfaButton() {
    if (this.changePassMfaRequired && !this.changePassPhoneRequired) {
      return this.changePassMfaCode?.length !== 6;
    } else if (this.changePassPhoneRequired && !this.changePassMfaRequired) {
      return this.changePassPhoneCode?.length !== 6;
    } else {
      return (
        this.changePassMfaCode?.length !== 6 &&
        this.changePassPhoneCode?.length !== 6
      );
    }
  }

  deleteUserAccount() {
    this.usersService
      .deleteAccount({
        password: this.deleteAccPassword,
        mfaCode: this.deleteAccMfaCode,
        phoneCode: this.deleteAccPhoneCode,
        fullName: this.deleteAccFullName
      })
      .subscribe({
        next: async ({ message }) => {
          switch (message) {
            case AccountDeletedResponse.FULL_MFA_REQUIRED:
              this.deleteAccMfaRequired = true;
              this.deleteAccPhoneRequired = true;
              break;
            case AccountDeletedResponse.PHONE_REQUIRED:
              this.deleteAccPhoneRequired = true;
              break;
            case AccountDeletedResponse.TOKEN_TWO_FA_REQUIRED:
              this.deleteAccMfaRequired = true;
              break;
            case AccountDeletedResponse.DELETE_CONFIRMATION_REQUIRED:
              this.deleteAccConfirmationRequired = true;
              break;
            case AccountDeletedResponse.ACCOUNT_DELETED:
              this.closeDeleteAccountModal();
              this.accountDeleted.emit();
              break;
          }
        }
      });
  }

  changeEmail() {
    if (!this.newEmail || this.incorrectNewEmail) return;

    this.emailService.changeEmail({ newEmail: this.newEmail }).subscribe({
      next: () => {
        this.closeChangeEmailModal();
        this.changeEmailSent.emit();
      }
    });
  }

  async confirmRecoveryKeysSetup() {
    const message = await this.translationService.translateText(
      'successSetup',
      AccountTranslation.SETTINGS
    );
    this.globalMessageService.handle({ message });
  }

  clearSmsCode() {
    this.phoneService.clearSmsCode().subscribe();
  }

  closeSet2faModal() {
    this.set2faModal = false;
    this.qrCode = '';
    this.twoFaToken = '';
    this.mfaCode = '';
    this.showQr = true;
  }

  closeDisable2faModal() {
    this.disable2faModal = false;
    this.disableTwoFaCode = '';
  }

  closeSetMobilePhoneModal() {
    this.setMobilePhoneModal = false;
    this.phone = '';
    this.phoneCode = '';
    this.phoneCodeSent = false;
  }

  closeDisableMobilePhoneModal() {
    this.disableMobilePhoneModal = false;
  }

  closeChangePasswordModal() {
    if (this.changePassPhoneRequired) this.clearSmsCode();

    this.changePasswordModal = false;
    this.currentPassword = '';
    this.incorrectPassword = false;
    this.newPassword = '';
    this.incorrectNewPassword = false;
    this.changePassMfaRequired = false;
    this.changePassMfaCode = '';
    this.changePassPhoneRequired = false;
    this.changePassPhoneCode = '';
    this.phoneCodeSent = false;
  }

  closeChangeEmailModal() {
    this.changeEmailModal = false;
    this.newEmail = '';
  }

  closeDeleteAccountModal() {
    this.deleteAccountModal = false;
    this.deleteAccPassword = '';
    this.deleteAccIncorrectPass = false;
    this.deleteAccMfaCode = '';
    this.deleteAccPhoneCode = '';
    this.deleteAccFullName = '';
    this.deleteAccMfaRequired = false;
    this.deleteAccPhoneRequired = false;
    this.deleteAccConfirmationRequired = false;
    this.phoneCodeSent = false;
  }

  closeGenerateRecoveryKeysModal() {
    this.generateRecoveryKeysModal = false;
  }
}
