import * as dayjs from 'dayjs';
import * as LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '@services/users.service';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { EnvService } from '@shared/env.service';
import { ProductsService } from '@services/products.service';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { ComponentsTranslation } from '@translations/components.enum';
import { SearchedProducts } from '@responses/search-products.interface';
import { SubcategoriesListType } from '@interfaces/subcategories-list.type';
import { UtilsService } from '@services/utils.service';
import { CategoriesService } from '@services/categories.service';
import { GetAllCategoriesResponse } from '@responses/get-all-categories.interface';
import { GetMarketplaceUserStatsResponse } from '@responses/get-marketplace-user-stats.interface';

dayjs.extend(LocalizedFormat);

@Component({
  selector: 'page-marketplace-user',
  templateUrl: './marketplace-user.component.html',
  styleUrls: ['./marketplace-user.component.scss']
})
export class MarketplaceUserComponent implements OnInit {
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
  categoriesList: Array<DropdownInterface>;
  products: Array<SearchedProducts>;
  categories: Array<GetAllCategoriesResponse>;

  selectedCategories: Array<DropdownInterface> = [];
  subcategoriesList: SubcategoriesListType;
  selectedSubcategories: Array<DropdownInterface> = [];
  productCurrencyDropdown: Array<DropdownInterface>;

  productCurrencyDropdownValue: DropdownInterface;
  totalItems: number;
  layoutView: 'list' | 'grid' = 'list';
  listIcon = `${this.envService.getStaticStorageLink}/icons/list-icon.svg`;
  gridIcon = `${this.envService.getStaticStorageLink}/icons/grid-icon.svg`;

  email: string | undefined;
  firstName: string;
  lastName: string;
  homeAddress: string | null;
  homePhone: string | null;
  namePronunciation: string | null;
  createdAt: Date;
  userIdHash: string | null;
  companyId: string | null;
  companyName: string | null;

  userId: string;
  userNotFound: boolean;
  isUserLoggedIn: boolean;
  userProfilePictureLink: string;

  privateProductsFlag: boolean = false;
  companyProductsFlag: boolean = false;

  userStats: GetMarketplaceUserStatsResponse;

  constructor(
    public utilsService: UtilsService,
    private readonly router: Router,
    private readonly envService: EnvService,
    private readonly route: ActivatedRoute,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly translationService: TranslationService
  ) {}

  staticStorageLink = this.envService.getStaticStorageLink;

  setLayout(layoutView: 'list' | 'grid') {
    this.layoutView = layoutView;
    localStorage.setItem('_lv', layoutView);
  }

  changeOrderBy(orderBy: string) {
    if (this.orderBy !== orderBy) {
      this.orderBy = orderBy;
      this.getMarketplaceUserProducts();
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

    this.getMarketplaceUserProducts();
  }

  addSubcategory(subcategory: DropdownInterface) {
    this.selectedSubcategories = this.utilsService.addSubcategory(
      this.selectedSubcategories,
      subcategory
    );
    this.getMarketplaceUserProducts();
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

    this.getMarketplaceUserProducts();
  }

  selectProductCurrency({ key, value }: DropdownInterface) {
    this.productCurrencyDropdownValue = { key, value };
    this.getMarketplaceUserProducts();
  }

  selectOrderOption({ key, value }: DropdownInterface) {
    this.orderOptionsValue = { key, value };
    this.order = key;
    this.getMarketplaceUserProducts();
  }

  changeProductSearchQuery(query: string) {
    this.productSearchQuery = query;
    this.getMarketplaceUserProducts();
  }

  setPage(page: string) {
    this.page = page;
    this.getMarketplaceUserProducts();
  }

  setPageSize(pageSize: string) {
    this.pageSize = pageSize;
    this.getMarketplaceUserProducts();
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
      this.getMarketplaceUserProducts();
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

  changeProductType(productType: 'private' | 'company') {
    if (productType === 'private')
      this.privateProductsFlag = !this.privateProductsFlag;
    else if (productType === 'company')
      this.companyProductsFlag = !this.companyProductsFlag;
    this.getMarketplaceUserProducts();
  }

  getMarketplaceUserStatistics() {
    this.productsService
      .getMarketplaceUserStatistics({
        marketplaceUserId: this.userId
      })
      .subscribe({
        next: (userStats) => (this.userStats = userStats)
      });
  }

  getMarketplaceUserProducts() {
    if (this.minPriceError || this.maxPriceError || this.wrongPriceError)
      return;

    const selectedCategories = this.utilsService.joinSelectedCategories(
      this.selectedCategories
    );
    const selectedSubcategories = this.utilsService.joinSelectedSubcategories(
      this.selectedSubcategories
    );

    const marketplaceUserProducts = {
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
      marketplaceUserId: this.userId,
      privateProducts: this.privateProductsFlag,
      companyProducts: this.companyProductsFlag
    };

    this.productsService
      .searchProducts({
        ...marketplaceUserProducts
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

  getMarketplaceUserById() {
    this.usersService
      .getMarketplaceUserById({
        marketplaceUserId: this.userId
      })
      .subscribe({
        next: ({ marketplaceUser }) => {
          const {
            email,
            firstName,
            lastName,
            homeAddress,
            homePhone,
            namePronunciation,
            createdAt,
            userIdHash,
            companyId,
            companyName
          } = marketplaceUser;

          this.email = email;
          this.firstName = firstName;
          this.lastName = lastName;
          this.homeAddress = homeAddress;
          this.homePhone = homePhone;
          this.namePronunciation = namePronunciation;
          this.createdAt = createdAt;
          this.userIdHash = userIdHash;
          this.companyId = companyId;
          this.companyName = companyName;

          this.translationService.setPageTitle(Titles.MARKETPLACE_USER, {
            firstName,
            lastName
          });

          this.userProfilePictureLink = userIdHash
            ? `${this.staticStorageLink}/users-profile-pictures/${userIdHash}.png`
            : `${this.staticStorageLink}/users-profile-pictures/default.png`;

          this.getMarketplaceUserProducts();
        },
        error: () => (this.userNotFound = true)
      });
  }

  transformDate(date: Date) {
    return dayjs(date).format('LL');
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    const accessToken = localStorage.getItem('_at');
    this.isUserLoggedIn = !!accessToken;

    this.route.paramMap.subscribe(async (params) => {
      const userId = params.get('userId');

      if (!userId) {
        await this.handleRedirect('marketplace');
      } else {
        this.userId = userId;
        this.getMarketplaceUserById();
        this.getMarketplaceUserStatistics();

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

            this.getMarketplaceUserProducts();
          }
        });
      }
    });
  }
}
