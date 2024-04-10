import { Injectable } from '@nestjs/common';
import { Product } from '@models/product.model';
import { InjectModel } from '@nestjs/sequelize';
import { GetProductBySlugInterface } from '@interfaces/get-product-by-slug.interface';
import { SearchProductInterface } from '@interfaces/search-product.interface';
import { ParseException } from '@exceptions/parse.exception';
import { Op } from 'sequelize';
import { User } from '@models/user.model';
import { SearchProductsDto } from '@dto/search-products.dto';
import { ProductBySlugDto } from '@dto/product-by-slug.dto';
import { GetLatestProductsInterface } from '@interfaces/get-latest-products.interface';
import { LatestProductsDto } from '@dto/latest-products.dto';
import { ProductPostedDto } from '@dto/product-posted.dto';
import { PostProductInterface } from '@interfaces/post-product.interface';
import { ApiConfigService } from '@shared/config.service';
import { S3 } from 'aws-sdk';
import { WrongPictureException } from '@exceptions/wrong-picture.exception';
import { CryptoHashAlgorithm } from '@interfaces/crypto-hash-algorithm.enum';
import { CryptographicService } from '@shared/cryptographic.service';
import { CategoriesService } from '@modules/categories.service';
import { ProductNotFoundException } from '@exceptions/product-not-found.exception';
import { ProductUpdatedDto } from '@dto/product-updated.dto';
import { GetProductBySlugToEditInterface } from '@interfaces/get-product-by-slug-to-edit.interface';
import { ProductBySlugToEditDto } from '@dto/product-by-slug-to-edit.dto';
import { Category } from '@models/category.model';
import { GetUserProductsInterface } from '@interfaces/get-user-products.interface';
import { UserProductsDto } from '@dto/user-products.dto';
import { OrderException } from '@exceptions/order.exception';
import { OrderByException } from '@exceptions/order-by.exception';
import { DeleteProductInterface } from '@interfaces/delete-product.interface';
import { ProductDeletedDto } from '@dto/product-deleted.dto';
import { WrongDeletionConfirmationException } from '@exceptions/wrong-deletion-confirmation.exception';
import { WrongCurrencyException } from '@exceptions/wrong-currency.exception';
import { CategoryNotFoundException } from '@exceptions/category-not-found.exception';
import { SubcategoryNotFoundException } from '@exceptions/subcategory-not-found.exception';
import { UsersService } from '@modules/users.service';
import { DeleteProductFromFavoritesInterface } from '@interfaces/delete-product-from-favorites.interface';
import { GetProductByIdInterface } from '@interfaces/get-product-by-id.interface';
import { ProductAddedToFavoritesDto } from '@dto/product-added-to-favorites.dto';
import { AddProductToFavoritesInterface } from '@interfaces/add-product-to-favorites.interface';
import { ProductAlreadyInFavoritesException } from '@exceptions/product-already-in-favorites.exception';
import { ProductDeletedFromFavoritesDto } from '@dto/product-deleted-from-favorites.dto';
import { GetUserFavoriteProductsInterface } from '@interfaces/get-user-favorite-products.interface';
import { UserFavoriteProductsDto } from '@dto/user-favorite-products.dto';
import { GetProductContactEmailInterface } from '@interfaces/get-product-contact-email.interface';
import { GetProductContactPhoneInterface } from '@interfaces/get-product-contact-phone.interface';
import { GetProductContactEmailDto } from '@dto/get-product-contact-email.dto';
import { GetProductContactPhoneDto } from '@dto/get-product-contact-phone.dto';
import { GetMarketplaceUserStatisticsInterface } from '@interfaces/get-marketplace-user-statistics.interface';
import { GetMarketplaceUserStatsDto } from '@dto/get-marketplace-user-stats.dto';
import { CompanyService } from '@modules/company.service';
import { UserNotMemberException } from '@exceptions/user-not-member.exception';
import { Roles } from '@interfaces/roles.enum';
import { ForbiddenResourceException } from '@exceptions/forbidden-resource.exception';
import { CheckForProductPermissionsInterface } from '@interfaces/check-for-product-permissions.interface';
import { GetCompanyProductsStatsInterface } from '@interfaces/get-company-products-stats.interface';
import { GetMarketplaceCompanyStatsDto } from '@dto/get-marketplace-company.stats.dto';
import { GetCompanyInternalStatsInterface } from '@interfaces/get-company-internal-stats.interface';
import { GetCompanyInternalStatsDto } from '@dto/get-company-internal-stats.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly cryptographicService: CryptographicService,
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
    private readonly companyService: CompanyService,
    @InjectModel(Product)
    private readonly productRepository: typeof Product
  ) {}

  async getProductById({ productId, trx }: GetProductByIdInterface) {
    const foundProduct = await this.productRepository.findOne({
      where: { id: productId },
      transaction: trx
    });

    if (!foundProduct) throw new ProductNotFoundException();

    return foundProduct;
  }

  async getProductBySlug({ slug, userId, trx }: GetProductBySlugInterface) {
    const foundProduct = await this.productRepository.findOne({
      include: [{ model: Category, attributes: ['name'] }],
      where: { slug },
      transaction: trx
    });

    if (!foundProduct) throw new ProductNotFoundException();

    const userIdHash = this.cryptographicService.hash({
      data: foundProduct.userId,
      algorithm: CryptoHashAlgorithm.MD5
    });

    let isProfilePicPresent = true;

    const { accessKeyId, secretAccessKey, bucketName } =
      this.configService.awsSdkCredentials;

    const s3 = new S3({ accessKeyId, secretAccessKey });

    try {
      await s3
        .headObject({
          Bucket: bucketName,
          Key: `users-profile-pictures/${userIdHash}.png`
        })
        .promise();
    } catch (e) {
      isProfilePicPresent = false;
    }

    let companyId: string;
    let companyName: string;
    const onBehalfOfCompany = foundProduct.onBehalfOfCompany;

    if (onBehalfOfCompany) {
      const { id, companyName: name } =
        await this.companyService.getCompanyByUserId({
          userId: foundProduct.userId,
          trx
        });
      companyId = id;
      companyName = name;
    }

    const product = {
      id: foundProduct.id,
      title: foundProduct.title,
      description: foundProduct.description,
      pictures: foundProduct.pictures,
      location: foundProduct.location,
      currency: foundProduct.currency,
      price: foundProduct.price,
      subcategory: foundProduct.subcategory,
      category: foundProduct.category.name,
      contactPerson: foundProduct.contactPerson,
      createdAt: foundProduct.createdAt,
      productInFavorites: false,
      ownerId: foundProduct.userId,
      ownerIdHash: isProfilePicPresent ? userIdHash : null,
      onBehalfOfCompany,
      companyId: onBehalfOfCompany ? companyId : null,
      companyName: onBehalfOfCompany ? companyName : null
    };

    if (userId) {
      const { favoriteProductsIds } =
        await this.usersService.getUserFavoritesProducts({
          userId,
          trx
        });

      const productInFavorites = favoriteProductsIds.find(
        (id) => id === foundProduct.id
      );

      product.productInFavorites = !!productInFavorites;
    }

    return new ProductBySlugDto(product);
  }

  async getLatestProducts({ trx }: GetLatestProductsInterface) {
    const attributes = [
      'title',
      'slug',
      'pictures',
      'currency',
      'price',
      'subcategory'
    ];

    const products = await this.productRepository.findAll({
      attributes,
      include: [{ model: Category, attributes: ['name'] }],
      order: [['created_at', 'DESC']],
      limit: 10,
      offset: 0,
      transaction: trx
    });

    const latestProducts = products.map(
      ({ title, slug, pictures, currency, price, category, subcategory }) => ({
        title,
        slug,
        mainPicture: pictures[0],
        currency,
        price,
        category: category.name,
        subcategory
      })
    );

    return new LatestProductsDto(latestProducts);
  }

  async searchProduct({
    query,
    page,
    pageSize,
    order,
    orderBy,
    minPrice,
    maxPrice,
    currency,
    categories,
    subcategories,
    companyProducts,
    privateProducts,
    marketplaceUserId,
    marketplaceCompanyId,
    companyExtended,
    userId,
    trx
  }: SearchProductInterface) {
    const offset = Number(page) * Number(pageSize);
    const limit = Number(pageSize);

    const paginationParseError =
      isNaN(offset) || isNaN(limit) || offset < 0 || limit < 0;

    if (paginationParseError) throw new ParseException();

    let minPriceNumber: number;
    let maxPriceNumber: number;

    if (minPrice) {
      minPriceNumber = Number(minPrice);

      if (isNaN(minPriceNumber) || minPriceNumber < 0)
        throw new ParseException();
    }

    if (maxPrice) {
      maxPriceNumber = Number(maxPrice);

      if (isNaN(maxPriceNumber) || maxPriceNumber < 0)
        throw new ParseException();
    }

    if (!['PLN', 'USD', 'EUR', 'all'].includes(currency))
      throw new WrongCurrencyException();

    const productsTypeFlags = ['true', 'false'];
    let getCompanyProducts: boolean;
    let getPrivateProducts: boolean;

    if (companyProducts) {
      if (!productsTypeFlags.includes(companyProducts.toLowerCase()))
        throw new ParseException();
      else {
        getCompanyProducts = companyProducts.toLowerCase() === 'true';
      }
    }

    if (privateProducts) {
      if (!productsTypeFlags.includes(privateProducts.toLowerCase()))
        throw new ParseException();
      else {
        getPrivateProducts = privateProducts.toLowerCase() === 'true';
      }
    }

    const providedCategories = categories
      .split(',')
      .map((c) => c.toLowerCase())
      .filter((c) => c !== '');
    const providedSubcategories = subcategories
      .split(',')
      .map((c) => c.toLowerCase())
      .filter((c) => c !== '');

    if (providedCategories.length > 0) {
      const allCategories = await this.categoriesService.getAllCategories({
        trx
      });
      const allCategoriesNames = allCategories.categories.map(
        ({ name }) => name
      );

      providedCategories.forEach((categoryName) => {
        if (!allCategoriesNames.includes(categoryName))
          throw new CategoryNotFoundException();
      });
    }

    if (providedSubcategories.length > 0) {
      const allSubcategoriesNames =
        await this.categoriesService.getAllSubcategories({ trx });

      providedSubcategories.forEach((subcategoryName) => {
        if (!allSubcategoriesNames.includes(subcategoryName))
          throw new SubcategoryNotFoundException();
      });
    }

    const attributes = [
      'id',
      'title',
      'slug',
      'pictures',
      'currency',
      'price',
      'subcategory',
      'location',
      'contactPhone',
      'contactPerson',
      'createdAt',
      'created_at'
    ];

    const where = {
      [Op.and]: []
    };

    if (query) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { slug: { [Op.iLike]: `%${query}%` } }
      ];
    }

    if (getCompanyProducts && !getPrivateProducts) {
      where[Op.and].push([{ on_behalf_of_company: true }]);
    } else if (getPrivateProducts && !getCompanyProducts) {
      where[Op.and].push([{ on_behalf_of_company: false }]);
    }

    if (minPrice && maxPrice) {
      where[Op.and].push([
        { price: { [Op.gte]: minPrice } },
        { price: { [Op.lte]: maxPrice } }
      ]);
    } else if (minPrice) {
      where[Op.and].push([{ price: { [Op.gte]: minPrice } }]);
    } else if (maxPrice) {
      where[Op.and].push([{ price: { [Op.lte]: maxPrice } }]);
    }

    if (marketplaceUserId) {
      where[Op.and].push([{ user_id: marketplaceUserId }]);
    }

    if (marketplaceCompanyId) {
      const allCompanyUsers = await this.companyService.getAllCompanyUsers({
        companyId: marketplaceCompanyId,
        trx
      });

      const allCompanyUsersIds = allCompanyUsers.rows.map(({ id }) => id);

      where[Op.and].push([
        {
          user_id: { [Op.in]: allCompanyUsersIds },
          on_behalf_of_company: true
        }
      ]);
    }

    if (currency !== 'all') {
      where[Op.and].push([{ currency }]);
    }

    if (providedSubcategories.length > 0) {
      where[Op.and].push({ subcategory: { [Op.in]: providedSubcategories } });
    }

    if (providedCategories.length > 0) {
      where[Op.and].push({
        '$category.name$': { [Op.in]: providedCategories }
      });
    }

    if (!attributes.includes(order)) throw new OrderException();
    if (!['DESC', 'ASC'].includes(orderBy.toUpperCase()))
      throw new OrderByException();

    const { rows, count } = await this.productRepository.findAndCountAll({
      where,
      attributes,
      limit,
      offset,
      include: [{ model: Category, attributes: ['name'] }],
      order: [[order, orderBy]],
      transaction: trx
    });

    let userFavoriteProductsIds: Array<string> = [];

    if (userId) {
      const { favoriteProductsIds } =
        await this.usersService.getUserFavoritesProducts({
          userId,
          trx
        });

      userFavoriteProductsIds = favoriteProductsIds;
    }

    let companyExtendedProductsInfo = false;

    const companyExtendedInfo = ['true', 'false'];

    if (companyExtended) {
      if (companyExtendedInfo.includes(companyExtended) && userId) {
        const {
          companyUser: { id: companyUserId }
        } = await this.usersService.getUserById({
          id: userId,
          trx
        });
        const { roleScopes } = await this.companyService.getCompanyUserRole({
          companyUserId,
          trx
        });
        if (!roleScopes.includes(Roles.PRODUCT_MANAGEMENT)) {
          throw new ForbiddenResourceException();
        } else {
          companyExtendedProductsInfo = true;
        }
      } else {
        throw new ParseException();
      }
    }

    const foundProducts = rows.map(
      ({
        id,
        title,
        slug,
        pictures,
        currency,
        price,
        category,
        subcategory,
        location,
        contactPhone,
        contactPerson,
        createdAt
      }) => ({
        id,
        title,
        slug,
        mainPicture: pictures[0],
        currency,
        price,
        category: category.name,
        subcategory,
        location: companyExtendedProductsInfo ? location : null,
        contactPhone: companyExtendedProductsInfo ? contactPhone : null,
        contactPerson: companyExtendedProductsInfo ? contactPerson : null,
        productInFavorites: userFavoriteProductsIds.includes(id),
        createdAt
      })
    );

    return new SearchProductsDto(foundProducts, count);
  }

  async createProduct({ userId, payload, trx }: PostProductInterface) {
    const {
      title,
      description,
      pictures,
      currency,
      price,
      location,
      contactPhone,
      contactPerson,
      category,
      subcategory,
      postOnBehalfOfCompany
    } = payload;

    const productPostedOnBehalfOfCompany =
      await this.checkForUserProductManagementPermissions({
        postOnBehalfOfCompany,
        userId,
        trx
      });

    const slug = this.generateProductSlug(title);
    const picturesHashes = await this.uploadProductPictures(pictures);

    const { id: categoryId } = await this.categoriesService.getCategoryByName({
      name: category,
      trx
    });

    await this.productRepository.create(
      {
        title,
        slug,
        description,
        pictures: picturesHashes,
        location,
        currency,
        price,
        subcategory,
        contactPhone,
        contactPerson,
        userId,
        categoryId,
        onBehalfOfCompany: productPostedOnBehalfOfCompany
      },
      {
        transaction: trx
      }
    );

    const productLink = `/marketplace/product/${slug}`;

    return new ProductPostedDto(productLink);
  }

  async getProductBySlugToEdit({
    userId,
    slug,
    trx
  }: GetProductBySlugToEditInterface) {
    const productToEdit = await this.productRepository.findOne({
      where: { userId, slug },
      include: [{ model: Category, attributes: ['name'] }],
      transaction: trx
    });

    if (!productToEdit) throw new ProductNotFoundException();

    const product = {
      id: productToEdit.id,
      title: productToEdit.title,
      description: productToEdit.description,
      pictures: productToEdit.pictures,
      location: productToEdit.location,
      currency: productToEdit.currency,
      price: productToEdit.price,
      subcategory: productToEdit.subcategory,
      category: productToEdit.category.name,
      createdAt: productToEdit.createdAt,
      contactPerson: productToEdit.contactPerson,
      contactPhone: productToEdit.contactPhone,
      onBehalfOfCompany: productToEdit.onBehalfOfCompany
    };

    return new ProductBySlugToEditDto(product);
  }

  async updateProduct({ userId, payload, trx }: PostProductInterface) {
    const {
      id,
      title,
      description,
      pictures,
      currency,
      price,
      location,
      contactPhone,
      contactPerson,
      category,
      subcategory,
      postOnBehalfOfCompany
    } = payload;

    const productPostedOnBehalfOfCompany =
      await this.checkForUserProductManagementPermissions({
        postOnBehalfOfCompany,
        userId,
        trx
      });

    const editedProduct = await this.productRepository.findOne({
      where: { userId, id },
      transaction: trx
    });

    if (!editedProduct) throw new ProductNotFoundException();

    const updatedSlug =
      editedProduct.title !== title
        ? this.generateProductSlug(title)
        : editedProduct.slug;

    const existingPictures = editedProduct.pictures;
    const updatedPictures = this.updatePictures(existingPictures, pictures);
    const replacedPicturesHashes = [];

    for (const pic of updatedPictures) {
      if (this.isBase64Image(pic))
        replacedPicturesHashes.push(await this.uploadProductPicture(pic));
      else replacedPicturesHashes.push(pic);
    }

    const { id: categoryId } = await this.categoriesService.getCategoryByName({
      name: category,
      trx
    });

    await this.productRepository.update(
      {
        title,
        slug: updatedSlug,
        description,
        pictures: replacedPicturesHashes,
        currency,
        price,
        location,
        contactPhone,
        contactPerson,
        categoryId,
        subcategory,
        onBehalfOfCompany: productPostedOnBehalfOfCompany
      },
      {
        returning: false,
        where: { userId, id },
        transaction: trx
      }
    );

    const productLink = `/marketplace/product/${updatedSlug}`;

    return new ProductUpdatedDto(productLink);
  }

  async getUserProducts({
    query,
    page,
    pageSize,
    order,
    orderBy,
    userId,
    trx
  }: GetUserProductsInterface) {
    const offset = Number(page) * Number(pageSize);
    const limit = Number(pageSize);

    const paginationParseError =
      isNaN(offset) || isNaN(limit) || offset < 0 || limit < 0;

    if (paginationParseError) throw new ParseException();

    const attributes = [
      'id',
      'title',
      'slug',
      'pictures',
      'location',
      'currency',
      'price',
      'subcategory',
      'contactPerson',
      'contactPhone',
      'createdAt',
      'created_at'
    ];
    const where = { userId };

    if (query) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { slug: { [Op.iLike]: `%${query}%` } }
      ];
    }

    if (!attributes.includes(order)) throw new OrderException();
    if (!['DESC', 'ASC'].includes(orderBy.toUpperCase()))
      throw new OrderByException();

    const { rows, count } = await this.productRepository.findAndCountAll({
      where,
      attributes,
      limit,
      offset,
      include: [{ model: Category, attributes: ['name'] }],
      order: [[order, orderBy]],
      transaction: trx
    });

    const { favoriteProductsIds } =
      await this.usersService.getUserFavoritesProducts({
        userId,
        trx
      });

    const foundProducts = rows.map(
      ({
        id,
        title,
        slug,
        pictures,
        location,
        currency,
        price,
        subcategory,
        category,
        createdAt,
        contactPerson,
        contactPhone
      }) => ({
        id,
        title,
        slug,
        mainPicture: pictures[0],
        location,
        currency,
        price,
        subcategory,
        category: category.name,
        createdAt,
        contactPerson,
        contactPhone,
        productInFavorites: favoriteProductsIds.includes(id)
      })
    );

    return new UserProductsDto(foundProducts, count);
  }

  async deleteProduct({ userId, payload, trx }: DeleteProductInterface) {
    const { productId, fullName } = payload;

    const deletedProduct = await this.productRepository.findOne({
      where: { userId, id: productId },
      include: [{ model: User, attributes: ['firstName', 'lastName'] }],
      transaction: trx
    });

    if (!deletedProduct) throw new ProductNotFoundException();

    const { firstName, lastName } = deletedProduct.user;

    if (fullName !== `${firstName} ${lastName}`)
      throw new WrongDeletionConfirmationException();

    await this.productRepository.destroy({
      where: { userId, id: productId },
      transaction: trx
    });

    return new ProductDeletedDto();
  }

  async deleteProductFromFavorites({
    userId,
    payload,
    trx
  }: DeleteProductFromFavoritesInterface) {
    const { productId } = payload;

    const product = await this.getProductById({ productId, trx });

    const { favoriteProductsIds } =
      await this.usersService.getUserFavoritesProducts({ userId, trx });

    const updatedFavoriteProducts = favoriteProductsIds.filter(
      (id) => id !== product.id
    );

    await this.usersService.updateUserFavoritesProducts({
      userId,
      favoriteProductsIds: updatedFavoriteProducts,
      trx
    });

    return new ProductDeletedFromFavoritesDto();
  }

  async addProductToFavorites({
    userId,
    payload,
    trx
  }: AddProductToFavoritesInterface) {
    const { productId } = payload;

    const product = await this.getProductById({ productId, trx });

    const { favoriteProductsIds } =
      await this.usersService.getUserFavoritesProducts({ userId, trx });

    const foundFavoriteProduct = favoriteProductsIds.find(
      (id) => id === product.id
    );

    if (foundFavoriteProduct) throw new ProductAlreadyInFavoritesException();

    favoriteProductsIds.push(productId);

    await this.usersService.updateUserFavoritesProducts({
      userId,
      favoriteProductsIds,
      trx
    });

    return new ProductAddedToFavoritesDto();
  }

  async getUserFavoritesProducts({
    query,
    page,
    pageSize,
    order,
    orderBy,
    userId,
    trx
  }: GetUserFavoriteProductsInterface) {
    const offset = Number(page) * Number(pageSize);
    const limit = Number(pageSize);

    const paginationParseError =
      isNaN(offset) || isNaN(limit) || offset < 0 || limit < 0;

    if (paginationParseError) throw new ParseException();

    const attributes = [
      'id',
      'title',
      'slug',
      'pictures',
      'currency',
      'price',
      'subcategory',
      'createdAt',
      'created_at'
    ];

    const { favoriteProductsIds } =
      await this.usersService.getUserFavoritesProducts({
        userId,
        trx
      });

    const where = {
      id: { [Op.in]: favoriteProductsIds }
    };

    if (query) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { slug: { [Op.iLike]: `%${query}%` } }
      ];
    }

    if (!attributes.includes(order)) throw new OrderException();
    if (!['DESC', 'ASC'].includes(orderBy.toUpperCase()))
      throw new OrderByException();

    const { rows, count } = await this.productRepository.findAndCountAll({
      where,
      attributes,
      limit,
      offset,
      include: [{ model: Category, attributes: ['name'] }],
      order: [[order, orderBy]],
      transaction: trx
    });

    const foundProducts = rows.map(
      ({
        id,
        title,
        slug,
        pictures,
        currency,
        price,
        subcategory,
        category,
        createdAt
      }) => ({
        id,
        title,
        slug,
        mainPicture: pictures[0],
        currency,
        price,
        subcategory,
        category: category.name,
        createdAt
      })
    );

    return new UserFavoriteProductsDto(foundProducts, count);
  }

  async getProductContactEmail({
    productId,
    trx
  }: GetProductContactEmailInterface) {
    const foundProduct = await this.productRepository.findOne({
      where: { id: productId },
      include: [{ model: User, attributes: ['email'] }],
      transaction: trx
    });

    return new GetProductContactEmailDto(foundProduct.user.email);
  }

  async getProductContactPhone({
    productId,
    trx
  }: GetProductContactPhoneInterface) {
    const foundProduct = await this.productRepository.findOne({
      attributes: ['contactPhone'],
      where: { id: productId },
      transaction: trx
    });

    return new GetProductContactPhoneDto(foundProduct.contactPhone);
  }

  async getMarketplaceUserStatistics({
    marketplaceUserId,
    trx
  }: GetMarketplaceUserStatisticsInterface) {
    const { rows, count } = await this.productRepository.findAndCountAll({
      where: { userId: marketplaceUserId },
      transaction: trx
    });
    const amountOfProducts = count;

    const userStats = this.marketplaceProductsStats(rows);

    return new GetMarketplaceUserStatsDto({ amountOfProducts, ...userStats });
  }

  async getCompanyProductsStatistics({
    companyId,
    trx
  }: GetCompanyProductsStatsInterface) {
    const allCompanyUsers = await this.companyService.getAllCompanyUsers({
      companyId,
      trx
    });

    const allCompanyUsersIds = allCompanyUsers.rows.map(({ id }) => id);

    const { rows, count } = await this.productRepository.findAndCountAll({
      where: {
        userId: { [Op.in]: allCompanyUsersIds },
        onBehalfOfCompany: true
      },
      transaction: trx
    });
    const amountOfProducts = count;

    const companyStats = this.marketplaceProductsStats(rows);

    return new GetMarketplaceCompanyStatsDto({
      amountOfProducts,
      ...companyStats
    });
  }

  async getCompanyInternalStatistics({
    companyId,
    userId,
    query,
    trx
  }: GetCompanyInternalStatsInterface) {
    const allCompanyUsers = await this.companyService.getAllCompanyUsers({
      companyId,
      trx
    });

    const {
      companyUser: { id: companyUserId }
    } = await this.usersService.getUserById({
      id: userId,
      trx
    });

    const { roleScopes } = await this.companyService.getCompanyUserRole({
      companyUserId,
      trx
    });

    if (!roleScopes.includes(Roles.PRODUCT_MANAGEMENT))
      throw new ForbiddenResourceException();

    let companyUsersFiltered = allCompanyUsers.rows;

    if (query) {
      companyUsersFiltered = allCompanyUsers.rows.filter(({ email }) =>
        email.includes(query.toLowerCase())
      );
    }

    const companyInternalStats = [];

    for (const companyEmployee of companyUsersFiltered) {
      const { rows, count } = await this.productRepository.findAndCountAll({
        where: {
          userId: companyEmployee.id,
          onBehalfOfCompany: true
        },
        transaction: trx
      });
      const amountOfUserProducts = count;
      const companyUserProductsStatus = this.marketplaceProductsStats(rows);

      companyInternalStats.push({
        id: companyEmployee.id,
        email: companyEmployee.email,
        firstName: companyEmployee.firstName,
        lastName: companyEmployee.lastName,
        amountOfUserProducts,
        companyUserProductsStatus
      });
    }

    return new GetCompanyInternalStatsDto(companyInternalStats);
  }

  private marketplaceProductsStats(rows: Array<Product>) {
    const plnProducts = rows.filter(({ currency }) => currency === 'PLN');
    const usdProducts = rows.filter(({ currency }) => currency === 'USD');
    const eurProducts = rows.filter(({ currency }) => currency === 'EUR');

    const plnProductsAmount = plnProducts.length;
    const usdProductsAmount = usdProducts.length;
    const eurProductsAmount = eurProducts.length;

    let plnProductsAvgAmount = 0;
    let usdProductsAvgAmount = 0;
    let eurProductsAvgAmount = 0;
    let plnMinPrice = 0;
    let plnMaxPrice = 0;
    let usdMinPrice = 0;
    let usdMaxPrice = 0;
    let eurMinPrice = 0;
    let eurMaxPrice = 0;

    if (plnProductsAmount > 0) {
      plnProductsAvgAmount =
        plnProducts.map((p) => p.price).reduce((a, b) => a + b) /
        plnProductsAmount;
      plnMinPrice = Math.min(...plnProducts.map((p) => p.price));
      plnMaxPrice = Math.max(...plnProducts.map((p) => p.price));
    }

    if (usdProductsAmount > 0) {
      usdProductsAvgAmount =
        usdProducts.map((p) => p.price).reduce((a, b) => a + b) /
        usdProductsAmount;
      usdMinPrice = Math.min(...usdProducts.map((p) => p.price));
      usdMaxPrice = Math.max(...usdProducts.map((p) => p.price));
    }

    if (eurProductsAmount > 0) {
      eurProductsAvgAmount =
        eurProducts.map((p) => p.price).reduce((a, b) => a + b) /
        eurProductsAmount;
      eurMinPrice = Math.min(...eurProducts.map((p) => p.price));
      eurMaxPrice = Math.max(...eurProducts.map((p) => p.price));
    }

    return {
      plnProductsAmount,
      usdProductsAmount,
      eurProductsAmount,
      plnProductsAvgAmount,
      usdProductsAvgAmount,
      eurProductsAvgAmount,
      plnMinPrice,
      plnMaxPrice,
      usdMinPrice,
      usdMaxPrice,
      eurMinPrice,
      eurMaxPrice
    };
  }

  private async checkForUserProductManagementPermissions({
    postOnBehalfOfCompany,
    userId,
    trx
  }: CheckForProductPermissionsInterface) {
    let productPostedOnBehalfOfCompany = false;

    const company = await this.companyService.getCompanyByUserId({
      userId,
      trx
    });

    if (!company && postOnBehalfOfCompany) {
      throw new UserNotMemberException();
    } else if (company && postOnBehalfOfCompany) {
      const companyUserId = company.companyUsers.find(
        (user) => user.userId === userId
      ).id;
      const { roleScopes } = await this.companyService.getCompanyUserRole({
        companyUserId,
        trx
      });

      if (!roleScopes.includes(Roles.PRODUCT_MANAGEMENT)) {
        throw new ForbiddenResourceException();
      } else {
        productPostedOnBehalfOfCompany = true;
      }
    }

    return productPostedOnBehalfOfCompany;
  }

  private generateProductSlug(productName: string) {
    let slug = productName.toLowerCase();
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/[^\w\-]+/g, '');

    const randomNumber = String((Date.now() + Math.random()) * 10000).slice(-6);

    slug += `-${randomNumber}`;

    return slug;
  }

  private async uploadProductPictures(productPictures: Array<string>) {
    const picturesHashes = [];

    for (const pic of productPictures) {
      picturesHashes.push(await this.uploadProductPicture(pic));
    }

    return picturesHashes;
  }

  private async uploadProductPicture(productPicture: string) {
    const { accessKeyId, secretAccessKey, bucketName } =
      this.configService.awsSdkCredentials;

    const s3 = new S3({ accessKeyId, secretAccessKey });

    const base64Data = Buffer.from(
      productPicture.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    const type = productPicture.split(';')[0].split('/')[1];

    if (type !== 'png') throw new WrongPictureException();

    const pictureHash = this.cryptographicService.hash({
      data: base64Data.toString() + Date.now().toString(),
      algorithm: CryptoHashAlgorithm.MD5
    });

    const params = {
      Bucket: bucketName,
      Key: `products/${pictureHash}.${type}`,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`
    };

    await s3.upload(params).promise();

    return pictureHash;
  }

  private updatePictures(existingPics: Array<string>, newPics: Array<string>) {
    if (newPics.length > existingPics.length) {
      const newIndexes = newPics.filter((pic) => !existingPics.includes(pic));
      existingPics.push(...newIndexes);
    }

    if (newPics.length < existingPics.length) {
      const deleteIndexes = existingPics.filter(
        (pic) => !newPics.includes(pic)
      );
      deleteIndexes.forEach((pic) => {
        const index = existingPics.indexOf(pic);
        if (index !== -1) existingPics.splice(index, 1);
      });
    }

    return existingPics;
  }

  private isBase64Image(str: string): boolean {
    const base64Pattern = /^data:image\/(png);base64,([A-Za-z0-9+/=])+$/;
    return base64Pattern.test(str);
  }
}
