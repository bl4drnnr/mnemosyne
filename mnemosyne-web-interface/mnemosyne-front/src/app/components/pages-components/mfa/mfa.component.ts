import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { AuthenticationService } from '@pages/shared/authentication.service';

@Component({
  selector: 'page-component-mfa',
  templateUrl: './mfa.component.html',
  styleUrls: [
    './mfa.component.scss',
    '../../../pages/credentials/credentials.component.scss'
  ]
})
export class MfaComponent {
  @Input() hash: string;
  @Output() confirmUserMfa = new EventEmitter<void>();

  phone: string;
  qrCode: string;
  code: string;

  resendMessage: string;
  phoneCodeSent = false;
  isPhoneCorrect = true;
  time = 60;
  isCountdownRunning = false;

  selectedMfaOption: DropdownInterface;
  mfaOptions: Array<DropdownInterface> = [
    { key: 'phone', value: 'Mobile phone' },
    { key: 'mfa', value: 'Authenticator application' }
  ];

  constructor(private authenticationService: AuthenticationService) {}

  async changeMfaOption({ key }: DropdownInterface) {
    if (key === 'phone') {
      this.selectedMfaOption = this.mfaOptions[0];
      this.qrCode = '';
    } else if (key === 'mfa') {
      this.selectedMfaOption = this.mfaOptions[1];
      await this.generateTwoFaQrCode();
    }
    this.code = '';
    this.phone = '';
  }

  async setUserMfa() {
    if (this.selectedMfaOption.key === 'phone') {
      await this.verifyMobilePhone();
    } else if (this.selectedMfaOption.key === 'mfa') {
      await this.verifyTwoFaQrCode();
    }
  }

  async sendSmdCode() {
    await this.authenticationService
      .sendSmsCode({ hash: this.hash, phone: this.phone })
      .subscribe({
        next: () => {
          this.phoneCodeSent = true;
          this.startCountdown();
        }
      });
  }

  isMobilePhoneCorrect(phone: string) {
    const pattern = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    this.phone = phone;
    if (phone.length) this.isPhoneCorrect = pattern.test(phone);
  }

  isAllFieldsCorrect() {
    if (this.selectedMfaOption?.key === 'phone') {
      return (
        this.phone && this.code && this.code.length === 6 && this.phoneCodeSent
      );
    } else if (this.selectedMfaOption?.key === 'mfa') {
      return this.qrCode && this.code && this.code.length === 6;
    } else {
      return false;
    }
  }

  private async verifyTwoFaQrCode() {
    await this.authenticationService
      .verifyTwoFaQrCode({ hash: this.hash, code: this.code })
      .subscribe({
        next: () => this.confirmUserMfa.emit()
      });
  }

  private async verifyMobilePhone() {
    await this.authenticationService
      .verifyMobilePhone({
        hash: this.hash,
        phone: this.phone,
        code: this.code
      })
      .subscribe({
        next: () => this.confirmUserMfa.emit()
      });
  }

  private startCountdown() {
    this.isCountdownRunning = true;
    const countdownInterval = setInterval(() => {
      this.time -= 1;
      if (this.time <= 0) {
        clearInterval(countdownInterval);
        this.isCountdownRunning = false;
        this.time = 60;
      }
      this.resendMessage = `You can resend SMS in ${this.time} seconds.`;
    }, 1000);
  }

  private async generateTwoFaQrCode() {
    await this.authenticationService
      .generateTwoFaQrCode({ hash: this.hash })
      .subscribe({
        next: ({ qr }) => (this.qrCode = qr)
      });
  }
}