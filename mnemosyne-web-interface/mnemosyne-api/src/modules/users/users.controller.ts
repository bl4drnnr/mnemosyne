import {
  Body,
  Controller,
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
import { UsersService } from '@modules/users.service';
import { ForgotPasswordDto } from '@dto/forgot-password.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TrxDecorator } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { UploadPhotoDto } from '@dto/upload-photo.dto';
import { UpdateUserInfoDto } from '@dto/update-user-info.dto';
import { UsersDocs } from '@docs/users.docs';
import { UserInterceptor } from '@interceptors/user.interceptor';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation(UsersDocs.ForgotPassword.ApiOperation)
  @ApiExtraModels(...UsersDocs.ForgotPassword.ApiExtraModels)
  @ApiResponse(UsersDocs.ForgotPassword.ApiResponse)
  @ApiBadRequestResponse(UsersDocs.ForgotPassword.ApiBadRequestResponse)
  @ApiForbiddenResponse(UsersDocs.ForgotPassword.ApiForbiddenResponse)
  @ApiBody(UsersDocs.ForgotPassword.ApiBody)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('forgot-password')
  forgotPassword(
    @Body() payload: ForgotPasswordDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.usersService.forgotPassword({ payload, trx });
  }

  @ApiOperation(UsersDocs.UploadUserPhoto.ApiOperation)
  @ApiExtraModels(...UsersDocs.UploadUserPhoto.ApiExtraModels)
  @ApiResponse(UsersDocs.UploadUserPhoto.ApiResponse)
  @ApiBadRequestResponse(UsersDocs.UploadUserPhoto.ApiBadRequestResponse)
  @ApiBody(UsersDocs.UploadUserPhoto.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('upload-user-photo')
  uploadUserPhoto(@Body() payload: UploadPhotoDto, @UserId() userId: string) {
    return this.usersService.uploadUserPhoto({
      payload,
      userId
    });
  }

  @ApiOperation(UsersDocs.GetUserInfo.ApiOperation)
  @ApiExtraModels(...UsersDocs.GetUserInfo.ApiExtraModels)
  @ApiResponse(UsersDocs.GetUserInfo.ApiResponse)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('user-info')
  getUserInfo(@UserId() userId: string, @TrxDecorator() trx: Transaction) {
    return this.usersService.getUserInfo({ userId, trx });
  }

  @ApiOperation(UsersDocs.GetUserSecurity.ApiOperation)
  @ApiExtraModels(...UsersDocs.GetUserSecurity.ApiExtraModels)
  @ApiResponse(UsersDocs.GetUserSecurity.ApiResponse)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('user-security')
  getUserSecuritySettings(
    @UserId() userId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.usersService.getUserSecuritySettings({ userId, trx });
  }

  @ApiOperation(UsersDocs.UpdateUserInfo.ApiOperation)
  @ApiExtraModels(...UsersDocs.UpdateUserInfo.ApiExtraModels)
  @ApiResponse(UsersDocs.UpdateUserInfo.ApiResponse)
  @ApiBody(UsersDocs.UpdateUserInfo.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('user-info')
  updateUserInfo(
    @UserId() userId: string,
    @Body() payload: UpdateUserInfoDto,
    @TrxDecorator() trx: Transaction
  ) {
    return this.usersService.updateUserInfo({
      userId,
      payload,
      trx
    });
  }

  @ApiOperation(UsersDocs.GetMarketplaceUserById.ApiOperation)
  @ApiExtraModels(...UsersDocs.GetMarketplaceUserById.ApiExtraModels)
  @ApiResponse(UsersDocs.GetMarketplaceUserById.ApiResponse)
  @ApiNotFoundResponse(UsersDocs.GetMarketplaceUserById.ApiNotFoundResponse)
  @ApiQuery(UsersDocs.GetMarketplaceUserById.ApiMarketplaceUserIdQuery)
  @ApiBasicAuth('basicAuth')
  @UseInterceptors(UserInterceptor)
  @Get('marketplace-user')
  getMarketplaceUserById(
    @UserId() loggedUserId: string | undefined,
    @Query('marketplaceUserId') marketplaceUserId: string,
    @TrxDecorator() trx: Transaction
  ) {
    return this.usersService.getMarketplaceUserById({
      loggedUserId,
      marketplaceUserId,
      trx
    });
  }
}
