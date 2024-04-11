import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { ProductsService } from '@modules/products.service';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { ProductsDocs } from '@docs/products.docs';
import { UserId } from '@decorators/user-id.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { ValidationPipe } from '@pipes/validation.pipe';
import { PostProductDto } from '@dto/post-product.dto';
import { DeleteProductDto } from '@dto/delete-product.dto';
import { DeleteProductsFromFavoritesDto } from '@dto/delete-products-from-favorites.dto';
import { AddProductToFavoritesDto } from '@dto/add-product-to-favorites.dto';
import { UserInterceptor } from '@interceptors/user.interceptor';
import { Roles } from '@decorators/roles.decorator';
import { RoleGuard } from '@guards/role.guard';
import { CompanyId } from '@decorators/company-id.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation(ProductsDocs.GetProductBySlug.ApiOperation)
  @ApiExtraModels(...ProductsDocs.GetProductBySlug.ApiExtraModels)
  @ApiResponse(ProductsDocs.GetProductBySlug.ApiResponse)
  @ApiNotFoundResponse(ProductsDocs.GetProductBySlug.ApiNotFoundResponse)
  @ApiQuery(ProductsDocs.GetProductBySlug.ApiSlugQuery)
  @ApiBasicAuth('basicAuth')
  @UseInterceptors(UserInterceptor)
  @Get('product')
  getProductBySlug(
    @Query('slug') slug: string,
    @UserId() userId: string | undefined,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.getProductBySlug({ slug, userId, trx });
  }

  @ApiOperation(ProductsDocs.LatestProducts.ApiOperation)
  @ApiExtraModels(...ProductsDocs.LatestProducts.ApiExtraModels)
  @ApiResponse(ProductsDocs.LatestProducts.ApiResponse)
  @ApiBasicAuth('basicAuth')
  @Get('latest-products')
  getLatestProducts(@TrxDecorator() trx: Transaction) {
    return this.productsService.getLatestProducts({ trx });
  }

  @ApiOperation(ProductsDocs.SearchProduct.ApiOperation)
  @ApiExtraModels(...ProductsDocs.SearchProduct.ApiExtraModels)
  @ApiResponse(ProductsDocs.SearchProduct.ApiResponse)
  @ApiBadRequestResponse(ProductsDocs.SearchProduct.ApiBadRequestResponse)
  @ApiNotFoundResponse(ProductsDocs.SearchProduct.ApiNotFoundResponse)
  @ApiQuery(ProductsDocs.SearchProduct.ApiProductQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiPageSizeQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiPageQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiOrderQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiOrderByQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiMinPriceQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiMaxPriceQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiCurrencyQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiCategoryQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiSubcategoryQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiCompanyProductsQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiPrivateProductsQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiMarketplaceUserIdQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiMarketplaceCompanyIdQuery)
  @ApiQuery(ProductsDocs.SearchProduct.ApiCompanyExtendedQuery)
  @ApiBasicAuth('basicAuth')
  @UseInterceptors(UserInterceptor)
  @Get('search-product')
  searchProduct(
    @Query('query') query: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('order') order: string,
    @Query('orderBy') orderBy: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('currency') currency: string,
    @Query('categories') categories: string,
    @Query('subcategories') subcategories: string,
    @Query('companyProducts') companyProducts: string,
    @Query('privateProducts') privateProducts: string,
    @Query('marketplaceUserId') marketplaceUserId: string,
    @Query('marketplaceCompanyId') marketplaceCompanyId: string,
    @Query('companyExtended') companyExtended: string,
    @UserId() userId: string | undefined,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.searchProduct({
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
    });
  }

  @ApiOperation(ProductsDocs.CreateProduct.ApiOperation)
  @ApiExtraModels(...ProductsDocs.CreateProduct.ApiExtraModels)
  @ApiResponse(ProductsDocs.CreateProduct.ApiResponse)
  @ApiBadRequestResponse(ProductsDocs.CreateProduct.ApiBadRequestResponse)
  @ApiForbiddenResponse(ProductsDocs.CreateProduct.ApiForbiddenResponse)
  @ApiBody(ProductsDocs.CreateProduct.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('create-product')
  createProduct(
    @UserId() userId: string,
    @Body() payload: PostProductDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.createProduct({
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(ProductsDocs.GetProductBySlugToEdit.ApiOperation)
  @ApiExtraModels(...ProductsDocs.GetProductBySlugToEdit.ApiExtraModels)
  @ApiResponse(ProductsDocs.GetProductBySlugToEdit.ApiResponse)
  @ApiNotFoundResponse(ProductsDocs.GetProductBySlugToEdit.ApiNotFoundResponse)
  @ApiQuery(ProductsDocs.GetProductBySlugToEdit.ApiSlugQuery)
  @ApiQuery(ProductsDocs.GetProductBySlugToEdit.ApiCompanyEditQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('get-product-by-slug-to-edit')
  getProductBySlugToEdit(
    @CompanyId() companyId: string,
    @UserId() userId: string,
    @Query('slug') slug: string,
    @Query('companyEdit') companyEdit: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.getProductBySlugToEdit({
      companyId,
      userId,
      slug,
      companyEdit,
      trx
    });
  }

  @ApiOperation(ProductsDocs.UpdateProduct.ApiOperation)
  @ApiExtraModels(...ProductsDocs.UpdateProduct.ApiExtraModels)
  @ApiResponse(ProductsDocs.UpdateProduct.ApiResponse)
  @ApiBadRequestResponse(ProductsDocs.UpdateProduct.ApiBadRequestResponse)
  @ApiForbiddenResponse(ProductsDocs.UpdateProduct.ApiForbiddenResponse)
  @ApiNotFoundResponse(ProductsDocs.UpdateProduct.ApiNotFoundResponse)
  @ApiBody(ProductsDocs.UpdateProduct.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('update-product')
  updateProduct(
    @CompanyId() companyId: string,
    @UserId() userId: string,
    @Body() payload: PostProductDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.updateProduct({
      companyId,
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(ProductsDocs.GetUserProducts.ApiOperation)
  @ApiExtraModels(...ProductsDocs.GetUserProducts.ApiExtraModels)
  @ApiResponse(ProductsDocs.GetUserProducts.ApiResponse)
  @ApiBadRequestResponse(ProductsDocs.GetUserProducts.ApiBadRequestResponse)
  @ApiQuery(ProductsDocs.GetUserProducts.ApiPageSizeQuery)
  @ApiQuery(ProductsDocs.GetUserProducts.ApiPageQuery)
  @ApiQuery(ProductsDocs.GetUserProducts.ApiProductQuery)
  @ApiQuery(ProductsDocs.GetUserProducts.ApiOrderQuery)
  @ApiQuery(ProductsDocs.GetUserProducts.ApiOrderByQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('user-products')
  getUserProducts(
    @Query('query') query: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('order') order: string,
    @Query('orderBy') orderBy: string,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.getUserProducts({
      query,
      page,
      pageSize,
      order,
      orderBy,
      userId,
      trx
    });
  }

  @ApiOperation(ProductsDocs.DeleteProduct.ApiOperation)
  @ApiExtraModels(...ProductsDocs.DeleteProduct.ApiExtraModels)
  @ApiResponse(ProductsDocs.DeleteProduct.ApiResponse)
  @ApiNotFoundResponse(ProductsDocs.DeleteProduct.ApiNotFoundResponse)
  @ApiBadRequestResponse(ProductsDocs.DeleteProduct.ApiBadRequestResponse)
  @ApiBody(ProductsDocs.DeleteProduct.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Delete('product')
  deleteProduct(
    @UserId() userId: string,
    @Body() payload: DeleteProductDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.deleteProduct({
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(ProductsDocs.DeleteCompanyProduct.ApiOperation)
  @ApiExtraModels(...ProductsDocs.DeleteCompanyProduct.ApiExtraModels)
  @ApiResponse(ProductsDocs.DeleteCompanyProduct.ApiResponse)
  @ApiNotFoundResponse(ProductsDocs.DeleteCompanyProduct.ApiNotFoundResponse)
  @ApiBadRequestResponse(
    ProductsDocs.DeleteCompanyProduct.ApiBadRequestResponse
  )
  @ApiForbiddenResponse(ProductsDocs.DeleteCompanyProduct.ApiForbiddenResponse)
  @ApiBody(ProductsDocs.DeleteCompanyProduct.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Delete('company-product')
  deleteCompanyProduct(
    @CompanyId() companyId: string,
    @UserId() userId: string,
    @Body() payload: DeleteProductDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.deleteCompanyProduct({
      companyId,
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(ProductsDocs.DeleteProductFromFavorites.ApiOperation)
  @ApiExtraModels(...ProductsDocs.DeleteProductFromFavorites.ApiExtraModels)
  @ApiResponse(ProductsDocs.DeleteProductFromFavorites.ApiResponse)
  @ApiNotFoundResponse(
    ProductsDocs.DeleteProductFromFavorites.ApiNotFoundResponse
  )
  @ApiBody(ProductsDocs.DeleteProductFromFavorites.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Delete('favorites')
  deleteProductFromFavorites(
    @UserId() userId: string,
    @Body() payload: DeleteProductsFromFavoritesDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.deleteProductFromFavorites({
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(ProductsDocs.AddProductToFavorites.ApiOperation)
  @ApiExtraModels(...ProductsDocs.AddProductToFavorites.ApiExtraModels)
  @ApiResponse(ProductsDocs.AddProductToFavorites.ApiResponse)
  @ApiNotFoundResponse(ProductsDocs.AddProductToFavorites.ApiNotFoundResponse)
  @ApiBadRequestResponse(
    ProductsDocs.AddProductToFavorites.ApiBadRequestResponse
  )
  @ApiBody(ProductsDocs.AddProductToFavorites.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Post('favorites')
  addProductToFavorites(
    @UserId() userId: string,
    @Body() payload: AddProductToFavoritesDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.addProductToFavorites({
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(ProductsDocs.GetUserFavoritesProducts.ApiOperation)
  @ApiExtraModels(...ProductsDocs.GetUserFavoritesProducts.ApiExtraModels)
  @ApiResponse(ProductsDocs.GetUserFavoritesProducts.ApiResponse)
  @ApiBadRequestResponse(
    ProductsDocs.GetUserFavoritesProducts.ApiBadRequestResponse
  )
  @ApiQuery(ProductsDocs.GetUserFavoritesProducts.ApiProductQuery)
  @ApiQuery(ProductsDocs.GetUserFavoritesProducts.ApiPageSizeQuery)
  @ApiQuery(ProductsDocs.GetUserFavoritesProducts.ApiPageQuery)
  @ApiQuery(ProductsDocs.GetUserFavoritesProducts.ApiOrderQuery)
  @ApiQuery(ProductsDocs.GetUserFavoritesProducts.ApiOrderByQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('favorites')
  getUserFavoritesProducts(
    @Query('query') query: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('order') order: string,
    @Query('orderBy') orderBy: string,
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.getUserFavoritesProducts({
      query,
      page,
      pageSize,
      order,
      orderBy,
      userId,
      trx
    });
  }

  @ApiOperation(ProductsDocs.GetProductContactEmail.ApiOperation)
  @ApiExtraModels(...ProductsDocs.GetProductContactEmail.ApiExtraModels)
  @ApiResponse(ProductsDocs.GetProductContactEmail.ApiResponse)
  @ApiQuery(ProductsDocs.GetProductContactEmail.ApiProductIdQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('product-contact-email')
  getProductContactEmail(
    @Query('productId') productId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.getProductContactEmail({
      productId,
      trx
    });
  }

  @ApiOperation(ProductsDocs.GetProductContactPhone.ApiOperation)
  @ApiExtraModels(...ProductsDocs.GetProductContactPhone.ApiExtraModels)
  @ApiResponse(ProductsDocs.GetProductContactPhone.ApiResponse)
  @ApiQuery(ProductsDocs.GetProductContactPhone.ApiProductIdQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('product-contact-phone')
  getProductContactPhone(
    @Query('productId') productId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.getProductContactPhone({
      productId,
      trx
    });
  }

  @ApiOperation(ProductsDocs.GetMarketplaceUserStats.ApiOperation)
  @ApiExtraModels(...ProductsDocs.GetMarketplaceUserStats.ApiExtraModels)
  @ApiResponse(ProductsDocs.GetMarketplaceUserStats.ApiResponse)
  @ApiQuery(ProductsDocs.GetMarketplaceUserStats.ApiMarketplaceUserIdQuery)
  @ApiBasicAuth('basicAuth')
  @Get('marketplace-user-statistics')
  getMarketplaceUserStatistics(
    @Query('marketplaceUserId') marketplaceUserId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.getMarketplaceUserStatistics({
      marketplaceUserId,
      trx
    });
  }

  @ApiOperation(ProductsDocs.GetMarketplaceCompanyStats.ApiOperation)
  @ApiExtraModels(...ProductsDocs.GetMarketplaceCompanyStats.ApiExtraModels)
  @ApiResponse(ProductsDocs.GetMarketplaceCompanyStats.ApiResponse)
  @ApiQuery(
    ProductsDocs.GetMarketplaceCompanyStats.ApiMarketplaceCompanyIdQuery
  )
  @ApiBasicAuth('basicAuth')
  @Get('marketplace-company-statistics')
  getCompanyProductsStatistics(
    @Query('companyId') companyId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.getCompanyProductsStatistics({
      companyId,
      trx
    });
  }

  @ApiOperation(ProductsDocs.GetCompanyInternalStatistics.ApiOperation)
  @ApiExtraModels(...ProductsDocs.GetCompanyInternalStatistics.ApiExtraModels)
  @ApiResponse(ProductsDocs.GetCompanyInternalStatistics.ApiResponse)
  @ApiNotFoundResponse(
    ProductsDocs.GetCompanyInternalStatistics.ApiNotFoundResponse
  )
  @ApiForbiddenResponse(
    ProductsDocs.GetCompanyInternalStatistics.ApiForbiddenResponse
  )
  @ApiQuery(ProductsDocs.GetCompanyInternalStatistics.ApiMemberQuery)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @Roles('PRODUCT_MANAGEMENT')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get('marketplace-company-internal-statistics')
  getCompanyInternalStatistics(
    @CompanyId() companyId: string,
    @UserId() userId: string,
    @Query('query') query: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.productsService.getCompanyInternalStatistics({
      companyId,
      userId,
      query,
      trx
    });
  }
}
