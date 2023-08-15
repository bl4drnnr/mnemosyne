import { Component, Input, OnInit } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { CredentialsTranslationProvider } from '@layouts/credentials/credentials.translation';

@Component({
  selector: 'layout-credentials',
  templateUrl: './credentials.layout.html',
  styleUrls: ['./credentials.layout.scss'],
  providers: [CredentialsTranslationProvider]
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

  options: AnimationOptions;
  staticStorageLink: string;

  constructor(
    private readonly envService: EnvService,
    private readonly router: Router
  ) {}

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
