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
  twoFaToken: string;
  qrCode: string;
  code: string;

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

  async changeMfaOption({ key, value }: DropdownInterface) {
    if (key === 'phone') {
      this.selectedMfaOption = this.mfaOptions[0];
    } else if (key === 'mfa') {
      this.selectedMfaOption = this.mfaOptions[1];
      await this.generateTwoFaQrCode();
    }
  }

  async generateTwoFaQrCode() {
    await this.authenticationService
      .generateTwoFaQrCode({ hash: this.hash })
      .subscribe(({ qr }) => {
        this.qrCode = qr;
      });
  }

  async sendCode() {
    //
  }

  async confirmUserSecurityUpdate() {
    await this.authenticationService.accountConfirmationUpdate({
      hash: '',
      phone: '',
      code: '',
      twoFaToken: ''
    });
  }

  async confirmUserAccount(hash: string) {
    await this.authenticationService
      .confirmAccount({ hash })
      .subscribe(({ message }) => {
        if (message === 'account-confirmed') this.step = 2;
        else this.step = 3;
      });
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
