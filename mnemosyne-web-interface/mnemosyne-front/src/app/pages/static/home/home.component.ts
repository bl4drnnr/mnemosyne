import {Component, OnInit} from '@angular/core';
import {EnvService} from '@shared/env.service';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {TranslationService} from '@services/translation.service';
import {Titles} from '@interfaces/titles.enum';
import {PageTranslation} from '@translations/pages.enum';
import {ProductsService} from "@services/products.service";
import {LatestProducts} from "@responses/get-latest-products.interface";

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
  homeSubtitle1: string;
  homeSubtitle2: string;
  homeSubtitle3: string;
  latestProducts: Array<LatestProducts>;

  constructor(
    private readonly envService: EnvService,
    private readonly translationService: TranslationService,
    private readonly productsService: ProductsService,
    private readonly router: Router
  ) {}

  animationOptions = {
    path: `${this.envService.getStaticStorageLink}/animations/home_animation.json`
  };

  homeAnimation1 = {
    path: `${this.envService.getStaticStorageLink}/animations/animation2.json`
  };

  homeAnimation2 = {
    path: `${this.envService.getStaticStorageLink}/animations/animation3.json`
  };

  homeAnimation3 = {
    path: `${this.envService.getStaticStorageLink}/animations/animation4.json`
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
    this.homeSubtitle1 = await this.translationService.translateText(
      'homeSubtitle1',
      PageTranslation.HOME
    );
    this.homeSubtitle2 = await this.translationService.translateText(
      'homeSubtitle2',
      PageTranslation.HOME
    );
    this.homeSubtitle3 = await this.translationService.translateText(
      'homeSubtitle3',
      PageTranslation.HOME
    );
    this.productsService.getLatestProducts().subscribe({
      next: ({ latestProducts }) => this.latestProducts = latestProducts
    })
  }
}
