import { Component, Input, OnInit } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

@Component({
  selector: 'layout-credentials',
  templateUrl: './credentials.layout.html',
  styleUrls: ['./credentials.layout.scss'],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: [
        { scope: 'messages/errors', alias: 'errors' },
        { scope: 'messages/responses', alias: 'responses' },
        { scope: 'components/mfa', alias: 'mfa' },
        { scope: 'components/dropdown', alias: 'dropdown' },
        { scope: 'components/link', alias: 'link' },
        { scope: 'components/button', alias: 'button' },
        { scope: 'components/input', alias: 'input' },
        { scope: 'credentials/header', alias: 'header' },
        { scope: 'credentials/login', alias: 'login' },
        { scope: 'credentials/account-confirmation', alias: 'acc-conf' },
        { scope: 'credentials/forgot-password', alias: 'forg-pass' },
        { scope: 'credentials/registration', alias: 'reg' },
        { scope: 'credentials/reset-password', alias: 'res-pass' }
      ]
    }
  ]
})
export class CredentialsLayout implements OnInit {
  @Input() renderSide: 'right' | 'left';
  @Input() animation: string;
  @Input() picture: string;
  @Input() folder: string;
  @Input() isLottie: boolean;
  @Input() mirroredHeader: boolean;
  @Input() width: number;
  @Input() height: number;
  @Input() headerLink: 'login' | 'registration';
  @Input() isAnimation: boolean;

  constructor(
    private readonly envService: EnvService,
    private readonly router: Router
  ) {}

  options: AnimationOptions;
  staticStorageLink: string;

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    if (this.isAnimation) {
      this.options = {
        path: `${this.envService.getStaticStorageLink}/animations/${this.animation}`
      };
    } else {
      this.staticStorageLink = `${this.envService.getStaticStorageLink}/${this.folder}/${this.picture}`;
    }
  }
}
