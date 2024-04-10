import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { ProductsService } from '@services/products.service';
import { Router } from '@angular/router';
import { Scopes } from '@interfaces/role-scopes.enum';
import { UtilsService } from '@services/utils.service';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { GetAllCategoriesResponse } from '@responses/get-all-categories.interface';
import { SubcategoriesListType } from '@interfaces/subcategories-list.type';
import { SearchedProducts } from '@responses/search-products.interface';
import { ComponentsTranslation } from '@translations/components.enum';
import { EnvService } from '@shared/env.service';
import { CategoriesService } from '@services/categories.service';
import { GetMarketplaceCompanyStatsResponse } from '@responses/get-marketplace-company-stats.interface';
import {
  CompanyInternalStats,
  GetCompanyInternalStatsResponse
} from '@responses/get-company-internal-stats.interface';

@Component({
  selector: 'page-company-products-settings',
  templateUrl: './company-products-settings.component.html',
  styleUrls: ['./company-products-settings.component.scss']
})
export class CompanyProductsSettingsComponent implements OnInit {
  companyId: string;
  userInfo: UserInfoResponse;
  currentSection: 'products' | 'stats' = 'products';

  productPage: string = '0';
  productPageSize: string = '10';
  productOrder: string = 'created_at';
  productOrderBy: string = 'DESC';
  productSearchQuery: string;
  minPrice: string;
  maxPrice: string;
  minPriceError: boolean;
  maxPriceError: boolean;
  wrongPriceError: boolean;
  internalStatsQuery: string;

  layoutView: 'list' | 'grid' = 'list';
  companyStats: GetMarketplaceCompanyStatsResponse;
  categories: Array<GetAllCategoriesResponse>;
  categoriesList: Array<DropdownInterface>;
  selectedCategories: Array<DropdownInterface> = [];
  subcategoriesList: SubcategoriesListType;
  selectedSubcategories: Array<DropdownInterface> = [];
  orderOptions: Array<DropdownInterface> = [];
  orderOptionsValue: DropdownInterface;
  productCurrencyDropdown: Array<DropdownInterface>;
  productCurrencyDropdownValue: DropdownInterface;
  companyProducts: Array<SearchedProducts>;
  productsTotalItems: number;
  companyInternalStats: CompanyInternalStats;

  listIcon = `${this.envService.getStaticStorageLink}/icons/list-icon.svg`;
  gridIcon = `${this.envService.getStaticStorageLink}/icons/grid-icon.svg`;

  constructor(
    private readonly router: Router,
    private readonly envService: EnvService,
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly translationService: TranslationService,
    private readonly refreshTokensService: RefreshTokensService,
    public utilsService: UtilsService
  ) {}

  getCompanyProductsStatistics() {
    this.productsService
      .getCompanyProductsStatistics({
        companyId: this.companyId
      })
      .subscribe({
        next: (companyStats) => (this.companyStats = companyStats)
      });
  }

  getCompanyInternalStatistics() {
    this.productsService
      .getCompanyInternalStatistics({
        query: this.internalStatsQuery
      })
      .subscribe({
        next: ({ companyInternalStats }) => {
          this.companyInternalStats = companyInternalStats;
        }
      });
  }

  getCompanyProducts() {
    if (this.minPriceError || this.maxPriceError || this.wrongPriceError)
      return;

    const selectedCategories = this.utilsService.joinSelectedCategories(
      this.selectedCategories
    );
    const selectedSubcategories = this.utilsService.joinSelectedSubcategories(
      this.selectedSubcategories
    );

    const searchProductsPayload = {
      page: this.productPage,
      pageSize: this.productPageSize,
      order: this.productOrder,
      orderBy: this.productOrderBy,
      query: this.productSearchQuery,
      categories: selectedCategories,
      currency: this.productCurrencyDropdownValue.key,
      maxPrice: this.maxPrice,
      minPrice: this.minPrice,
      subcategories: selectedSubcategories,
      companyProducts: true,
      companyExtended: true,
      marketplaceCompanyId: this.companyId
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

          for (const orderOption of orderOptions)
            await this.initOrderOptions(orderOption);

          this.companyProducts = products;
          this.productsTotalItems = count;
        }
      });
  }

  setPage(page: string) {
    this.productPage = page;
    this.getCompanyProducts();
  }

  setPageSize(pageSize: string) {
    this.productPageSize = pageSize;
    this.getCompanyProducts();
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

  clearFilters() {
    this.initCurrencies().then(async () => {
      this.productPage = '0';
      this.productPageSize = '10';
      this.productOrder = 'created_at';
      this.productOrderBy = 'DESC';
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
      this.getCompanyProducts();
    });
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

    this.getCompanyProducts();
  }

  addSubcategory(subcategory: DropdownInterface) {
    this.selectedSubcategories = this.utilsService.addSubcategory(
      this.selectedSubcategories,
      subcategory
    );
    this.getCompanyProducts();
  }

  checkProductPrice(price: string, priceType: 'min' | 'max') {
    const productPrice = this.utilsService.checkProductPrice(
      price,
      priceType,
      this.minPrice,
      this.maxPrice,
      this.minPriceError,
      this.maxPriceError,
      this.wrongPriceError
    );

    this.minPrice = productPrice.minPrice;
    this.maxPrice = productPrice.maxPrice;
    this.minPriceError = productPrice.minPriceError;
    this.maxPriceError = productPrice.maxPriceError;
    this.wrongPriceError = productPrice.wrongPriceError;

    this.getCompanyProducts();
  }

  selectProductCurrency({ key, value }: DropdownInterface) {
    this.productCurrencyDropdownValue = { key, value };
    this.getCompanyProducts();
  }

  changeProductSearchQuery(query: string) {
    this.productSearchQuery = query;
    this.getCompanyProducts();
  }

  setLayout(layoutView: 'list' | 'grid') {
    this.layoutView = layoutView;
    localStorage.setItem('_lv', layoutView);
  }

  changeOrderBy(orderBy: string) {
    if (this.productOrderBy !== orderBy) {
      this.productOrderBy = orderBy;
      this.getCompanyProducts();
    }
  }

  selectOrderOption({ key, value }: DropdownInterface) {
    this.orderOptionsValue = { key, value };
    this.productOrder = key;
    this.getCompanyProducts();
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

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.COMPANY_PRODUCTS_SETTINGS);

    const userInfoRequest = await this.refreshTokensService.refreshTokens();

    if (userInfoRequest) {
      userInfoRequest.subscribe({
        next: async (userInfo) => {
          if (!userInfo.isCompanyMember)
            return await this.handleRedirect('marketplace');

          this.companyId = userInfo.companyId!;
          this.userInfo = userInfo;

          if (!userInfo.roleScopes?.includes(Scopes.PRODUCT_MANAGEMENT))
            await this.handleRedirect('marketplace');

          this.categoriesService.getAllCategories().subscribe({
            next: async ({ categories }) => {
              this.categories = categories;

              const layoutView = localStorage.getItem('_lv') as 'list' | 'grid';
              this.setLayout(layoutView || 'list');

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
              this.getCompanyProducts();
              this.getCompanyProductsStatistics();
              this.getCompanyInternalStatistics();
            }
          });
        }
      });
    }
  }
}
