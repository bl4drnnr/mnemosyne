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
import { PageTranslation } from '@translations/pages.enum';

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
  whateverYouNeedTitle: string;
  wheneverYouWantTitle: string;
  whereverYouAreaTile: string;
  subtitle: string;
  typedTitle1: string;
  typedTitle2: string;
  typedTitle3: string;

  stockItemsForHousePic = `${this.envService.getStaticStorageLink}/pictures/pages/home/stock-items-for-house.jpeg`;
  stockItemsForTravelsPic = `${this.envService.getStaticStorageLink}/pictures/pages/home/stock-items-for-travels.jpeg`;
  stockItemsForBusinessPic = `${this.envService.getStaticStorageLink}/pictures/pages/home/stock-items-for-business.jpeg`;
  stockItemsForCookingPic = `${this.envService.getStaticStorageLink}/pictures/pages/home/stock-items-for-cooking.jpeg`;
  stockItemsForSportPic = `${this.envService.getStaticStorageLink}/pictures/pages/home/stock-items-for-sport.jpeg`;
  stockItemsForComputerPic = `${this.envService.getStaticStorageLink}/pictures/pages/home/stock-items-for-computer.jpeg`;

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
    this.whateverYouNeedTitle = await this.translationService.translateText(
      'whateverYouNeedTitle',
      PageTranslation.HOME
    );
    this.wheneverYouWantTitle = await this.translationService.translateText(
      'wheneverYouWantTitle',
      PageTranslation.HOME
    );
    this.whereverYouAreaTile = await this.translationService.translateText(
      'whereverYouAreaTile',
      PageTranslation.HOME
    );
    this.subtitle = await this.translationService.translateText(
      'subtitle',
      PageTranslation.HOME
    );
    this.typedTitle1 = await this.translationService.translateText(
      'typedTitle1',
      PageTranslation.HOME
    );
    this.typedTitle2 = await this.translationService.translateText(
      'typedTitle2',
      PageTranslation.HOME
    );
    this.typedTitle3 = await this.translationService.translateText(
      'typedTitle3',
      PageTranslation.HOME
    );
  }
}
