import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownInterface } from '@interfaces/dropdown.interface';

@Component({
  selector: 'basic-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() itemsPerPage: string;
  @Input() totalItems: number;
  @Output() setItemsPerPage = new EventEmitter<string>();
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

  setNewItemsPerPage({ key, value }: DropdownInterface) {
    this.selectedPaginationOption = { key, value };
    this.setItemsPerPage.emit(key);
    this.fetchItemsList();
  }

  fetchItemsList() {
    this.fetchItems.emit();
  }
}
