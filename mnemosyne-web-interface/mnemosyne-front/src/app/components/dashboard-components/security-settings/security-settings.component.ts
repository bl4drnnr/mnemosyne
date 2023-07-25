import { Component, Input } from '@angular/core';
import { UserSecurityResponse } from '@responses/user-security.response';
import { MfaService } from '@services/mfa.service';
import { Router } from '@angular/router';
import { RefreshTokensService } from '@services/refresh-tokens.service';

@Component({
  selector: 'dashboard-security-settings',
  templateUrl: './security-settings.component.html',
  styleUrls: ['./security-settings.component.scss']
})
export class SecuritySettingsComponent {
  @Input() userSecurity: UserSecurityResponse;

  set2faModal: boolean;
  disable2faModal: boolean;
  qrCode: string;
  twoFaSecret: string;
  mfaCode: string;

  setMobilePhoneModal: boolean;
  disableMobilePhoneModal: boolean;

  changeEmailModal: boolean;
  changePasswordModal: boolean;
  deleteAccountModal: boolean;

  constructor(
    private readonly mfaService: MfaService,
    private readonly refreshTokensService: RefreshTokensService
  ) {}

  async generateTwoFaQrCode() {
    this.mfaService.generateTwoFaQrCode().subscribe({
      next: ({ qr, secret }) => {
        this.qrCode = qr;
        this.twoFaSecret = secret;
      },
      error: () => this.refreshTokensService.handleLogout()
    });
    this.set2faModal = true;
  }

  async verifyTwoFaQrCode() {
    this.mfaService
      .verifyTwoFaQrCode({
        twoFaToken: this.twoFaSecret,
        code: this.mfaCode
      })
      .subscribe({
        next: () => {
          //
        }
      });
  }
}
