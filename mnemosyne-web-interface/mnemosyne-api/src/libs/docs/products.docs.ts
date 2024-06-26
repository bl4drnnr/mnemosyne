import { ProductBySlugDto } from '@dto/product-by-slug.dto';
import { getSchemaPath, refs } from '@nestjs/swagger';
import { PostProductDto } from '@dto/post-product.dto';
import { ProductPostedDto } from '@dto/product-posted.dto';
import { WrongPictureException } from '@exceptions/wrong-picture.exception';
import { ApiBodyOptions } from '@nestjs/swagger/dist/decorators/api-body.decorator';
import { ProductNotFoundException } from '@exceptions/product-not-found.exception';
import { ProductBySlugToEditDto } from '@dto/product-by-slug-to-edit.dto';
import { ProductUpdatedDto } from '@dto/product-updated.dto';
import { CategoryNotFoundException } from '@exceptions/category-not-found.exception';
import { DeleteProductDto } from '@dto/delete-product.dto';
import { WrongDeletionConfirmationException } from '@exceptions/wrong-deletion-confirmation.exception';
import { ProductDeletedDto } from '@dto/product-deleted.dto';
import { UserProductsDto } from '@dto/user-products.dto';
import { ParseException } from '@exceptions/parse.exception';
import { OrderException } from '@exceptions/order.exception';
import { OrderByException } from '@exceptions/order-by.exception';
import { SearchProductsDto } from '@dto/search-products.dto';
import { WrongCurrencyException } from '@exceptions/wrong-currency.exception';
import { SubcategoryNotFoundException } from '@exceptions/subcategory-not-found.exception';
import { LatestProductsDto } from '@dto/latest-products.dto';
import { ProductDeletedFromFavoritesDto } from '@dto/product-deleted-from-favorites.dto';
import { DeleteProductsFromFavoritesDto } from '@dto/delete-products-from-favorites.dto';
import { ProductAddedToFavoritesDto } from '@dto/product-added-to-favorites.dto';
import { ProductAlreadyInFavoritesException } from '@exceptions/product-already-in-favorites.exception';
import { AddProductToFavoritesDto } from '@dto/add-product-to-favorites.dto';
import { UserFavoriteProductsDto } from '@dto/user-favorite-products.dto';
import { GetProductContactEmailDto } from '@dto/get-product-contact-email.dto';
import { GetProductContactPhoneDto } from '@dto/get-product-contact-phone.dto';
import { GetMarketplaceUserStatsDto } from '@dto/get-marketplace-user-stats.dto';
import { UserNotMemberException } from '@exceptions/user-not-member.exception';
import { ForbiddenResourceException } from '@exceptions/forbidden-resource.exception';
import { GetMarketplaceCompanyStatsDto } from '@dto/get-marketplace-company.stats.dto';
import { CompanyNotFoundException } from '@exceptions/company-not-found.exception';
import { GetCompanyInternalStatsDto } from '@dto/get-company-internal-stats.dto';
import { CompanyProductDeletedDto } from '@dto/company-product-deleted.dto';
import { UserNotFoundException } from '@exceptions/user-not-found.exception';
import { HashNotFoundException } from '@exceptions/hash-not-found.exception';
import { RoleAlreadyExistsException } from '@exceptions/role-already-exists.exception';
import { AccountAlreadyConfirmedException } from '@exceptions/account-already-confirmed.exception';
import { CreateCompanyDto } from '@dto/create-company.dto';

export abstract class ProductsDocs {
  static get GetProductBySlug() {
    const ApiModels = [ProductBySlugDto, ProductNotFoundException];

    const apiOperationSum =
      'Endpoint is responsible for getting the product by the slug.';
    const apiResponseDesc =
      'As an endpoint user gets an instance of the product.';
    const apiNotFoundDesc =
      'In case if the slug of the product has not been found, user gets this error message.';
    const slugQueryDesc =
      'Slug that is used in order to get the product by slug.';

    const slugQuery = {
      description: slugQueryDesc,
      name: 'slug',
      type: String,
      required: true
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(ProductBySlugDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(ProductNotFoundException) }
      },
      ApiSlugQuery: slugQuery
    };
  }

  static get LatestProducts() {
    const ApiModels = [LatestProductsDto];

    const apiOperationSum =
      'Endpoint is responsible for getting the list of latest products for the carousel on the main page.';
    const apiResponseDesc = 'As a response user gets the list of 10 products.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(LatestProductsDto) }
      }
    };
  }

  static get SearchProduct() {
    const ApiModels = [
      SearchProductsDto,
      ParseException,
      WrongCurrencyException,
      CategoryNotFoundException,
      SubcategoryNotFoundException,
      OrderException,
      OrderByException
    ];

    const BadRequests = [
      ParseException,
      WrongCurrencyException,
      OrderException,
      OrderByException
    ];

    const NotFound = [CategoryNotFoundException, SubcategoryNotFoundException];

    const apiOperationSum =
      'Endpoint is responsible for product search on the marketplace.';
    const apiResponseDesc =
      'As a response user gets a list of products under certain criteria along with number for pagination.';
    const apiBadRequestRespDesc =
      'Bad request exception is thrown in case if there is a wrong value for number, currency or orders.';
    const apiNotFoundDesc =
      'Not found exception is thrown in case if category or subcategory has not been found.';

    const productQueryDesc = 'Product query';
    const pageSizeQueryDesc =
      'Query for limit in order to get list of products.';
    const pageQueryDesc = 'Query for page in order to get list of products.';
    const orderQueryDesc = 'Query to perform sorting by';
    const orderByQueryDesc = 'ASC or DESC';
    const minPriceQueryDesc = 'Minimal price';
    const maxPriceQueryDesc = 'Maximum price';
    const currencyQueryDesc = 'Product currency';
    const categoryQueryDesc = 'Products categories';
    const subcategoryQueryDesc = 'Products subcategories';
    const companyProductsQueryDesc = 'Company products flag';
    const privateProductsQueryDesc = 'Private products flag';
    const marketplaceUserIdQueryDesc = 'Marketplace user ID (or just user ID)';
    const marketplaceCompanyIdQueryDesc =
      'Marketplace company ID (or just company ID)';
    const companyExtendedQueryDesc = 'Company extended information flag';

    const productQuery = {
      description: productQueryDesc,
      name: 'query',
      type: String,
      required: false
    };

    const pageSizeQuery = {
      description: pageSizeQueryDesc,
      name: 'pageSize',
      type: String,
      required: false
    };

    const pageQuery = {
      description: pageQueryDesc,
      name: 'page',
      type: String,
      required: false
    };

    const orderQuery = {
      description: orderQueryDesc,
      name: 'order',
      type: String,
      required: false
    };

    const orderByQuery = {
      description: orderByQueryDesc,
      name: 'orderBy',
      type: String,
      required: false
    };

    const minPriceQuery = {
      description: minPriceQueryDesc,
      name: 'minPrice',
      type: String,
      required: false
    };

    const maxPriceQuery = {
      description: maxPriceQueryDesc,
      name: 'maxPrice',
      type: String,
      required: false
    };

    const currencyQuery = {
      description: currencyQueryDesc,
      name: 'currency',
      type: String,
      required: false
    };

    const categoryQuery = {
      description: categoryQueryDesc,
      name: 'categories',
      type: String,
      required: false
    };

    const subcategoryQuery = {
      description: subcategoryQueryDesc,
      name: 'subcategories',
      type: String,
      required: false
    };

    const companyProductsQuery = {
      description: companyProductsQueryDesc,
      name: 'companyProducts',
      type: String,
      required: false
    };

    const privateProductsQuery = {
      description: privateProductsQueryDesc,
      name: 'privateProducts',
      type: String,
      required: false
    };

    const marketplaceUserIdQuery = {
      description: marketplaceUserIdQueryDesc,
      name: 'marketplaceUserId',
      type: String,
      required: false
    };

    const marketplaceCompanyIdQuery = {
      description: marketplaceCompanyIdQueryDesc,
      name: 'marketplaceCompanyId',
      type: String,
      required: false
    };

    const companyExtendedQuery = {
      description: companyExtendedQueryDesc,
      name: 'companyExtended',
      type: String,
      required: false
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(SearchProductsDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { oneOf: refs(...NotFound) }
      },
      ApiProductQuery: productQuery,
      ApiPageSizeQuery: pageSizeQuery,
      ApiPageQuery: pageQuery,
      ApiOrderQuery: orderQuery,
      ApiOrderByQuery: orderByQuery,
      ApiMinPriceQuery: minPriceQuery,
      ApiMaxPriceQuery: maxPriceQuery,
      ApiCurrencyQuery: currencyQuery,
      ApiCategoryQuery: categoryQuery,
      ApiSubcategoryQuery: subcategoryQuery,
      ApiCompanyProductsQuery: companyProductsQuery,
      ApiPrivateProductsQuery: privateProductsQuery,
      ApiMarketplaceUserIdQuery: marketplaceUserIdQuery,
      ApiMarketplaceCompanyIdQuery: marketplaceCompanyIdQuery,
      ApiCompanyExtendedQuery: companyExtendedQuery
    };
  }

  static get CreateProduct() {
    const ApiModels = [
      PostProductDto,
      ProductPostedDto,
      WrongPictureException,
      UserNotMemberException,
      ForbiddenResourceException
    ];
    const BadRequests = [WrongPictureException, UserNotMemberException];

    const apiOperationSum =
      'Endpoint is responsible for the creation of the product on the marketplace.';
    const apiResponseDesc =
      'As a response user gets a message that the product has been created and user gets redirected to the product page.';
    const apiBodyDesc =
      'Body contains all needed fields in order to create a product.';
    const apiBadRequestRespDesc =
      'If user tries to upload something else except of base64-encoded PNG picture.';
    const apiForbiddenRespDesc =
      'Forbidden request is thrown in case if user who has no access is trying to post a product on behalf of a company.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(ProductPostedDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiForbiddenResponse: {
        description: apiForbiddenRespDesc,
        schema: { $ref: getSchemaPath(ForbiddenResourceException) }
      },
      ApiBody: {
        type: PostProductDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(PostProductDto) }
      } as ApiBodyOptions
    };
  }

  static get GetProductBySlugToEdit() {
    const ApiModels = [ProductNotFoundException, ProductBySlugToEditDto];

    const apiOperationSum =
      'Endpoint is responsible for getting the product by the slug to edition.';
    const apiResponseDesc =
      'As an endpoint user gets an instance of the product.';
    const apiNotFoundDesc =
      'In case if the slug of the product has not been found, user gets this error message.';

    const slugQueryDesc =
      'Slug that is used in order to get the product by slug.';
    const companyEditQueryDesc =
      'Flag that describes whether a product can be edited as a company one.';

    const slugQuery = {
      description: slugQueryDesc,
      name: 'slug',
      type: String,
      required: true
    };

    const companyEditQuery = {
      description: companyEditQueryDesc,
      name: 'companyEdit',
      type: String,
      required: false
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(ProductBySlugToEditDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(ProductNotFoundException) }
      },
      ApiSlugQuery: slugQuery,
      ApiCompanyEditQuery: companyEditQuery
    };
  }

  static get UpdateProduct() {
    const ApiModels = [
      ProductNotFoundException,
      ProductUpdatedDto,
      WrongPictureException,
      CategoryNotFoundException,
      PostProductDto,
      UserNotMemberException
    ];
    const NotFoundRequests = [
      ProductNotFoundException,
      CategoryNotFoundException
    ];
    const BadRequests = [WrongPictureException, UserNotMemberException];

    const apiOperationSum = 'Endpoint is responsible for a product update.';
    const apiResponseDesc =
      'As a response user gets a message that the product has been updated and user gets redirected to the product page.';
    const apiBodyDesc =
      'Body contains all needed fields in order to create a product.';
    const apiNotFoundDesc =
      'Not found exception is thrown in case if product category or product itself is not found.';
    const apiBadRequestRespDesc =
      'If user tries to upload something else except of base64-encoded PNG picture.';
    const apiForbiddenRespDesc =
      'Forbidden request is thrown in case if user who has no access is trying to post a product on behalf of a company.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(ProductUpdatedDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiForbiddenResponse: {
        description: apiForbiddenRespDesc,
        schema: { $ref: getSchemaPath(ForbiddenResourceException) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { oneOf: refs(...NotFoundRequests) }
      },
      ApiBody: {
        type: PostProductDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(PostProductDto) }
      } as ApiBodyOptions
    };
  }

  static get GetUserProducts() {
    const ApiModels = [
      UserProductsDto,
      ParseException,
      OrderException,
      OrderByException
    ];
    const BadRequests = [ParseException, OrderException, OrderByException];

    const apiOperationSum =
      'Endpoint is responsible for getting users product for listing, edition or deletion. Used privately.';
    const apiResponseDesc =
      'As a response user gets the list of their products along with count numbers that is used in the pagination component';
    const apiBadRequestRespDesc =
      'Bad request error is thrown in case if there is something wrong with parsing params like pagination, order by and/or order (the message will be the different as well).';

    const productQueryDesc = 'Product query';
    const pageSizeQueryDesc =
      'Query for limit in order to get list of products.';
    const pageQueryDesc = 'Query for page in order to get list of products.';
    const orderQueryDesc = 'Query to perform sorting by';
    const orderByQueryDesc = 'ASC or DESC';

    const productQuery = {
      description: productQueryDesc,
      name: 'query',
      type: String,
      required: false
    };

    const pageSizeQuery = {
      description: pageSizeQueryDesc,
      name: 'pageSize',
      type: String,
      required: false
    };

    const pageQuery = {
      description: pageQueryDesc,
      name: 'page',
      type: String,
      required: false
    };

    const orderQuery = {
      description: orderQueryDesc,
      name: 'order',
      type: String,
      required: false
    };

    const orderByQuery = {
      description: orderByQueryDesc,
      name: 'orderBy',
      type: String,
      required: false
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(UserProductsDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiPageSizeQuery: pageSizeQuery,
      ApiPageQuery: pageQuery,
      ApiProductQuery: productQuery,
      ApiOrderQuery: orderQuery,
      ApiOrderByQuery: orderByQuery
    };
  }

  static get DeleteProduct() {
    const ApiModels = [
      DeleteProductDto,
      ProductNotFoundException,
      WrongDeletionConfirmationException,
      ProductDeletedDto
    ];

    const apiOperationSum = 'Endpoint is responsible for product deletion.';
    const apiResponseDesc =
      'As a response user gets a message with the information that the product has been successfully deleted.';
    const apiBodyDesc =
      'Body contains the ID of the product along with the full name of the user for the confirmation.';
    const apiNotFoundDesc =
      'In case if the product was not found, user gets this error message.';
    const apiBadRequestRespDesc =
      'In case if the user provided the wrong full name, the following error is thrown.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(ProductDeletedDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(ProductNotFoundException) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(WrongDeletionConfirmationException) }
      },
      ApiBody: {
        type: DeleteProductDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(DeleteProductDto) }
      } as ApiBodyOptions
    };
  }

  static get DeleteCompanyProduct() {
    const ApiModels = [
      DeleteProductDto,
      CompanyProductDeletedDto,
      WrongDeletionConfirmationException,
      ProductNotFoundException,
      UserNotFoundException,
      CompanyNotFoundException,
      ForbiddenResourceException
    ];

    const NotFound = [
      ProductNotFoundException,
      UserNotFoundException,
      CompanyNotFoundException
    ];

    const apiOperationSum =
      'Endpoint is responsible for deletion of the product on behalf on company.';
    const apiResponseDesc =
      'As a response user gets a message with information that company product has been deleted.';
    const apiNotFoundDesc =
      'Not found error is thrown in case if either product, user or company not found.';
    const apiBadRequestRespDesc =
      'Bad request error is thrown in case if user provides the wrong first and last name.';
    const apiForbiddenRespDesc =
      'Forbidden error is thrown in case if user has no access.';
    const apiBodyDesc = 'Body contains user full name along with product ID.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(CompanyProductDeletedDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { oneOf: refs(...NotFound) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(WrongDeletionConfirmationException) }
      },
      ApiForbiddenResponse: {
        description: apiForbiddenRespDesc,
        schema: { $ref: getSchemaPath(ForbiddenResourceException) }
      },
      ApiBody: {
        type: DeleteProductDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(DeleteProductDto) }
      } as ApiBodyOptions
    };
  }

  static get DeleteProductFromFavorites() {
    const ApiModels = [
      DeleteProductsFromFavoritesDto,
      ProductDeletedFromFavoritesDto,
      ProductNotFoundException
    ];

    const apiOperationSum =
      'Endpoint is responsible for the for deletion the product from the list of user favorite products.';
    const apiResponseDesc =
      'As a response user gets the message that the product has been deleted from the list of favorite products.';
    const apiBodyDesc = 'Body contains the ID of the product.';
    const apiNotFoundDesc =
      'In case if product has not been found, not found exception is thrown.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(ProductDeletedFromFavoritesDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(ProductNotFoundException) }
      },
      ApiBody: {
        type: DeleteProductsFromFavoritesDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(DeleteProductsFromFavoritesDto) }
      } as ApiBodyOptions
    };
  }

  static get AddProductToFavorites() {
    const ApiModels = [
      AddProductToFavoritesDto,
      ProductAddedToFavoritesDto,
      ProductAlreadyInFavoritesException,
      ProductNotFoundException
    ];

    const apiOperationSum =
      'Endpoint is responsible for the adding the product to the list of favorite products.';
    const apiResponseDesc =
      'As a response user gets the message the product has been deleted from the list of favorite products.';
    const apiBodyDesc = 'Body contains the ID of the product.';
    const apiNotFoundDesc =
      'In case if product has not been found, not found exception is thrown.';
    const apiBadRequestRespDesc =
      'Bad request is thrown in case if product is already on the list.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(ProductAddedToFavoritesDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(ProductNotFoundException) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { $ref: getSchemaPath(ProductAlreadyInFavoritesException) }
      },
      ApiBody: {
        type: AddProductToFavoritesDto,
        description: apiBodyDesc,
        schema: { $ref: getSchemaPath(AddProductToFavoritesDto) }
      } as ApiBodyOptions
    };
  }

  static get GetUserFavoritesProducts() {
    const ApiModels = [
      ParseException,
      OrderException,
      OrderByException,
      UserFavoriteProductsDto
    ];
    const BadRequests = [ParseException, OrderException, OrderByException];

    const apiOperationSum =
      'Endpoint is responsible for getting user favorite products.';
    const apiResponseDesc =
      'As a response user gets the list of his favorite products.';
    const apiBadRequestRespDesc =
      'Not found exception is thrown in case if category or subcategory has not been found.';

    const productQueryDesc = 'Product query';
    const pageSizeQueryDesc =
      'Query for limit in order to get list of products.';
    const pageQueryDesc = 'Query for page in order to get list of products.';
    const orderQueryDesc = 'Query to perform sorting by';
    const orderByQueryDesc = 'ASC or DESC';

    const productQuery = {
      description: productQueryDesc,
      name: 'query',
      type: String,
      required: false
    };

    const pageSizeQuery = {
      description: pageSizeQueryDesc,
      name: 'pageSize',
      type: String,
      required: false
    };

    const pageQuery = {
      description: pageQueryDesc,
      name: 'page',
      type: String,
      required: false
    };

    const orderQuery = {
      description: orderQueryDesc,
      name: 'order',
      type: String,
      required: false
    };

    const orderByQuery = {
      description: orderByQueryDesc,
      name: 'orderBy',
      type: String,
      required: false
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(UserFavoriteProductsDto) }
      },
      ApiBadRequestResponse: {
        description: apiBadRequestRespDesc,
        schema: { oneOf: refs(...BadRequests) }
      },
      ApiProductQuery: productQuery,
      ApiPageSizeQuery: pageSizeQuery,
      ApiPageQuery: pageQuery,
      ApiOrderQuery: orderQuery,
      ApiOrderByQuery: orderByQuery
    };
  }

  static get GetProductContactEmail() {
    const ApiModels = [GetProductContactEmailDto];

    const apiOperationSum =
      'Endpoint is responsible for getting product contact phone.';
    const apiResponseDesc =
      'As a response user gets product contact email (only in case if user is authorized).';
    const productIdQueryDesc = 'Product ID';

    const productIdQuery = {
      description: productIdQueryDesc,
      name: 'productId',
      type: String,
      required: false
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(GetProductContactEmailDto) }
      },
      ApiProductIdQuery: productIdQuery
    };
  }

  static get GetProductContactPhone() {
    const ApiModels = [GetProductContactPhoneDto];

    const apiOperationSum =
      'Endpoint is responsible for getting product contact phone.';
    const apiResponseDesc =
      'As a response user gets product contact phone (only in case if user is authorized).';
    const productIdQueryDesc = 'Product ID';

    const productIdQuery = {
      description: productIdQueryDesc,
      name: 'productId',
      type: String,
      required: false
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(GetProductContactEmailDto) }
      },
      ApiProductIdQuery: productIdQuery
    };
  }

  static get GetMarketplaceUserStats() {
    const ApiModels = [GetMarketplaceUserStatsDto];

    const apiOperationSum =
      'Endpoint is responsible for getting marketplace user statistics.';
    const apiResponseDesc =
      'As a response user gets a couple of different numbers about all user products.';

    const marketplaceUserIdQueryDesc = 'Marketplace user ID (or just user ID)';

    const marketplaceUserIdQuery = {
      description: marketplaceUserIdQueryDesc,
      name: 'marketplaceUserId',
      type: String,
      required: true
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(GetMarketplaceUserStatsDto) }
      },
      ApiMarketplaceUserIdQuery: marketplaceUserIdQuery
    };
  }

  static get GetMarketplaceCompanyStats() {
    const ApiModels = [GetMarketplaceCompanyStatsDto, CompanyNotFoundException];

    const apiOperationSum =
      'Endpoint is responsible for getting marketplace company statistics.';
    const apiResponseDesc =
      'As a response user gets a couple of different numbers about all company products.';
    const apiNotFoundDesc =
      'Not found error is thrown in case if company ID has been modified and company not found.';

    const marketplaceCompanyIdQueryDesc = 'Company ID';

    const marketplaceCompanyIdQuery = {
      description: marketplaceCompanyIdQueryDesc,
      name: 'companyId',
      type: String,
      required: true
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(CompanyNotFoundException) }
      },
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(GetMarketplaceCompanyStatsDto) }
      },
      ApiMarketplaceCompanyIdQuery: marketplaceCompanyIdQuery
    };
  }

  static get GetCompanyInternalStatistics() {
    const ApiModels = [
      CompanyNotFoundException,
      ForbiddenResourceException,
      GetCompanyInternalStatsDto
    ];

    const apiOperationSum =
      'Endpoint is responsible for getting internal company statistics.';
    const apiResponseDesc =
      'As a response user gets stats per company employee.';
    const apiNotFoundDesc =
      'Not found error is thrown in case if company is not found.';
    const apiForbiddenRespDesc =
      'Forbidden error is thrown in case if user is trying to access without proper access.';

    const memberQueryDesc = 'Member query';

    const memberQuery = {
      description: memberQueryDesc,
      name: 'query',
      type: String,
      required: true
    };

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 200,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(GetCompanyInternalStatsDto) }
      },
      ApiNotFoundResponse: {
        description: apiNotFoundDesc,
        schema: { $ref: getSchemaPath(CompanyNotFoundException) }
      },
      ApiForbiddenResponse: {
        description: apiForbiddenRespDesc,
        schema: { $ref: getSchemaPath(ForbiddenResourceException) }
      },
      ApiMemberQuery: memberQuery
    };
  }
}
