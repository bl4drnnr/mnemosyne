import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchedProducts } from '@responses/search-products.interface';
import { DeleteProductPayload } from '@payloads/delete-product.interface';

@Component({
  selector: 'page-marketplace-product-list',
  templateUrl: './marketplace-product-list.component.html',
  styleUrls: ['./marketplace-product-list.component.scss']
})
export class MarketplaceProductListComponent {
  @Input() page: string;
  @Input() pageSize: string;
  @Input() products: Array<SearchedProducts>;
  @Input() totalItems: number;
  @Input() layoutView: 'list' | 'grid' = 'list';
  @Input() showAdditionalInfo = false;
  @Input() showManagementButtons = false;
  @Input() productCompanyEdit = false;

  @Output() getProductsEvent = new EventEmitter<void>();
  @Output() setPage = new EventEmitter<string>();
  @Output() setPageSize = new EventEmitter<string>();
  @Output() deleteProduct = new EventEmitter<DeleteProductPayload>();
}
