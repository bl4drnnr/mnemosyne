import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'basic-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() itemsPerPage: string;
  @Input() totalItems: number;
  @Output() setItemsPerPage = new EventEmitter<string>();

  get totalPages() {
    return Math.ceil(this.totalItems / parseInt(this.itemsPerPage));
  }

  setNewItemsPerPage(newItemsPerPage: string) {
    const intItemsPerPage = parseInt(newItemsPerPage);

    if (
      !isNaN(intItemsPerPage) &&
      intItemsPerPage > 1 &&
      intItemsPerPage < 12
    ) {
      this.setItemsPerPage.emit(newItemsPerPage);
    }
  }
}
