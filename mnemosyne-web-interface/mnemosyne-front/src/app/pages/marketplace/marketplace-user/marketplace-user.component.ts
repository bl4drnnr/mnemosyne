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
  userId: string;
  userNotFound: boolean;
  isUserLoggedIn: boolean;
  userProfilePictureLink: string;

  constructor(
    private readonly router: Router,
    private readonly envService: EnvService,
    private readonly route: ActivatedRoute,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly translationService: TranslationService
  ) {}

  staticStorageLink = this.envService.getStaticStorageLink;

  getMarketplaceUserStatistics() {
    this.productsService
      .getMarketplaceUserStatistics({
        marketplaceUserId: this.userId
      })
      .subscribe({
        next: () => {
          //
        }
      });
  }

  getMarketplaceUserProducts() {
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
        subcategories: selectedSubcategories,
        marketplaceUserId: this.userId
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
            userIdHash
          } = marketplaceUser;

          this.email = email;
          this.firstName = firstName;
          this.lastName = lastName;
          this.homeAddress = homeAddress;
          this.homePhone = homePhone;
          this.namePronunciation = namePronunciation;
          this.createdAt = createdAt;
          this.userIdHash = userIdHash;

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
      }
    });
  }
}
