import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '@services/categories.service';
import { TranslationService } from '@services/translation.service';
import { GetAllCategoriesResponse } from '@responses/get-all-categories.interface';
import { Titles } from '@interfaces/titles.enum';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  productTitle: string;
  incorrectProductTitle: boolean;
  productDescription: string;
  incorrectProductDescription: boolean;
  categories: Array<GetAllCategoriesResponse>;
  categoriesNames: Array<string>;

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly translationService: TranslationService
  ) {}

  ngOnInit() {
    this.translationService.setPageTitle(Titles.CREATE_PRODUCT);

    this.categoriesService.getAllCategories().subscribe({
      next: ({ categories }) => {
        this.categories = categories;
        this.categoriesNames = categories.map(({ name }) => name);
      }
    });
  }
}
