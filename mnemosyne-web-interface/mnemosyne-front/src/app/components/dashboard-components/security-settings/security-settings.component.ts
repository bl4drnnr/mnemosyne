import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSecurityResponse } from '@responses/user-security.response';
import { MfaService } from '@services/mfa.service';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { PhoneService } from '@services/phone.service';
import { RecoveryService } from '@services/recovery.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { TranslocoService } from '@ngneat/transloco';
import { UsersService } from '@services/users.service';
import { PasswordChangedResponse } from '@responses/password-changed.response';
import { ChangePasswordPayload } from '@payloads/change-password.payload';
import { EmailService } from '@services/email.service';

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

  set2faModal: boolean;
  qrCode: string;
  twoFaToken: string;
  mfaCode = '';
  showQr = true;

  disable2faModal: boolean;
  disableTwoFaCode = '';

  setMobilePhoneModal: boolean;
  phone: string;
  phoneCode = '';
  phoneCodeSent = false;

  disableMobilePhoneModal: boolean;

  changeEmailModal: boolean;
  newEmail: string;
  incorrectNewEmail: boolean;

  changePasswordModal: boolean;
  currentPassword: string;
  incorrectPassword: boolean;
  newPassword: string;
  incorrectNewPassword: boolean;
  changePassMfaRequired: boolean;
  changePassMfaCode: string;
  changePassPhoneRequired: boolean;
  changePassPhoneCode: string;

  deleteAccountModal: boolean;

  generateRecoveryKeysModal: boolean;

  constructor(
    private readonly mfaService: MfaService,
    private readonly phoneService: PhoneService,
    private readonly usersService: UsersService,
    private readonly recoveryService: RecoveryService,
    private readonly translocoService: TranslocoService,
    private readonly emailService: EmailService,
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

    if (this.changePassMfaCode)
      changePasswordPayload.mfaCode = this.changePassMfaCode;
    if (this.changePassPhoneCode)
      changePasswordPayload.phoneCode = this.changePassPhoneCode;

    this.usersService
      .changePassword({
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
        mfaCode: this.changePassMfaCode,
        phoneCode: this.changePassPhoneCode
      })
      .subscribe({
        next: async ({ message }) => {
          switch (message) {
            case PasswordChangedResponse.MFA_REQUIRED:
              this.changePassMfaRequired = true;
              this.changePassPhoneRequired = true;
              break;
            case PasswordChangedResponse.PHONE_REQUIRED:
              this.changePassPhoneRequired = true;
              this.phoneCodeSent = true;
              break;
            case PasswordChangedResponse.TWO_FA_REQUIRED:
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

  changeEmail() {
    if (!this.newEmail || this.incorrectNewEmail) return;

    this.emailService.changeEmail({ newEmail: this.newEmail }).subscribe({
      next: () => {
        this.closeChangeEmailModal();
        this.changeEmailSent.emit();
      }
    });
  }

  confirmRecoveryKeysSetup() {
    this.globalMessageService.handle({
      message: this.translocoService.translate('successSetup', {}, 'settings'),
      isError: false
    });
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
  }

  closeChangeEmailModal() {
    this.changeEmailModal = false;
    this.newEmail = '';
  }

  closeDeleteAccountModal() {
    this.deleteAccountModal = false;
  }

  closeGenerateRecoveryKeysModal() {
    this.generateRecoveryKeysModal = false;
  }
}
