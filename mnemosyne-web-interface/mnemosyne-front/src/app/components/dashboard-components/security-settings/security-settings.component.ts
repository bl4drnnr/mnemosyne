import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSecurityResponse } from '@responses/user-security.response';
import { MfaService } from '@services/mfa.service';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { PhoneService } from '@services/phone.service';
import { RecoveryService } from '@services/recovery.service';
import { GlobalMessageService } from '@shared/global-message.service';
import { TranslocoService } from '@ngneat/transloco';

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
  @Output() userSettingsReInit = new EventEmitter<void>();

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
  changePasswordModal: boolean;
  deleteAccountModal: boolean;

  generateRecoveryKeysModal: boolean;

  constructor(
    private readonly mfaService: MfaService,
    private readonly phoneService: PhoneService,
    private readonly recoveryService: RecoveryService,
    private readonly translocoService: TranslocoService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  async generateTwoFaQrCode() {
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

  async verifyTwoFaQrCode() {
    if (this.disableVerifyTwoFaQr()) return;

    this.mfaService
      .verifyTwoFaQrCode({
        twoFaToken: this.twoFaToken,
        code: this.mfaCode
      })
      .subscribe({
        next: () => {
          this.set2faModal = false;
          this.setTwoFa.emit();
          this.userSettingsReInit.emit();
        }
      });
  }

  twoFaButtonDisable() {
    return this.disableTwoFaCode.length !== 6;
  }

  async disableTwoFa() {
    if (this.twoFaButtonDisable()) return;

    this.mfaService.disableTwoFa({ code: this.disableTwoFaCode }).subscribe({
      next: () => {
        this.disable2faModal = false;
        this.unsetTwoFa.emit();
        this.userSettingsReInit.emit();
      }
    });
  }

  async sendSmsCode(phone: string) {
    this.phone = phone;

    this.phoneService.sendSmsCode({ phone: this.phone }).subscribe({
      next: () => (this.phoneCodeSent = true)
    });
  }

  verifyPhoneDisable() {
    return !this.phoneCodeSent || this.phoneCode.length !== 6;
  }

  async verifyMobilePhone() {
    if (this.verifyPhoneDisable()) return;

    this.phoneService
      .verifyMobilePhone({
        code: this.phoneCode,
        phone: this.phone
      })
      .subscribe({
        next: () => {
          this.setMobilePhoneModal = false;
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
          this.disableMobilePhoneModal = false;
          this.unsetPhone.emit();
          this.userSettingsReInit.emit();
        }
      });
  }

  confirmRecoveryKeysSetup() {
    this.globalMessageService.handle({
      message: this.translocoService.translate('successSetup', {}, 'settings'),
      isError: false
    });
  }
}
