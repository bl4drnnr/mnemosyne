import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@pages/shared/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'page-reset-password',
  templateUrl: './reset-password.component.html',
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
export class ResetPasswordComponent implements OnInit {
  hash: string;
  password = '';
  incorrectPassword = true;
  phoneCode: string;
  mfaCode: string;

  isPhoneRequired: boolean;
  isMfaRequired: boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async resetUserPassword() {
    await this.authenticationService
      .resetUserPassword({
        hash: this.hash,
        password: this.password,
        phoneCode: this.phoneCode,
        mfaCode: this.mfaCode
      })
      .subscribe({
        next: () => {},
        error: async () => {
          await this.handleRedirect('login');
        }
      });
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const hash = params.get('hash');
      if (!hash) await this.handleRedirect('login');
      else {
        this.hash = hash;
        await this.resetUserPassword();
      }
    });
  }
}
