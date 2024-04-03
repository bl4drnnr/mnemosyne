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
      ApiSubcategoryQuery: subcategoryQuery
    };
  }

  static get CreateProduct() {
    const ApiModels = [PostProductDto, ProductPostedDto, WrongPictureException];

    const apiOperationSum =
      'Endpoint is responsible for the creation of the product on the marketplace.';
    const apiResponseDesc =
      'As a response user gets a message that the product has been created and user gets redirected to the product page.';
    const apiBodyDesc =
      'Body contains all needed fields in order to create a product.';
    const apiBadRequestRespDesc =
      'If user tries to upload something else except of base64-encoded PNG picture.';

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
        schema: { $ref: getSchemaPath(WrongPictureException) }
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
      }
    };
  }

  static get UpdateProduct() {
    const ApiModels = [
      ProductNotFoundException,
      ProductUpdatedDto,
      WrongPictureException,
      CategoryNotFoundException,
      PostProductDto
    ];
    const NotFoundRequests = [
      ProductNotFoundException,
      CategoryNotFoundException
    ];

    const apiOperationSum = 'Endpoint is responsible for a product update.';
    const apiResponseDesc =
      'As a response user gets a message that the product has been updated and user gets redirected to the product page.';
    const apiBodyDesc =
      'Body contains all needed fields in order to create a product.';
    const apiNotFoundDesc =
      'Not found exception is thrown in case if product category or product itself is not found.';

    return {
      ApiOperation: { summary: apiOperationSum },
      ApiExtraModels: ApiModels,
      ApiResponse: {
        status: 201,
        description: apiResponseDesc,
        schema: { $ref: getSchemaPath(ProductUpdatedDto) }
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
}
