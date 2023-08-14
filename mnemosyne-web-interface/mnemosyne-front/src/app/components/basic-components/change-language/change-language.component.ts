import { Component, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { EnvService } from '@shared/env.service';
import { ChangeLanguageModel } from '@components/change-language/change-language.model';

@Component({
  selector: 'basic-change-language',
  templateUrl: './change-language.component.html',
  styleUrls: ['./change-language.component.scss']
})
export class ChangeLanguageComponent implements OnInit {
  currentLanguage: { name: string; link: string };
  showLanguages: boolean;
  languages = [
    {
      name: ChangeLanguageModel.PL,
      link: `${this.envService.getStaticStorageLink}/icons/pl.png`
    },
    {
      name: ChangeLanguageModel.RU,
      link: `${this.envService.getStaticStorageLink}/icons/ru.png`
    },
    {
      name: ChangeLanguageModel.EN,
      link: `${this.envService.getStaticStorageLink}/icons/en.png`
    }
  ];

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly envService: EnvService
  ) {}

  changeLanguage(languageCode: string) {
    this.currentLanguage = this.languages.find((l) => l.name === languageCode)!;
    this.translocoService.setActiveLang(languageCode);
    this.showLanguages = false;
  }

  ngOnInit() {
    const currentLang = localStorage.getItem('translocoLang');

    if (
      currentLang &&
      [
        ChangeLanguageModel.PL,
        ChangeLanguageModel.RU,
        ChangeLanguageModel.EN
      ].includes(currentLang as ChangeLanguageModel)
    ) {
      this.currentLanguage = this.languages.find(
        (l) => l.name === currentLang
      )!;
    } else {
      this.currentLanguage = {
        name: ChangeLanguageModel.EN,
        link: `${this.envService.getStaticStorageLink}/icons/en.png`
      };
    }
  }
}
