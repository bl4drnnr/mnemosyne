import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { TranslocoService } from '@ngneat/transloco';
import { AuthenticationService } from '@services/authentication.service';
import { PhoneService } from '@services/phone.service';
import { MfaService } from '@services/mfa.service';

@Component({
  selector: 'page-component-mfa',
  templateUrl: './mfa.component.html',
  styleUrls: [
    './mfa.component.scss',
    '../../../pages/credentials/shared/credentials.component.scss'
  ]
})
export class MfaComponent {
  @Input() hash: string;
  @Input() email: string;
  @Input() password: string;
  @Output() confirmUserMfa = new EventEmitter<void>();

  phone: string;
  qrCode: string;
  code: string;
  twoFaToken: string;
  showQr = true;

  phoneCodeSent = false;
  isCountdownRunning = false;

  selectedMfaOption: DropdownInterface;
  mfaOptions: Array<DropdownInterface> = [
    { key: 'phone', value: 'Phone' },
    { key: 'mfa', value: 'Auth app' }
  ];

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly translocoService: TranslocoService,
    private readonly smsService: PhoneService,
    private readonly mfaService: MfaService
  ) {}

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
    if (!this.isAllFieldsCorrect()) return;

    if (this.selectedMfaOption.key === 'phone') {
      await this.verifyMobilePhone();
    } else if (this.selectedMfaOption.key === 'mfa') {
      await this.verifyTwoFaQrCode();
    }
  }

  async sendSmsCode(phone: string) {
    this.phone = phone;

    if (this.hash) {
      this.smsService
        .registrationSendSmsCode({ hash: this.hash, phone })
        .subscribe({
          next: () => (this.phoneCodeSent = true)
        });
    } else if (this.email && this.password) {
      this.smsService
        .loginSendSmsCode({
          email: this.email,
          password: this.password,
          phone
        })
        .subscribe({
          next: () => (this.phoneCodeSent = true)
        });
    }
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
    if (this.hash) {
      this.mfaService
        .registrationVerifyTwoFaQrCode({
          hash: this.hash,
          code: this.code,
          twoFaToken: this.twoFaToken
        })
        .subscribe({
          next: () => this.confirmUserMfa.emit()
        });
    } else if (this.email && this.password) {
      this.mfaService
        .loginVerifyTwoFaQrCode({
          email: this.email,
          password: this.password,
          code: this.code,
          twoFaToken: this.twoFaToken
        })
        .subscribe({
          next: () => this.confirmUserMfa.emit()
        });
    }
  }

  private async verifyMobilePhone() {
    if (this.hash) {
      this.smsService
        .registrationVerifyMobilePhone({
          hash: this.hash,
          phone: this.phone,
          code: this.code
        })
        .subscribe({
          next: () => this.confirmUserMfa.emit()
        });
    } else if (this.email && this.password) {
      this.smsService
        .loginVerifyMobilePhone({
          phone: this.phone,
          code: this.code,
          password: this.password,
          email: this.email
        })
        .subscribe({
          next: () => this.confirmUserMfa.emit()
        });
    }
  }

  private async generateTwoFaQrCode() {
    this.qrCode = '';
    this.twoFaToken = '';

    if (this.hash) {
      this.mfaService
        .registrationGenerateTwoFaQrCode({ hash: this.hash })
        .subscribe({
          next: ({ qr, secret }) => {
            this.qrCode = qr;
            this.twoFaToken = secret;
          }
        });
    } else if (this.email && this.password) {
      this.mfaService
        .loginGenerateTwoFaQrCode({
          email: this.email,
          password: this.password
        })
        .subscribe({
          next: ({ qr, secret }) => {
            this.qrCode = qr;
            this.twoFaToken = secret;
          }
        });
    }
  }
}
