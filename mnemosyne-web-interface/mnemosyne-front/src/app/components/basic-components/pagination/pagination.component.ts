import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownInterface } from '@interfaces/dropdown.interface';

@Component({
  selector: 'basic-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() itemsPerPageLabel: string;
  @Input() currentPage: string;
  @Input() itemsPerPage: string;
  @Input() totalItems: number;
  @Input() onWhite = false;
  @Output() setItemsPerPage = new EventEmitter<string>();
  @Output() setCurrentPage = new EventEmitter<string>();
  @Output() fetchItems = new EventEmitter<void>();

  selectedPaginationOption: DropdownInterface = {
    key: '10',
    value: '10'
  };
  itemsPerPageOptions: Array<DropdownInterface> = [
    {
      key: '5',
      value: '5'
    },
    {
      key: '10',
      value: '10'
    },
    {
      key: '25',
      value: '25'
    },
    {
      key: '50',
      value: '50'
    },
    {
      key: '100',
      value: '100'
    }
  ];

  get totalPages() {
    return Math.ceil(this.totalItems / Number(this.itemsPerPage));
  }

  get currentPageInt() {
    return Number(this.currentPage) + 1;
  }

  setNewCurrentPage(newPage: number) {
    const actualPage = this.currentPageInt - 1 + newPage;

    if (actualPage >= 0 && actualPage <= this.totalPages) {
      this.setCurrentPage.emit(String(actualPage));
      this.fetchItemsList();
    }
  }

  goToStartPage() {
    this.setCurrentPage.emit('0');
    this.fetchItemsList();
  }

  goToEndPage() {
    this.setCurrentPage.emit(String(this.totalPages - 1));
    this.fetchItemsList();
  }

  setNewItemsPerPage({ key, value }: DropdownInterface) {
    this.selectedPaginationOption = { key, value };
    this.setItemsPerPage.emit(key);
    this.fetchItemsList();
  }

  showPageIndicator() {
    return (
      this.totalPages > 2 &&
      this.currentPageInt !== 1 &&
      this.currentPageInt !== this.totalPages
    );
  }

  manuallySetThePage(newPage: string) {
    const newPageInt = parseInt(newPage);

    if (newPageInt >= 1 && newPageInt <= this.totalPages) {
      this.setCurrentPage.emit(String(newPageInt - 1));
      this.fetchItemsList();
    }
  }

  fetchItemsList() {
    this.fetchItems.emit();
  }
}
