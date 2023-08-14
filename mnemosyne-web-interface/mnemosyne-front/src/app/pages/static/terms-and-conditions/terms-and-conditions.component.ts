import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '@services/page-title.service';
import { TitlesEnum } from '@interfaces/titles.enum';

@Component({
  selector: 'page-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit {
  constructor(private readonly pageTitleService: PageTitleService) {}

  ngOnInit() {
    this.pageTitleService.setPageTitle(TitlesEnum.TAC);
  }
}
