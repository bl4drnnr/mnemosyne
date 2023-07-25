import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSecurityResponse } from '@responses/user-security.response';
import { MfaService } from '@services/mfa.service';
import { Router } from '@angular/router';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { PhoneService } from '@services/phone.service';

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

  constructor(
    private readonly mfaService: MfaService,
    private readonly phoneService: PhoneService,
    private readonly refreshTokensService: RefreshTokensService
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

  async verifyTwoFaQrCode() {
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

  async disableTwoFa() {
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

    this.phoneService
      .sendSmsCode({
        phone: this.phone
      })
      .subscribe({
        next: () => (this.phoneCodeSent = true)
      });
  }

  async verifyMobilePhone() {
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
}
