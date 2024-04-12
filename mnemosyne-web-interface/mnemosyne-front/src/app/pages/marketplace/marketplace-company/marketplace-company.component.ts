import * as dayjs from 'dayjs';
import * as LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Component, OnInit } from '@angular/core';
import { TranslationService } from '@services/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@services/products.service';
import { CategoriesService } from '@services/categories.service';
import { CompanyService } from '@services/company.service';
import { Titles } from '@interfaces/titles.enum';
import { CompanyMember } from '@responses/get-company-public-info.interface';
import { GetMarketplaceCompanyStatsResponse } from '@responses/get-marketplace-company-stats.interface';
import { GetAllCategoriesResponse } from '@responses/get-all-categories.interface';
import { ComponentsTranslation } from '@translations/components.enum';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { SubcategoriesListType } from '@interfaces/subcategories-list.type';
import { UtilsService } from '@services/utils.service';
import { SearchedProducts } from '@responses/search-products.interface';
import { EnvService } from '@shared/env.service';

dayjs.extend(LocalizedFormat);

@Component({
  selector: 'page-marketplace-company',
  templateUrl: './marketplace-company.component.html',
  styleUrls: ['./marketplace-company.component.scss']
})
export class MarketplaceCompanyComponent implements OnInit {
  companyId: string;
  usersPage: string = '0';
  usersPageSize: string = '10';
  usersQuery: string;
  isUserLoggedIn: boolean;

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

  usersTotalItems: number;
  quantityOfUsers: number;
  companyOwnerId: string;
  companyOwnerFirstName: string;
  companyOwnerLastName: string;
  companyName: string;
  companyLocation: string;
  companyWebsite: string;
  companyMembers: Array<CompanyMember>;
  companyStats: GetMarketplaceCompanyStatsResponse;
  currentSection: 'products' | 'users' | 'stats' = 'products';

  layoutView: 'list' | 'grid' = 'list';
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

  listIcon = `${this.envService.getStaticStorageLink}/icons/list-icon.svg`;
  gridIcon = `${this.envService.getStaticStorageLink}/icons/grid-icon.svg`;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly envService: EnvService,
    private readonly translationService: TranslationService,
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly companyService: CompanyService,
    public utilsService: UtilsService
  ) {}

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

  getCompany() {
    this.companyService
      .getCompanyPublicInformation({
        companyId: this.companyId,
        page: this.usersPage,
        pageSize: this.usersPageSize,
        query: this.usersQuery
      })
      .subscribe({
        next: ({
          count,
          quantityOfUsers,
          companyOwnerId,
          companyOwnerFirstName,
          companyOwnerLastName,
          companyName,
          companyLocation,
          companyWebsite,
          companyMembers
        }) => {
          this.translationService.setPageTitle(Titles.COMPANY, { companyName });

          this.usersTotalItems = count;
          this.quantityOfUsers = quantityOfUsers;
          this.companyOwnerFirstName = companyOwnerFirstName;
          this.companyOwnerLastName = companyOwnerLastName;
          this.companyOwnerId = companyOwnerId;
          this.companyName = companyName;
          this.companyLocation = companyLocation;
          this.companyWebsite = companyWebsite;
          this.companyMembers = companyMembers;
        },
        error: async () => await this.handleRedirect('marketplace')
      });
  }

  getCompanyProductsStatistics() {
    this.productsService
      .getCompanyProductsStatistics({
        companyId: this.companyId
      })
      .subscribe({
        next: (companyStats) => (this.companyStats = companyStats)
      });
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

  changeCompanyQuery(query: string) {
    this.usersQuery = query;
    this.getCompany();
  }

  changeCompanyUsersPerPage(usersPerPage: string) {
    this.usersPageSize = usersPerPage;
    this.getCompany();
  }

  changeCompanyUsersPage(page: string) {
    this.usersPage = page;
    this.getCompany();
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  handleExternalRedirect(path: string) {
    document.location.href = path;
  }

  handleExternalRedirectLink(path: string) {
    if (path.includes('http')) document.location.href = path;
    else document.location.href = `https://${path}`;
  }

  ngOnInit() {
    const accessToken = localStorage.getItem('_at');
    this.isUserLoggedIn = !!accessToken;

    this.route.paramMap.subscribe(async (params) => {
      const companyId = params.get('companyId');

      if (!companyId) {
        await this.handleRedirect('marketplace');
      } else {
        this.companyId = companyId;

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
            this.getCompany();
            this.getCompanyProductsStatistics();
          }
        });
      }
    });
  }
}
