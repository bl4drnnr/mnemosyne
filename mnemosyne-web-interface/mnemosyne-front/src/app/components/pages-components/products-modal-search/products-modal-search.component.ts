import * as dayjs from 'dayjs';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { EnvService } from '@shared/env.service';
import { ProductsService } from '@services/products.service';
import { ComponentsTranslation } from '@translations/components.enum';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { GetAllCategoriesResponse } from '@responses/get-all-categories.interface';
import { SearchedProducts } from '@responses/search-products.interface';
import { TranslationService } from '@services/translation.service';
import { CategoriesService } from '@services/categories.service';
import { Router } from '@angular/router';

@Component({
  selector: 'page-products-modal-search',
  templateUrl: './products-modal-search.component.html',
  styleUrls: ['./products-modal-search.component.scss']
})
export class ProductsModalSearchComponent implements OnChanges, OnInit {
  @Input() showModal: boolean;

  @Output() closeModal = new EventEmitter<void>();

  showFilters = false;
  page: string = '0';
  pageSize: string = '10';
  order: string = 'created_at';
  orderBy: string = 'DESC';
  productSearchQuery: string;
  minPrice: string;
  minPriceError: boolean;
  maxPrice: string;
  maxPriceError: boolean;
  wrongPriceError: boolean;
  orderOptions: Array<DropdownInterface> = [];
  orderOptionsValue: DropdownInterface;
  categories: Array<GetAllCategoriesResponse>;
  products: Array<SearchedProducts> = [];
  categoriesList: Array<DropdownInterface>;
  selectedCategories: Array<DropdownInterface> = [];
  subcategoriesList: Array<{
    categoryKey: string;
    subcategories: Array<DropdownInterface>;
  }>;
  selectedSubcategories: Array<DropdownInterface> = [];
  productCurrencyDropdown: Array<DropdownInterface>;
  productCurrencyDropdownValue: DropdownInterface;
  totalItems: number;

  constructor(
    private readonly translationService: TranslationService,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
    private readonly envService: EnvService,
    private readonly router: Router
  ) {}

  backArrowModal = `${this.envService.getStaticStorageLink}/icons/backarrowmodal.svg`;

  showSearchFilters() {
    this.showFilters = !this.showFilters;
  }

  closeModalSearchProducts() {
    this.closeModal.emit();
    this.clearFilters(false);
  }

  getProducts() {
    if (this.minPriceError || this.maxPriceError || this.wrongPriceError)
      return;

    const selectedCategories = this.selectedCategories
      .map(({ key }) => key)
      .join(',');
    const selectedSubcategories = this.selectedSubcategories
      .map(({ key }) => key)
      .join(',');

    this.productsService
      .searchProducts({
        page: this.page,
        pageSize: this.pageSize,
        order: this.order,
        orderBy: this.orderBy,
        query: this.productSearchQuery,
        categories: selectedCategories,
        currency: this.productCurrencyDropdownValue.key,
        maxPrice: this.maxPrice,
        minPrice: this.minPrice,
        subcategories: selectedSubcategories
      })
      .subscribe({
        next: async ({ products, count }) => {
          this.orderOptions = [];
          const orderOptions = [
            'title',
            'slug',
            'currency',
            'price',
            'subcategory',
            'created_at'
          ];

          for (const orderOption of orderOptions) {
            this.orderOptions.push({
              key: orderOption,
              value: await this.translationService.translateText(
                `productOrderOptions.${orderOption}`,
                ComponentsTranslation.DROPDOWN
              )
            });
          }

          this.products = products;
          this.totalItems = count;
        }
      });
  }

  async initCurrencies() {
    const allCurrencies = await this.translationService.translateText(
      'allCurrencies',
      ComponentsTranslation.DROPDOWN
    );
    this.productCurrencyDropdown = [
      { key: 'PLN', value: 'PLN' },
      { key: 'EUR', value: 'EUR' },
      { key: 'USD', value: 'USD' },
      { key: 'all', value: allCurrencies }
    ];
    this.productCurrencyDropdownValue = { key: 'all', value: allCurrencies };
  }

  async initCategories() {
    this.categoriesList = await Promise.all(
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
  }

  async initSubcategories() {
    this.subcategoriesList = await Promise.all(
      this.categories.map(async ({ name }) => {
        const subcategories: { [key: string]: string } =
          await this.translationService.translateObject(
            `${name}Subcategory`,
            ComponentsTranslation.DROPDOWN
          );

        const subcategoriesList = Object.entries(subcategories).map((key) => {
          const subcategoryKey = key[0];
          const subcategoryValue = key[1];
          return { key: subcategoryKey, value: subcategoryValue };
        });

        return {
          categoryKey: name,
          subcategories: subcategoriesList
        };
      })
    );
  }

  getSubcategories(key: string) {
    return this.subcategoriesList.find(
      ({ categoryKey }) => categoryKey === key
    )!.subcategories;
  }

  changeProductSearchQuery(query: string) {
    this.productSearchQuery = query;
    this.getProducts();
  }

  addCategory(category: DropdownInterface) {
    const index = this.selectedCategories.findIndex(
      (item) => item.key === category.key
    );

    if (index === -1) {
      this.selectedCategories.push({
        key: category.key,
        value: category.value
      });
    } else {
      this.selectedCategories.splice(index, 1);
      const categorySubcategories = this.getSubcategories(category.key);
      this.selectedSubcategories = this.selectedCategories.filter(
        (sub) => !categorySubcategories.find((sub2) => sub.key === sub2.key)
      );
    }

    this.getProducts();
  }

  addSubcategory(subcategory: DropdownInterface) {
    const index = this.selectedSubcategories.findIndex(
      (item) => item.key === subcategory.key
    );

    if (index === -1) {
      this.selectedSubcategories.push({
        key: subcategory.key,
        value: subcategory.value
      });
    } else {
      this.selectedSubcategories.splice(index, 1);
    }

    this.getProducts();
  }

  checkProductPrice(price: string, priceType: 'min' | 'max') {
    const priceNumber = Number(price);

    if (priceType === 'min' && priceNumber < 0) {
      this.minPrice = '';
      this.minPriceError = true;
      return;
    } else if (priceType === 'max' && priceNumber < 0) {
      this.maxPrice = '';
      this.maxPriceError = true;
      return;
    } else if (priceType === 'min' && priceNumber >= 0) {
      this.minPrice = price;
      this.minPriceError = false;
    } else if (priceType === 'max' && priceNumber >= 0) {
      this.maxPrice = price;
      this.maxPriceError = false;
    }

    if (
      this.minPrice &&
      this.maxPrice &&
      Number(this.minPrice) > Number(this.maxPrice)
    ) {
      this.wrongPriceError = true;
      return;
    }

    this.getProducts();
  }

  selectProductCurrency({ key, value }: DropdownInterface) {
    this.productCurrencyDropdownValue = { key, value };
    this.getProducts();
  }

  clearFilters(getProducts = true) {
    this.initCurrencies().then(async () => {
      this.page = '0';
      this.pageSize = '10';
      this.order = 'created_at';
      this.orderBy = 'DESC';
      this.productSearchQuery = '';
      this.minPrice = '';
      this.minPriceError = false;
      this.maxPrice = '';
      this.maxPriceError = false;
      this.wrongPriceError = false;
      this.orderOptions = [];
      this.orderOptionsValue = {
        key: 'selectProductOrder',
        value: await this.translationService.translateText(
          'selectProductOrder',
          ComponentsTranslation.DROPDOWN
        )
      };
      this.products = [];
      this.selectedCategories = [];
      this.selectedSubcategories = [];
      if (getProducts) this.getProducts();
    });
  }

  transformDate(date: Date) {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
  }

  translateCategory(category: string) {
    return `dropdown.${category}`;
  }

  translateSubcategory(category: string, subcategory: string) {
    return `dropdown.${category}Subcategory.${subcategory}`;
  }

  changeOrderBy(orderBy: string) {
    if (this.orderBy !== orderBy) {
      this.orderBy = orderBy;
      this.getProducts();
    }
  }

  getOrderOptionDropdownLabel(orderOption: string) {
    switch (orderOption) {
      case 'title':
        return 'productOrderOptions.title';
      case 'slug':
        return 'productOrderOptions.slug';
      case 'location':
        return 'productOrderOptions.location';
      case 'currency':
        return 'productOrderOptions.currency';
      case 'price':
        return 'productOrderOptions.price';
      case 'subcategory':
        return 'productOrderOptions.subcategory';
      case 'contact_person':
        return 'productOrderOptions.contact_person';
      case 'contact_phone':
        return 'productOrderOptions.contact_phone';
      case 'created_at':
        return 'productOrderOptions.created_at';
      default:
        return 'productOrderOptions.created_at';
    }
  }

  selectOrderOption({ key, value }: DropdownInterface) {
    this.orderOptionsValue = { key, value };
    this.order = key;
    this.getProducts();
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnChanges(changes: SimpleChanges) {
    document.body.style.overflow =
      changes['showModal'] && changes['showModal'].currentValue === true
        ? 'hidden'
        : 'auto';
  }

  ngOnInit() {
    this.categoriesService.getAllCategories().subscribe({
      next: async ({ categories }) => {
        this.orderOptionsValue = {
          key: 'selectProductOrder',
          value: await this.translationService.translateText(
            'selectProductOrder',
            ComponentsTranslation.DROPDOWN
          )
        };

        this.categories = categories;

        await this.initCurrencies();
        await this.initCategories();
        await this.initSubcategories();
      }
    });
  }
}
