import { TranslocoService } from '@ngneat/transloco';
import { Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { TitlesPages } from '@interfaces/titles.pages';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  constructor(
    private readonly translocoService: TranslocoService,
    private readonly titleService: Title
  ) {}

  setPageTitle(title: TitlesPages) {
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
