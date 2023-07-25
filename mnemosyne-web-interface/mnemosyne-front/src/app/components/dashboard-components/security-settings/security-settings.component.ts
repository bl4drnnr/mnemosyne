import { Component, Input } from '@angular/core';
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

  set2faModal: boolean;
  qrCode: string;
  twoFaToken: string;
  mfaCode: string;
  showQr = true;

  disable2faModal: boolean;
  disable2faCode = '';

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
          //
        }
      });
  }

  async disableTwoFa() {
    this.mfaService.disableTwoFa({ code: this.disable2faCode }).subscribe({
      next: () => {
        //
      }
    });
  }

  async sendSmsCode() {
    this.phoneService
      .sendSmsCode({
        phone: this.phone
      })
      .subscribe({
        next: () => {
          //
        }
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
          //
        }
      });
  }
}
