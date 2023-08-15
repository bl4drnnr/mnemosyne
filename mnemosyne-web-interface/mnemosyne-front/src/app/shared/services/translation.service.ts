import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Titles } from '@interfaces/titles.enum';
import { TranslationType } from '@interfaces/translation.type';
import { PageTranslation } from '@translations/pages.enum';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  constructor(
    private readonly translocoService: TranslocoService,
    private readonly titleService: Title
  ) {}

  async translateObject(
    key: string,
    scope: TranslationType,
    params?: { [key: string]: string | number }
  ): Promise<any> {
    const translatedText = this.translocoService.selectTranslateObject(
      key,
      params,
      scope
    );

    return await new Promise((resolve) => {
      translatedText.subscribe({
        next: (textObject) => resolve(textObject)
      });
    });
  }

  async translateText(
    key: string,
    scope: TranslationType,
    params?: { [key: string]: string | number }
  ): Promise<string> {
    const translatedText = this.translocoService.selectTranslate(
      key,
      params,
      scope
    );

    return await new Promise((resolve) => {
      translatedText.subscribe({
        next: (text) => resolve(text)
      });
    });
  }

  setPageTitle(title: Titles, params?: { [key: string]: string | number }) {
    const pageTitle = this.translocoService.selectTranslate(
      title,
      params,
      PageTranslation.TITLES
    );

    pageTitle.subscribe({
      next: (title) => this.titleService.setTitle(title)
    });
  }
}
