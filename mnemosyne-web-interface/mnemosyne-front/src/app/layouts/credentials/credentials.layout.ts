import { Component, Input, OnInit } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'layout-credentials',
  templateUrl: './credentials.layout.html',
  styleUrls: ['./credentials.layout.scss']
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

  languageFlags = [
    {
      name: 'pl',
      link: `${this.envService.getStaticStorageLink}/icons/pl.png`
    },
    {
      name: 'ru',
      link: `${this.envService.getStaticStorageLink}/icons/ru.png`
    },
    {
      name: 'uk',
      link: `${this.envService.getStaticStorageLink}/icons/en.png`
    }
  ];

  changeLanguage(lang: string) {
    //
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

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }
}
