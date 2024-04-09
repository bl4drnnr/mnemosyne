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
import { SubcategoriesListType } from '@interfaces/subcategories-list.type';
import { UtilsService } from '@services/utils.service';

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
  subcategoriesList: SubcategoriesListType;
  selectedSubcategories: Array<DropdownInterface> = [];

  productCurrencyDropdown: Array<DropdownInterface>;
  productCurrencyDropdownValue: DropdownInterface;
  totalItems: number;

  privateProductsFlag: boolean = false;
  companyProductsFlag: boolean = false;

  constructor(
    private readonly translationService: TranslationService,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
    private readonly utilsService: UtilsService,
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
    this.categoriesList = await this.utilsService.initCategories(
      this.categories
    );
  }

  async initSubcategories() {
    this.subcategoriesList = await this.utilsService.initSubcategories(
      this.categories
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

  changeProductType(productType: 'private' | 'company') {
    if (productType === 'private')
      this.privateProductsFlag = !this.privateProductsFlag;
    else if (productType === 'company')
      this.companyProductsFlag = !this.companyProductsFlag;
    this.getProducts();
  }

  addCategory(category: DropdownInterface) {
    const { selectedSubcategories, selectedCategories } =
      this.utilsService.addCategory(
        this.selectedSubcategories,
        this.subcategoriesList,
        this.selectedCategories,
        category
      );
    this.selectedSubcategories = selectedSubcategories;
    this.selectedCategories = selectedCategories;

    this.getProducts();
  }

  addSubcategory(subcategory: DropdownInterface) {
    this.selectedSubcategories = this.utilsService.addSubcategory(
      this.selectedSubcategories,
      subcategory
    );
    this.getProducts();
  }

  checkProductPrice(price: string, priceType: 'min' | 'max') {
    const {
      minPrice,
      maxPrice,
      minPriceError,
      maxPriceError,
      wrongPriceError
    } = this.utilsService.checkProductPrice(
      price,
      priceType,
      this.minPrice,
      this.maxPrice,
      this.minPriceError,
      this.maxPriceError,
      this.wrongPriceError
    );

    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.minPriceError = minPriceError;
    this.maxPriceError = maxPriceError;
    this.wrongPriceError = wrongPriceError;

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

  async initOrderOptions(orderOption: string) {
    this.orderOptions.push({
      key: orderOption,
      value: await this.translationService.translateText(
        `productOrderOptions.${orderOption}`,
        ComponentsTranslation.DROPDOWN
      )
    });
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

  getProducts() {
    if (this.minPriceError || this.maxPriceError || this.wrongPriceError)
      return;

    const selectedCategories = this.utilsService.joinSelectedCategories(
      this.selectedCategories
    );
    const selectedSubcategories = this.utilsService.joinSelectedSubcategories(
      this.selectedSubcategories
    );

    const searchProductsPayload = {
      page: this.page,
      pageSize: this.pageSize,
      order: this.order,
      orderBy: this.orderBy,
      query: this.productSearchQuery,
      categories: selectedCategories,
      currency: this.productCurrencyDropdownValue.key,
      maxPrice: this.maxPrice,
      minPrice: this.minPrice,
      subcategories: selectedSubcategories,
      privateProducts: this.privateProductsFlag,
      companyProducts: this.companyProductsFlag
    };

    this.productsService
      .searchProducts({
        ...searchProductsPayload
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
            await this.initOrderOptions(orderOption);
          }

          this.products = products;
          this.totalItems = count;
        }
      });
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
