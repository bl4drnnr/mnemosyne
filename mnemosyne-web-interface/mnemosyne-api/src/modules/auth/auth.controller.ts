import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
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
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { AuthService } from '@modules/auth/auth.service';
import { CreateUserDto } from '@dto/create-user.dto';
import { AuthGuard } from '@guards/auth.guard';
import { UserId } from '@decorators/user-id.decorator';
import { ValidationPipe } from '@pipes/validation.pipe';
import { LogInUserDto } from '@dto/log-in-user.dto';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { CookieRefreshToken } from '@decorators/cookie-refresh-token.decorator';
import { AuthDocs } from '@docs/auth.docs';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation(AuthDocs.Login.ApiOperation)
  @ApiExtraModels(...AuthDocs.Login.ApiExtraModels)
  @ApiResponse(AuthDocs.Login.ApiResponse)
  @ApiBadRequestResponse(AuthDocs.Login.ApiBadRequestResponse)
  @ApiForbiddenResponse(AuthDocs.Login.ApiForbiddenResponse)
  @ApiBody(AuthDocs.Login.ApiBody)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('login')
  async login(
    @Body() payload: LogInUserDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.authService.login({ payload, trx });
  }

  @ApiOperation(AuthDocs.Registration.ApiOperation)
  @ApiExtraModels(...AuthDocs.Registration.ApiExtraModels)
  @ApiResponse(AuthDocs.Registration.ApiResponse)
  @ApiBadRequestResponse(AuthDocs.Registration.ApiBadRequestResponse)
  @ApiForbiddenResponse(AuthDocs.Registration.ApiForbiddenResponse)
  @ApiBody(AuthDocs.Registration.ApiBody)
  @ApiBasicAuth('basicAuth')
  @UsePipes(ValidationPipe)
  @Post('registration')
  registration(
    @Body() payload: CreateUserDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.authService.registration({ payload, trx });
  }

  @ApiOperation(AuthDocs.Logout.ApiOperation)
  @ApiExtraModels(...AuthDocs.Logout.ApiExtraModels)
  @ApiResponse(AuthDocs.Logout.ApiResponse)
  @ApiBasicAuth('basicAuth')
  @ApiBearerAuth('x-access-token')
  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(
    @UserId() userId: string,
    @Res() res: any,
    @TransactionParam() trx: Transaction
  ) {
    res.clearCookie('_rt');

    const response = await this.authService.logout({ userId, trx });

    return res.status(HttpStatus.OK).json(response);
  }

  @ApiOperation(AuthDocs.RefreshTokens.ApiOperation)
  @ApiExtraModels(...AuthDocs.RefreshTokens.ApiExtraModels)
  @ApiResponse(AuthDocs.RefreshTokens.ApiResponse)
  @ApiBadRequestResponse(AuthDocs.RefreshTokens.ApiBadRequestResponse)
  @ApiUnauthorizedResponse(AuthDocs.RefreshTokens.ApiUnauthorizedResponse)
  @ApiBasicAuth('basicAuth')
  @Get('refresh')
  async refreshTokens(
    @CookieRefreshToken() refreshToken: string,
    @TransactionParam() trx: Transaction
  ) {
    return this.authService.refreshToken({
      refreshToken,
      trx
    });
  }
}
