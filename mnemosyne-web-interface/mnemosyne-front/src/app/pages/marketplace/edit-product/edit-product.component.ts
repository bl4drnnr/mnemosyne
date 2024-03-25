import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '@services/translation.service';
import { ProductsService } from '@services/products.service';
import { Titles } from '@interfaces/titles.enum';
import { GetProductBySlug } from '@responses/get-product-by-slug.interface';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { ValidationService } from '@services/validation.service';
import { GetAllCategoriesResponse } from '@responses/get-all-categories.interface';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { ComponentsTranslation } from '@translations/components.enum';
import { CategoriesService } from '@services/categories.service';

@Component({
  selector: 'page-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['../shared/create-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productSlug: string;
  productPrice: string;
  incorrectProductTitle: boolean;
  incorrectProductDescription: boolean;
  incorrectContactPerson: boolean;
  contactEmail: string;
  product: GetProductBySlug;

  categories: Array<GetAllCategoriesResponse>;
  categoriesDropdown: Array<DropdownInterface>;
  categoryDropdownValue: DropdownInterface = {
    key: '',
    value: ''
  };
  subcategoryDropdownValue: DropdownInterface = {
    key: '',
    value: ''
  };
  subcategoriesDropdowns: Array<{
    categoryKey: string;
    subcategories: Array<DropdownInterface>;
  }>;
  subcategoriesDropdown: Array<DropdownInterface>;
  selectProductSubcategoryTitle: string;
  productPriceDropdown: Array<DropdownInterface> = [
    { key: 'PLN', value: 'PLN' },
    { key: 'EUR', value: 'EUR' },
    { key: 'USD', value: 'USD' }
  ];
  productPriceDropdownValue: DropdownInterface;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translationService: TranslationService,
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly validationService: ValidationService
  ) {}

  editProduct() {
    //
  }

  getProductBySlugToEdit() {
    this.productsService
      .getProductBySlugToEdit({
        slug: this.productSlug
      })
      .subscribe({
        next: async ({ product }) => {
          this.product = product;
          this.productPrice = String(product.price);
          this.translationService.setPageTitle(Titles.EDIT_PRODUCT, {
            product: product.title
          });
          this.productPriceDropdownValue = {
            key: product.currency,
            value: product.currency
          };
          await this.initCategoriesDropdown();
          await this.initSubcategoriesDropdowns();
        },
        error: async () =>
          await this.handleRedirect('marketplace/product-not-found')
      });
  }

  disableEditProductButton() {
    return true;
  }

  checkProductPrice() {
    const productPriceNumber = Number(this.product.price);
    return productPriceNumber < 0;
  }

  isMobilePhoneCorrect() {
    return this.validationService.checkPhoneFormat(this.product.contactPhone);
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

  initSubcategoryDropdown(category: string) {
    this.subcategoriesDropdown = this.subcategoriesDropdowns.find(
      ({ categoryKey }) => categoryKey === category
    )!.subcategories;
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
      key: this.product.category,
      value: await this.translationService.translateText(
        this.product.category,
        ComponentsTranslation.DROPDOWN
      )
    };
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
        `${this.product.category}Subcategory.${this.product.subcategory}`,
        ComponentsTranslation.DROPDOWN
      );
    this.subcategoryDropdownValue = {
      key: this.product.subcategory,
      value: this.selectProductSubcategoryTitle
    };
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const productSlug = params.get('product-slug');

      if (!productSlug) {
        await this.handleRedirect('marketplace/product-not-found');
      } else {
        this.productSlug = productSlug;

        this.categoriesService.getAllCategories().subscribe({
          next: async ({ categories }) => {
            this.categories = categories;
            const userInfoRequest =
              await this.refreshTokensService.refreshTokens();

            if (userInfoRequest) {
              userInfoRequest.subscribe({
                next: (userInfo) => (this.contactEmail = userInfo.email)
              });
            }

            this.getProductBySlugToEdit();
          }
        });
      }
    });
  }
}
