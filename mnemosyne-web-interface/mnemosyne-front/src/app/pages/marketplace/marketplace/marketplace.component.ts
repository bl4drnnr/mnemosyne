import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslationService } from '@services/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Titles } from '@interfaces/titles.enum';
import { GetAllCategoriesResponse } from '@responses/get-all-categories.interface';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { ComponentsTranslation } from '@translations/components.enum';
import { EnvService } from '@shared/env.service';
import { MarketplaceProductListComponent } from '@components/marketplace-product-list/marketplace-product-list.component';
import { UtilsService } from '@services/utils.service';
import { CategoriesService } from '@services/categories.service';
import { ProductsService } from '@services/products.service';
import { SearchedProducts } from '@responses/search-products.interface';
import { SubcategoriesListType } from '@interfaces/subcategories-list.type';

@Component({
  selector: 'page-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})
export class MarketplaceComponent implements OnInit {
  page: string = '0';
  pageSize: string = '10';
  order: string = 'created_at';
  orderBy: string = 'DESC';
  productSearchQuery: string;
  minPrice: string;
  maxPrice: string;
  minPriceError: boolean;
  maxPriceError: boolean;
  wrongPriceError: boolean;

  layoutView: 'list' | 'grid' = 'list';
  products: Array<SearchedProducts>;
  totalItems: number;

  orderOptions: Array<DropdownInterface> = [];
  orderOptionsValue: DropdownInterface;

  categories: Array<GetAllCategoriesResponse>;

  categoriesList: Array<DropdownInterface>;
  selectedCategories: Array<DropdownInterface> = [];
  subcategoriesList: SubcategoriesListType;
  selectedSubcategories: Array<DropdownInterface> = [];

  productCurrencyDropdown: Array<DropdownInterface>;
  productCurrencyDropdownValue: DropdownInterface;

  listIcon = `${this.envService.getStaticStorageLink}/icons/list-icon.svg`;
  gridIcon = `${this.envService.getStaticStorageLink}/icons/grid-icon.svg`;

  @ViewChild('pageMarketplaceProductList')
  public marketplaceProducts: MarketplaceProductListComponent;

  constructor(
    public utilsService: UtilsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly envService: EnvService,
    private readonly translationService: TranslationService,
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService
  ) {}

  setLayout(layoutView: 'list' | 'grid') {
    this.layoutView = layoutView;
    localStorage.setItem('_lv', layoutView);
  }

  changeOrderBy(orderBy: string) {
    if (this.orderBy !== orderBy) {
      this.orderBy = orderBy;
      this.getProducts();
    }
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

  selectOrderOption({ key, value }: DropdownInterface) {
    this.orderOptionsValue = { key, value };
    this.order = key;
    this.getProducts();
  }

  changeProductSearchQuery(query: string) {
    this.productSearchQuery = query;
    this.getProducts();
  }

  setPage(page: string) {
    this.page = page;
    this.getProducts();
  }

  setPageSize(pageSize: string) {
    this.pageSize = pageSize;
    this.getProducts();
  }

  clearFilters() {
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
      this.selectedCategories = [];
      this.selectedSubcategories = [];
      this.getProducts();
    });
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
      subcategories: selectedSubcategories
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

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.MARKETPLACE);

    this.categoriesService.getAllCategories().subscribe({
      next: async ({ categories }) => {
        this.categories = categories;

        const layoutView = localStorage.getItem('_lv') as 'list' | 'grid';
        this.setLayout(layoutView || 'list');

        const category = this.route.snapshot.queryParamMap.get('category');
        const subcategory =
          this.route.snapshot.queryParamMap.get('subcategory');

        this.orderOptionsValue = {
          key: 'selectProductOrder',
          value: await this.translationService.translateText(
            'selectProductOrder',
            ComponentsTranslation.DROPDOWN
          )
        };

        await this.initCurrencies();
        await this.initCategories();
        await this.initSubcategories();

        if (category) {
          this.selectedCategories.push({
            key: category,
            value: ''
          });
        }

        if (category && subcategory) {
          this.selectedCategories.push({
            key: category,
            value: ''
          });

          this.selectedSubcategories.push({
            key: subcategory,
            value: ''
          });
        }

        this.getProducts();
      }
    });
  }
}
