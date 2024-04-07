import { DropdownInterface } from '@interfaces/dropdown.interface';

export type SubcategoriesListType = Array<{
  categoryKey: string;
  subcategories: Array<DropdownInterface>;
}>;
