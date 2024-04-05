import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { ProductsService } from '@services/products.service';
import { FavoriteProduct } from '@responses/get-user-favorite-products.interface';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { ComponentsTranslation } from '@translations/components.enum';
import { EnvService } from '@shared/env.service';

@Component({
  selector: 'page-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  query: string;
  page: string = '0';
  pageSize: string = '10';
  order: string = 'created_at';
  orderBy: string = 'DESC';
  orderOptions: Array<DropdownInterface> = [];
  orderOptionsValue: DropdownInterface;
  layoutView: 'list' | 'grid' = 'list';
  userInfo: UserInfoResponse;
  favoriteProducts: Array<FavoriteProduct>;
  totalItems: number;
  listIcon = `${this.envService.getStaticStorageLink}/icons/list-icon.svg`;
  gridIcon = `${this.envService.getStaticStorageLink}/icons/grid-icon.svg`;

  constructor(
    private readonly refreshTokensService: RefreshTokensService,
    private readonly translationService: TranslationService,
    private readonly productsService: ProductsService,
    private readonly envService: EnvService
  ) {}

  getUserFavoritesProducts() {
    this.productsService
      .getUserFavoritesProducts({
        query: this.query,
        page: this.page,
        pageSize: this.pageSize,
        order: this.order,
        orderBy: this.orderBy
      })
      .subscribe({
        next: async ({ favoriteProducts, count }) => {
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

          this.favoriteProducts = favoriteProducts;
          this.totalItems = count;
        }
      });
  }

  selectOrderOption({ key, value }: DropdownInterface) {
    this.orderOptionsValue = { key, value };
    this.order = key;
    this.getUserFavoritesProducts();
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

  changeOrderBy(orderBy: string) {
    if (this.orderBy !== orderBy) {
      this.orderBy = orderBy;
      this.getUserFavoritesProducts();
    }
  }

  changeQuery(query: string) {
    this.query = query;
    this.getUserFavoritesProducts();
  }

  setLayout(layoutView: 'list' | 'grid') {
    this.layoutView = layoutView;
    localStorage.setItem('_lv', layoutView);
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.FAVORITES);

    const userInfoRequest = await this.refreshTokensService.refreshTokens();

    if (userInfoRequest) {
      userInfoRequest.subscribe({
        next: (userInfo) => (this.userInfo = userInfo)
      });
    }

    this.orderOptionsValue = {
      key: 'selectProductOrder',
      value: await this.translationService.translateText(
        'selectProductOrder',
        ComponentsTranslation.DROPDOWN
      )
    };

    const layoutView = localStorage.getItem('_lv') as 'list' | 'grid';
    this.setLayout(layoutView || 'list');

    this.getUserFavoritesProducts();
  }
}
