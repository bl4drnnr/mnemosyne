import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UsePipes
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { UsersService } from '@modules/users.service';
import { ForgotPasswordDto } from '@dto/forgot-password.dto';
import { ValidationPipe } from '@pipes/validation.pipe';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { UploadPhotoDto } from '@dto/upload-photo.dto';
import { UpdateUserInfoDto } from '@dto/update-user-info.dto';
import { UsersDocs } from '@docs/users.docs';

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
    @TransactionParam() trx: Transaction
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
  getUserInfo(@UserId() userId: string, @TransactionParam() trx: Transaction) {
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
    @TransactionParam() trx: Transaction
  ) {
    return this.usersService.getUserSecuritySettings({ userId, trx });
  }

  @ApiOperation(UsersDocs.PatchUserInfo.ApiOperation)
  @ApiExtraModels(...UsersDocs.PatchUserInfo.ApiExtraModels)
  @ApiResponse(UsersDocs.PatchUserInfo.ApiResponse)
  @ApiBody(UsersDocs.PatchUserInfo.ApiBody)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Patch('user-info')
  updateUserInfo(
    @UserId() userId: string,
    @TransactionParam() trx: Transaction,
    @Body() payload: UpdateUserInfoDto
  ) {
    return this.usersService.updateUserInfo({
      userId,
      payload,
      trx
    });
  }
}
