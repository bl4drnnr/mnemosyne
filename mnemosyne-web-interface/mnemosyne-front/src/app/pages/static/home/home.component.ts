import { Component, OnInit } from '@angular/core';
import { EnvService } from '@shared/env.service';
import { Router } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';

@Component({
  selector: 'basic-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('buttonAnimation', [
      state(
        'hidden',
        style({
          opacity: 0,
          transform: 'translateY(-80px)',
          filter: 'blur(15px)'
        })
      ),
      state(
        'visible',
        style({ opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' })
      ),
      transition('hidden => visible', animate('1000ms ease-in')),
      transition('visible => hidden', animate('1000ms ease-out'))
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-80px)',
          filter: 'blur(15px)'
        }),
        animate(
          '1000ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' })
        )
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  currentTypingText = 1;
  title1: string;
  title2: string;
  title3: string;

  constructor(
    private readonly envService: EnvService,
    private readonly translationService: TranslationService,
    private readonly router: Router
  ) {}

  animationOptions = {
    path: `${this.envService.getStaticStorageLink}/animations/blockchain_technology_home.json`
  };

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.HOME);
    // this.title1 = await this.translationService.translateText('', '');
    // this.title2 = await this.translationService.translateText('', '');
    // this.title3 = await this.translationService.translateText('', '');
  }
}
