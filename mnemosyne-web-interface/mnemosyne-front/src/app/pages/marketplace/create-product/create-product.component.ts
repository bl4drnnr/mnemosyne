import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '@services/categories.service';
import { TranslationService } from '@services/translation.service';
import { GetAllCategoriesResponse } from '@responses/get-all-categories.interface';
import { Titles } from '@interfaces/titles.enum';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { ComponentsTranslation } from '@translations/components.enum';

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
  categoriesDropdown: Array<DropdownInterface>;
  subcategoriesDropdowns: Array<{
    categoryKey: string;
    subcategories: Array<DropdownInterface>;
  }>;
  subcategoriesDropdown: Array<DropdownInterface>;
  categoryDropdownValue: DropdownInterface = {
    key: '',
    value: ''
  };
  subcategoryDropdownValue: DropdownInterface = {
    key: '',
    value: ''
  };
  categoriesNames: Array<string>;
  selectProductSubcategoryTitle: string;

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly translationService: TranslationService
  ) {}

  getSubcategoryDropdownLabel(category: string) {
    switch (category) {
      case 'house':
        this.initSubcategoryDropdown(category);
        return 'dropdown.houseSubcategoryTitle';
      case 'travels':
        this.initSubcategoryDropdown(category);
        return 'dropdown.travelsSubcategoryTitle';
      case 'business':
        this.initSubcategoryDropdown(category);
        return 'dropdown.businessSubcategoryTitle';
      case 'cooking':
        this.initSubcategoryDropdown(category);
        return 'dropdown.cookingSubcategoryTitle';
      case 'sports':
        this.initSubcategoryDropdown(category);
        return 'dropdown.sportsSubcategoryTitle';
      case 'computers':
        this.initSubcategoryDropdown(category);
        return 'dropdown.computersSubcategoryTitle';
      default:
        this.initSubcategoryDropdown(category);
        return 'dropdown.houseSubcategoryTitle';
    }
  }

  getCategoryDescription(category: string) {
    return `dropdown.${this.categories!.find(({ name }) => category === name)!.description}`;
  }

  selectProductCategory({ key, value }: DropdownInterface) {
    this.categoryDropdownValue = { key, value };
    this.subcategoryDropdownValue = {
      key: 'selectProductSubcategory',
      value: this.selectProductSubcategoryTitle
    };
  }

  selectProductSubcategory({ key, value }: DropdownInterface) {
    this.subcategoryDropdownValue = { key, value };
  }

  initSubcategoryDropdown(category: string) {
    this.subcategoriesDropdown = this.subcategoriesDropdowns.find(
      ({ categoryKey }) => categoryKey === category
    )!.subcategories;
  }

  async initSubcategoriesDropdowns() {
    this.subcategoriesDropdowns = await Promise.all(
      this.categories.map(async ({ name }) => {
        const subcategories: { [key: string]: string } =
          await this.translationService.translateObject(
            `${name}Subcategory`,
            ComponentsTranslation.DROPDOWN
          );

        const dropdownSubcategories = Object.entries(subcategories).map(
          (key) => {
            const subcategoryKey = key[0];
            const subcategoryValue = key[1];
            return { key: subcategoryKey, value: subcategoryValue };
          }
        );

        return {
          categoryKey: name,
          subcategories: dropdownSubcategories
        };
      })
    );
    this.selectProductSubcategoryTitle =
      await this.translationService.translateText(
        'selectProductSubcategory',
        ComponentsTranslation.DROPDOWN
      );
    this.subcategoryDropdownValue = {
      key: 'selectProductSubcategory',
      value: this.selectProductSubcategoryTitle
    };
  }

  async initCategoriesDropdown() {
    this.categoriesDropdown = await Promise.all(
      this.categories.map(async ({ name }) => {
        return {
          key: name,
          value: await this.translationService.translateText(
            name,
            ComponentsTranslation.DROPDOWN
          )
        };
      })
    );
    this.categoryDropdownValue = {
      key: 'selectProductCategory',
      value: await this.translationService.translateText(
        'selectProductCategory',
        ComponentsTranslation.DROPDOWN
      )
    };
  }

  ngOnInit() {
    this.translationService.setPageTitle(Titles.CREATE_PRODUCT);

    this.categoriesService.getAllCategories().subscribe({
      next: async ({ categories }) => {
        this.categories = categories;
        this.categoriesNames = categories.map(({ name }) => name);
        await this.initCategoriesDropdown();
        await this.initSubcategoriesDropdowns();
      }
    });
  }
}
