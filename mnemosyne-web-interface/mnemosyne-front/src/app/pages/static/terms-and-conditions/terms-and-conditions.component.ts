import { Component, OnInit } from '@angular/core';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';

@Component({
  selector: 'page-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  constructor(private readonly translationService: TranslationService) {}

  ngOnInit() {
    this.translationService.setPageTitle(Titles.TAC);
  }
}
