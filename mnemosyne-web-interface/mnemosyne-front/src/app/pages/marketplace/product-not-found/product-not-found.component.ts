import { Component, OnInit } from '@angular/core';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';

@Component({
  selector: 'page-product-not-found',
  templateUrl: './product-not-found.component.html',
  styleUrls: ['./product-not-found.component.scss']
})
export class ProductNotFoundComponent implements OnInit {
  constructor(private readonly translationService: TranslationService) {}

  ngOnInit() {
    this.translationService.setPageTitle(Titles.PRODUCT_NOT_FOUND);
  }
}
