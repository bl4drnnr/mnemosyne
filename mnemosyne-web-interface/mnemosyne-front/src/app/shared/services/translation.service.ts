import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { TitlesEnum } from '@interfaces/titles.enum';

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
    params?: { [key: string]: string | number }
  ): Promise<{ [key: string]: string }> {
    const translatedText = this.translocoService.selectTranslateObject(
      key,
      params,
      'credentials/registration'
    );

    const object: Promise<{ [key: string]: string }> = new Promise(
      (resolve) => {
        translatedText.subscribe({
          next: (textObject) => resolve(textObject)
        });
      }
    );

    return await object;
  }

  async translateText(
    key: string,
    params?: { [key: string]: string | number }
  ): Promise<string> {
    const translatedText = this.translocoService.selectTranslate(
      key,
      params,
      'credentials/registration'
    );

    const text: Promise<string> = new Promise((resolve) => {
      translatedText.subscribe({
        next: (text) => resolve(text)
      });
    });

    return await text;
  }

  setPageTitle(title: TitlesEnum) {
    const pageTitle = this.translocoService.selectTranslate(
      title,
      {},
      'pages/titles'
    );

    pageTitle.subscribe({
      next: (title) => this.titleService.setTitle(title)
    });
  }
}
