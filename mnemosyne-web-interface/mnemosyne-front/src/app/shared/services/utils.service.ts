import { Injectable } from '@angular/core';
import { GetAllCategoriesResponse } from '@responses/get-all-categories.interface';
import { ComponentsTranslation } from '@translations/components.enum';
import { TranslationService } from '@services/translation.service';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { SubcategoriesListType } from '@interfaces/subcategories-list.type';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  constructor(private readonly translationService: TranslationService) {}

  compareArrays(a: Array<any>, b: Array<any>) {
    return (
      a.length === b.length && a.every((element, index) => element === b[index])
    );
  }

  async initCategories(categories: Array<GetAllCategoriesResponse>) {
    return await Promise.all(
      categories.map(async ({ name }) => {
        return {
          key: name,
          value: await this.translationService.translateText(
            name,
            ComponentsTranslation.DROPDOWN
          )
        };
      })
    );
  }

  async initSubcategories(categories: Array<GetAllCategoriesResponse>) {
    return await Promise.all(
      categories.map(async ({ name }) => {
        const subcategories: { [key: string]: string } =
          await this.translationService.translateObject(
            `${name}Subcategory`,
            ComponentsTranslation.DROPDOWN
          );

        const subcategoriesList = Object.entries(subcategories).map((key) => {
          const subcategoryKey = key[0];
          const subcategoryValue = key[1];
          return { key: subcategoryKey, value: subcategoryValue };
        });

        return {
          categoryKey: name,
          subcategories: subcategoriesList
        };
      })
    );
  }

  getSubcategories(subcategoriesList: SubcategoriesListType, key: string) {
    return subcategoriesList.find(({ categoryKey }) => categoryKey === key)!
      .subcategories;
  }

  addCategory(
    selectedSubcategories: Array<DropdownInterface>,
    subcategoriesList: SubcategoriesListType,
    selectedCategories: Array<DropdownInterface>,
    category: DropdownInterface
  ) {
    const index = selectedCategories.findIndex(
      (item) => item.key === category.key
    );

    if (index === -1) {
      selectedCategories.push({
        key: category.key,
        value: category.value
      });
    } else {
      selectedCategories.splice(index, 1);
      const categorySubcategories = this.getSubcategories(
        subcategoriesList,
        category.key
      );
      selectedSubcategories = selectedCategories.filter(
        (sub) => !categorySubcategories.find((sub2) => sub.key === sub2.key)
      );
    }

    return { selectedCategories, selectedSubcategories };
  }

  addSubcategory(
    selectedSubcategories: Array<DropdownInterface>,
    subcategory: DropdownInterface
  ) {
    const index = selectedSubcategories.findIndex(
      (item) => item.key === subcategory.key
    );

    if (index === -1) {
      selectedSubcategories.push({
        key: subcategory.key,
        value: subcategory.value
      });
    } else {
      selectedSubcategories.splice(index, 1);
    }

    return selectedSubcategories;
  }

  checkProductPrice(
    price: string,
    priceType: 'min' | 'max',
    minPrice: string,
    maxPrice: string,
    minPriceError: boolean,
    maxPriceError: boolean,
    wrongPriceError: boolean
  ) {
    const priceNumber = Number(price);

    if (priceType === 'min' && priceNumber < 0) {
      minPrice = '';
      minPriceError = true;
    } else if (priceType === 'max' && priceNumber < 0) {
      maxPrice = '';
      maxPriceError = true;
    } else if (priceType === 'min' && priceNumber >= 0) {
      minPrice = price;
      minPriceError = false;
    } else if (priceType === 'max' && priceNumber >= 0) {
      maxPrice = price;
      maxPriceError = false;
    }

    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      wrongPriceError = true;
    }

    return {
      minPrice,
      maxPrice,
      minPriceError,
      maxPriceError,
      wrongPriceError
    };
  }

  joinSelectedCategories(selectedCategories: Array<DropdownInterface>) {
    return selectedCategories.map(({ key }) => key).join(',');
  }

  joinSelectedSubcategories(selectedSubcategories: Array<DropdownInterface>) {
    return selectedSubcategories.map(({ key }) => key).join(',');
  }
}
