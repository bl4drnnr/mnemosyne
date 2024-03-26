import { Component, OnInit } from '@angular/core';
import { UserInfoResponse } from '@responses/user-info.interface';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { TranslationService } from '@services/translation.service';
import { Titles } from '@interfaces/titles.enum';
import { ProductsService } from '@services/products.service';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { ComponentsTranslation } from '@translations/components.enum';
import { UserProduct } from '@responses/user-products.interface';
import { DeleteProductPayload } from '@payloads/delete-product.interface';
import { MessagesTranslation } from '@translations/messages.enum';
import { GlobalMessageService } from '@shared/global-message.service';

@Component({
  selector: 'component-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  query: string;
  page: string = '0';
  pageSize: string = '10';
  order: string = 'created_at';
  orderBy: string = 'DESC';
  orderOptions: Array<DropdownInterface> = [];
  orderOptionsValue: DropdownInterface;
  totalItems: number;
  userInfo: UserInfoResponse;
  userProducts: Array<UserProduct>;

  constructor(
    private readonly globalMessageService: GlobalMessageService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly translationService: TranslationService,
    private readonly productsService: ProductsService
  ) {}

  selectOrderOption({ key, value }: DropdownInterface) {
    this.orderOptionsValue = { key, value };
    this.order = key;
    this.getUserProducts();
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
      this.getUserProducts();
    }
  }

  changeQuery(query: string) {
    this.query = query;
    this.getUserProducts();
  }

  deleteProduct(payload: DeleteProductPayload) {
    this.productsService.deleteProduct(payload).subscribe({
      next: async ({ message }) => {
        const globalMessage = await this.translationService.translateText(
          message,
          MessagesTranslation.RESPONSES
        );
        this.globalMessageService.handle({
          message: globalMessage
        });
        this.getUserProducts();
      }
    });
  }

  getUserProducts() {
    this.productsService
      .getUserProducts({
        query: this.query,
        page: this.page,
        pageSize: this.pageSize,
        order: this.order,
        orderBy: this.orderBy
      })
      .subscribe({
        next: async ({ userProducts, count }) => {
          this.orderOptions = [];
          const orderOptions = [
            'title',
            'slug',
            'location',
            'currency',
            'price',
            'subcategory',
            'contact_person',
            'contact_phone',
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

          this.userProducts = userProducts;
          this.totalItems = count;
        }
      });
  }

  async ngOnInit() {
    this.translationService.setPageTitle(Titles.DASHBOARD);

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

    this.getUserProducts();
  }
}
