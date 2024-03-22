import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '@services/categories.service';
import { TranslationService } from '@services/translation.service';
import { GetAllCategoriesResponse } from '@responses/get-all-categories.interface';
import { Titles } from '@interfaces/titles.enum';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { ComponentsTranslation } from '@translations/components.enum';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { ValidationService } from '@services/validation.service';
import { ProductsService } from '@services/products.service';
import { Currency } from '@interfaces/currency.type';
import { ProductCategory } from '@interfaces/product-category.type';
import { ProductSubcategory } from '@interfaces/product-subcategory.type';
import { GlobalMessageService } from '@shared/global-message.service';
import { MessagesTranslation } from '@translations/messages.enum';
import { Router } from '@angular/router';

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
  contactPerson: string;
  incorrectContactPerson: boolean;
  contactEmail: string;
  contactPhoneNumber: string;
  productPrice: string = '0';
  productPictures: Array<string>;
  productLocation: string;

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

  productPriceDropdown: Array<DropdownInterface> = [
    { key: 'PLN', value: 'PLN' },
    { key: 'EUR', value: 'EUR' },
    { key: 'USD', value: 'USD' }
  ];
  productPriceDropdownValue: DropdownInterface = { key: 'PLN', value: 'PLN' };

  selectedPicture?: FileList;
  preview: string | ArrayBuffer | null = '';
  userProfilePictureLink: string;

  constructor(
    private readonly router: Router,
    private readonly globalMessageService: GlobalMessageService,
    private readonly validationService: ValidationService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
    private readonly translationService: TranslationService
  ) {}

  postProduct() {
    this.productsService
      .postProduct({
        name: this.productTitle,
        description: this.productDescription,
        pictures: this.productPictures,
        currency: this.productPriceDropdownValue.key as Currency,
        price: Number(this.productPrice),
        location: this.productLocation,
        contactPhone: this.contactPhoneNumber,
        contactPerson: this.contactPerson,
        category: this.categoryDropdownValue.key as ProductCategory,
        subcategory: this.subcategoryDropdownValue.key as ProductSubcategory
      })
      .subscribe({
        next: async ({ message, link }) => {
          await this.handleRedirect(link);
          const globalMessage = await this.translationService.translateText(
            message,
            MessagesTranslation.RESPONSES
          );
          this.globalMessageService.handle({
            message: globalMessage
          });
        }
      });
  }

  disablePostProductButton() {
    return (
      this.incorrectProductTitle ||
      this.incorrectProductDescription ||
      this.incorrectContactPerson ||
      !this.productTitle ||
      !this.productDescription ||
      !this.contactPerson ||
      !this.contactPhoneNumber ||
      !this.isMobilePhoneCorrect() ||
      !this.categoryDropdownValue.key ||
      !this.subcategoryDropdownValue.key ||
      !this.productLocation
    );
  }

  isMobilePhoneCorrect() {
    return this.validationService.checkPhoneFormat(this.contactPhoneNumber);
  }

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

  selectProductCurrency({ key, value }: DropdownInterface) {
    this.productPriceDropdownValue = { key, value };
  }

  checkProductPrice() {
    const productPriceNumber = Number(this.productPrice);
    return productPriceNumber < 0;
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

  selectFile(event: any): void {
    this.selectedPicture = event.target.files;

    if (!this.selectedPicture) return;

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.preview = reader.result;
    };
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.translationService.setPageTitle(Titles.CREATE_PRODUCT);

    this.categoriesService.getAllCategories().subscribe({
      next: async ({ categories }) => {
        this.categories = categories;
        this.categoriesNames = categories.map(({ name }) => name);
        // const userInfoRequest = await this.refreshTokensService.refreshTokens();
        //
        // if (userInfoRequest) {
        //   userInfoRequest.subscribe({
        //     next: (userInfo) => (this.contactEmail = userInfo.email)
        //   });
        // }

        await this.initCategoriesDropdown();
        await this.initSubcategoriesDropdowns();
      }
    });
  }
}
