import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@pages/shared/authentication.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { DropdownInterface } from '@interfaces/dropdown.interface';

@Component({
  selector: 'page-account-confirmation',
  templateUrl: './account-confirmation.component.html',
  styleUrls: ['../credentials.component.scss'],
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
export class AccountConfirmationComponent implements OnInit {
  step = 2;

  hash: string;
  phone: string;
  qrCode: string;
  code: string;

  phoneCodeSent = false;
  isPhoneCorrect = true;
  time = 60;
  resendMessage: string;
  isCountdownRunning = false;

  selectedMfaOption: DropdownInterface;
  mfaOptions: Array<DropdownInterface> = [
    { key: 'phone', value: 'Mobile phone' },
    { key: 'mfa', value: 'Authenticator application' }
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
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

  async generateTwoFaQrCode() {
    await this.authenticationService
      .generateTwoFaQrCode({ hash: this.hash })
      .subscribe(({ qr }) => {
        this.qrCode = qr;
      });
  }

  async sendSmdCode() {
    this.phoneCodeSent = true;
    this.startCountdown();
  }

  async confirmUserAccount(hash: string) {
    await this.authenticationService
      .confirmAccount({ hash })
      .subscribe(({ message }) => {
        if (message === 'account-confirmed') this.step = 2;
        else this.step = 3;
      });
  }

  startCountdown() {
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

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const hash = params.get('hash');
      if (!hash) await this.router.navigate(['login']);
      else {
        this.hash = hash;
        // await this.confirmUserAccount(hash);
      }
    });
  }
}
