import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslationService } from '@services/translation.service';
import { ProductsService } from '@services/products.service';
import { Titles } from '@interfaces/titles.enum';
import { GetProductBySlug } from '@responses/get-product-by-slug.interface';
import { RefreshTokensService } from '@services/refresh-tokens.service';
import { ValidationService } from '@services/validation.service';
import { GetAllCategoriesResponse } from '@responses/get-all-categories.interface';
import { DropdownInterface } from '@interfaces/dropdown.interface';
import { ComponentsTranslation } from '@translations/components.enum';
import { CategoriesService } from '@services/categories.service';
import { Currency } from '@interfaces/currency.type';
import { ProductCategory } from '@interfaces/product-category.type';
import { ProductSubcategory } from '@interfaces/product-subcategory.type';
import { MessagesTranslation } from '@translations/messages.enum';
import { GlobalMessageService } from '@shared/global-message.service';
import { UploadProductPictureComponent } from '@components/upload-product-picture/upload-product-picture.component';
import { SubcategoriesListType } from '@interfaces/subcategories-list.type';

@Component({
  selector: 'page-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['../shared/create-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productSlug: string;
  productTitle: string;
  incorrectProductTitle: boolean;
  productDescription: string;
  incorrectProductDescription: boolean;
  contactPerson: string;
  incorrectContactPerson: boolean;
  contactEmail: string;
  contactPhoneNumber: string;
  productPrice: string;
  productLocation: string;

  product: GetProductBySlug;

  categories: Array<GetAllCategoriesResponse>;
  categoriesDropdown: Array<DropdownInterface>;
  categoryDropdownValue: DropdownInterface = {
    key: '',
    value: ''
  };
  subcategoryDropdownValue: DropdownInterface = {
    key: '',
    value: ''
  };
  subcategoriesDropdowns: SubcategoriesListType;
  subcategoriesDropdown: Array<DropdownInterface>;
  selectProductSubcategoryTitle: string;
  productPriceDropdown: Array<DropdownInterface> = [
    { key: 'PLN', value: 'PLN' },
    { key: 'EUR', value: 'EUR' },
    { key: 'USD', value: 'USD' }
  ];
  productPriceDropdownValue: DropdownInterface;

  productPic1: string | ArrayBuffer | null;
  productPic2: string | ArrayBuffer | null;
  productPic3: string | ArrayBuffer | null;
  productPic4: string | ArrayBuffer | null;
  productPic5: string | ArrayBuffer | null;
  productPic6: string | ArrayBuffer | null;
  productPic7: string | ArrayBuffer | null;
  productPic8: string | ArrayBuffer | null;
  @ViewChild('fileInput1') fileInput1!: UploadProductPictureComponent;
  @ViewChild('fileInput2') fileInput2!: UploadProductPictureComponent;
  @ViewChild('fileInput3') fileInput3!: UploadProductPictureComponent;
  @ViewChild('fileInput4') fileInput4!: UploadProductPictureComponent;
  @ViewChild('fileInput5') fileInput5!: UploadProductPictureComponent;
  @ViewChild('fileInput6') fileInput6!: UploadProductPictureComponent;
  @ViewChild('fileInput7') fileInput7!: UploadProductPictureComponent;
  @ViewChild('fileInput8') fileInput8!: UploadProductPictureComponent;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translationService: TranslationService,
    private readonly productsService: ProductsService,
    private readonly categoriesService: CategoriesService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly validationService: ValidationService,
    private readonly globalMessageService: GlobalMessageService
  ) {}

  editProduct() {
    const productPictures = [
      this.productPic1,
      this.productPic2,
      this.productPic3,
      this.productPic4,
      this.productPic5,
      this.productPic6,
      this.productPic7,
      this.productPic8
    ].filter((pic) => !!pic);
    this.productsService
      .updateProduct({
        id: this.product.id,
        title: this.productTitle,
        description: this.productDescription,
        pictures: productPictures,
        currency: this.productPriceDropdownValue.key as Currency,
        price: Number(this.productPrice),
        location: this.productLocation,
        contactPhone: this.contactPhoneNumber,
        contactPerson: this.contactPerson,
        category: this.categoryDropdownValue.key as ProductCategory,
        subcategory: this.subcategoryDropdownValue.key as ProductSubcategory
      })
      .subscribe({
        next: async ({ message, link }) => {
          await this.handleRedirect(link);
          const globalMessage = await this.translationService.translateText(
            message,
            MessagesTranslation.RESPONSES
          );
          this.globalMessageService.handle({
            message: globalMessage
          });
        }
      });
  }

  getProductBySlugToEdit() {
    this.productsService
      .getProductBySlugToEdit({
        slug: this.productSlug
      })
      .subscribe({
        next: async ({ product }) => {
          this.product = product;
          this.productTitle = product.title;
          this.productDescription = product.description;
          this.contactPerson = product.contactPerson;
          this.contactPhoneNumber = product.contactPhone || '';
          this.productLocation = product.location;
          this.productPrice = String(product.price);
          this.translationService.setPageTitle(Titles.EDIT_PRODUCT, {
            product: product.title
          });
          this.productPriceDropdownValue = {
            key: product.currency,
            value: product.currency
          };

          const picturesIndex: Array<number> = [];

          product.pictures.forEach((pic, idx) => {
            picturesIndex.push(idx + 1);
          });

          if (picturesIndex.includes(1)) this.productPic1 = product.pictures[0];
          if (picturesIndex.includes(2)) this.productPic2 = product.pictures[1];
          if (picturesIndex.includes(3)) this.productPic3 = product.pictures[2];
          if (picturesIndex.includes(4)) this.productPic4 = product.pictures[3];
          if (picturesIndex.includes(5)) this.productPic5 = product.pictures[4];
          if (picturesIndex.includes(6)) this.productPic6 = product.pictures[5];
          if (picturesIndex.includes(7)) this.productPic7 = product.pictures[6];
          if (picturesIndex.includes(8)) this.productPic8 = product.pictures[7];

          await this.initCategoriesDropdown();
          await this.initSubcategoriesDropdowns();
        },
        error: async () =>
          await this.handleRedirect('marketplace/product-not-found')
      });
  }

  disableEditProductButton() {
    if (this.product) {
      return (
        this.incorrectProductTitle ||
        this.incorrectProductDescription ||
        this.incorrectContactPerson ||
        !this.product.title ||
        !this.product.description ||
        !this.product.contactPerson ||
        !this.product.contactPhone ||
        !this.isMobilePhoneCorrect() ||
        !this.categoryDropdownValue.key ||
        !this.subcategoryDropdownValue.key ||
        this.categoryDropdownValue.key === '' ||
        this.subcategoryDropdownValue.key === '' ||
        this.categoryDropdownValue.key === 'selectProductCategory' ||
        this.subcategoryDropdownValue.key === 'selectProductSubcategory' ||
        !this.product.location ||
        !this.productPrice ||
        !this.checkIfProductWasChanged()
      );
    } else {
      return true;
    }
  }

  checkProductPrice() {
    const productPriceNumber = Number(this.productPrice);
    return productPriceNumber < 0;
  }

  checkIfProductWasChanged() {
    const productPictures = [
      this.productPic1,
      this.productPic2,
      this.productPic3,
      this.productPic4,
      this.productPic5,
      this.productPic6,
      this.productPic7,
      this.productPic8
    ].filter((pic) => !!pic);
    if (this.product) {
      return (
        this.productTitle !== this.product.title ||
        this.productDescription !== this.product.description ||
        this.contactPerson !== this.product.contactPerson ||
        this.contactPhoneNumber !== this.product.contactPhone ||
        this.productLocation !== this.product.location ||
        this.productPrice !== String(this.product.price) ||
        this.categoryDropdownValue.key !== this.product.category ||
        this.subcategoryDropdownValue.key !== this.product.subcategory ||
        this.productPriceDropdownValue.key !== this.product.currency ||
        JSON.stringify(productPictures) !==
          JSON.stringify(this.product.pictures)
      );
    } else {
      return true;
    }
  }

  isMobilePhoneCorrect() {
    return this.validationService.checkPhoneFormat(this.contactPhoneNumber);
  }

  getSubcategoryDropdownLabel(category: string) {
    switch (category) {
      case 'house':
        this.initSubcategoryDropdown(category);
        return 'dropdown.houseSubcategoryTitle';
      case 'travels':
        this.initSubcategoryDropdown(category);
        return 'dropdown.travelsSubcategoryTitle';
      case 'business':
        this.initSubcategoryDropdown(category);
        return 'dropdown.businessSubcategoryTitle';
      case 'cooking':
        this.initSubcategoryDropdown(category);
        return 'dropdown.cookingSubcategoryTitle';
      case 'sports':
        this.initSubcategoryDropdown(category);
        return 'dropdown.sportsSubcategoryTitle';
      case 'computers':
        this.initSubcategoryDropdown(category);
        return 'dropdown.computersSubcategoryTitle';
      default:
        this.initSubcategoryDropdown(category);
        return 'dropdown.houseSubcategoryTitle';
    }
  }

  initSubcategoryDropdown(category: string) {
    this.subcategoriesDropdown = this.subcategoriesDropdowns.find(
      ({ categoryKey }) => categoryKey === category
    )!.subcategories;
  }

  getCategoryDescription(category: string) {
    return `dropdown.${this.categories!.find(({ name }) => category === name)!.description}`;
  }

  selectProductCategory({ key, value }: DropdownInterface) {
    this.categoryDropdownValue = { key, value };
    this.subcategoryDropdownValue = {
      key: 'selectProductSubcategory',
      value: this.selectProductSubcategoryTitle
    };
  }

  selectProductSubcategory({ key, value }: DropdownInterface) {
    this.subcategoryDropdownValue = { key, value };
  }

  selectProductCurrency({ key, value }: DropdownInterface) {
    this.productPriceDropdownValue = { key, value };
  }

  async initCategoriesDropdown() {
    this.categoriesDropdown = await Promise.all(
      this.categories.map(async ({ name }) => {
        return {
          key: name,
          value: await this.translationService.translateText(
            name,
            ComponentsTranslation.DROPDOWN
          )
        };
      })
    );
    this.categoryDropdownValue = {
      key: this.product.category,
      value: await this.translationService.translateText(
        this.product.category,
        ComponentsTranslation.DROPDOWN
      )
    };
  }

  async initSubcategoriesDropdowns() {
    this.subcategoriesDropdowns = await Promise.all(
      this.categories.map(async ({ name }) => {
        const subcategories: { [key: string]: string } =
          await this.translationService.translateObject(
            `${name}Subcategory`,
            ComponentsTranslation.DROPDOWN
          );

        const dropdownSubcategories = Object.entries(subcategories).map(
          (key) => {
            const subcategoryKey = key[0];
            const subcategoryValue = key[1];
            return { key: subcategoryKey, value: subcategoryValue };
          }
        );

        return {
          categoryKey: name,
          subcategories: dropdownSubcategories
        };
      })
    );
    this.selectProductSubcategoryTitle =
      await this.translationService.translateText(
        `${this.product.category}Subcategory.${this.product.subcategory}`,
        ComponentsTranslation.DROPDOWN
      );
    this.subcategoryDropdownValue = {
      key: this.product.subcategory,
      value: this.selectProductSubcategoryTitle
    };
  }

  disablePhotoUpload(idx: number) {
    if (idx === 1) {
      return !this.productPic1;
    } else if (idx === 2) {
      return !this.productPic1 || !this.productPic2;
    } else if (idx === 3) {
      return !this.productPic1 || !this.productPic2 || !this.productPic3;
    } else if (idx === 4) {
      return (
        !this.productPic1 ||
        !this.productPic2 ||
        !this.productPic3 ||
        !this.productPic4
      );
    } else if (idx === 5) {
      return (
        !this.productPic1 ||
        !this.productPic2 ||
        !this.productPic3 ||
        !this.productPic4 ||
        !this.productPic5
      );
    } else if (idx === 6) {
      return (
        !this.productPic1 ||
        !this.productPic2 ||
        !this.productPic3 ||
        !this.productPic4 ||
        !this.productPic5 ||
        !this.productPic6
      );
    } else if (idx === 7) {
      return (
        !this.productPic1 ||
        !this.productPic2 ||
        !this.productPic3 ||
        !this.productPic4 ||
        !this.productPic5 ||
        !this.productPic6 ||
        !this.productPic7
      );
    } else {
      return false;
    }
  }

  clearFileInput(idx: number) {
    if (idx === 0) {
      this.fileInput1.clearFileInput();
      this.fileInput2.clearFileInput();
      this.fileInput3.clearFileInput();
      this.fileInput4.clearFileInput();
      this.fileInput5.clearFileInput();
      this.fileInput6.clearFileInput();
      this.fileInput7.clearFileInput();
      this.fileInput8.clearFileInput();
    } else if (idx === 1) {
      this.fileInput2.clearFileInput();
      this.fileInput3.clearFileInput();
      this.fileInput4.clearFileInput();
      this.fileInput5.clearFileInput();
      this.fileInput6.clearFileInput();
      this.fileInput7.clearFileInput();
      this.fileInput8.clearFileInput();
    } else if (idx === 2) {
      this.fileInput3.clearFileInput();
      this.fileInput4.clearFileInput();
      this.fileInput5.clearFileInput();
      this.fileInput6.clearFileInput();
      this.fileInput7.clearFileInput();
      this.fileInput8.clearFileInput();
    } else if (idx === 3) {
      this.fileInput4.clearFileInput();
      this.fileInput5.clearFileInput();
      this.fileInput6.clearFileInput();
      this.fileInput7.clearFileInput();
      this.fileInput8.clearFileInput();
    } else if (idx === 4) {
      this.fileInput5.clearFileInput();
      this.fileInput6.clearFileInput();
      this.fileInput7.clearFileInput();
      this.fileInput8.clearFileInput();
    } else if (idx === 5) {
      this.fileInput6.clearFileInput();
      this.fileInput7.clearFileInput();
      this.fileInput8.clearFileInput();
    } else if (idx === 6) {
      this.fileInput7.clearFileInput();
    } else if (idx === 7) {
      this.fileInput8.clearFileInput();
    }
  }

  async handleRedirect(path: string) {
    await this.router.navigate([path]);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const productSlug = params.get('product-slug');

      if (!productSlug) {
        await this.handleRedirect('marketplace/product-not-found');
      } else {
        this.productSlug = productSlug;

        this.categoriesService.getAllCategories().subscribe({
          next: async ({ categories }) => {
            this.categories = categories;
            const userInfoRequest =
              await this.refreshTokensService.refreshTokens();

            if (userInfoRequest) {
              userInfoRequest.subscribe({
                next: (userInfo) => (this.contactEmail = userInfo.email)
              });
            }

            this.getProductBySlugToEdit();
          }
        });
      }
    });
  }
}
