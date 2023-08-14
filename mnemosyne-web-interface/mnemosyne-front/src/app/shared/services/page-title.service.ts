import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { TitlesEnum } from '@interfaces/titles.enum';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  constructor(
    private readonly translocoService: TranslocoService,
    private readonly titleService: Title
  ) {}

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
