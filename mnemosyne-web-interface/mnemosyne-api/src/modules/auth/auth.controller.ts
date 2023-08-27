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
  ApiBody,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
  refs
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

  @ApiOperation({ summary: AuthDocs.LoginDocs.OperationDesc })
  @ApiExtraModels(...AuthDocs.LoginDocs.Responses)
  @ApiResponse({
    status: 201,
    description: AuthDocs.LoginDocs.ResponseDesc,
    schema: { oneOf: refs(...AuthDocs.LoginDocs.Responses) }
  })
  @ApiBadRequestResponse({
    description: AuthDocs.LoginDocs.BadRequestDesc,
    schema: { oneOf: refs(...AuthDocs.LoginDocs.BadRequests) }
  })
  @ApiForbiddenResponse({
    description: AuthDocs.LoginDocs.ForbiddenDesc,
    schema: { oneOf: refs(...AuthDocs.LoginDocs.Forbidden) }
  })
  @ApiBody({
    type: AuthDocs.LoginDocs.BodyType,
    description: AuthDocs.LoginDocs.BodyTypeDesc,
    schema: { $ref: getSchemaPath(LogInUserDto) }
  })
  @UsePipes(ValidationPipe)
  @Post('login')
  async login(
    @Body() payload: LogInUserDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.authService.login({ payload, trx });
  }

  @UsePipes(ValidationPipe)
  @Post('registration')
  registration(
    @Body() payload: CreateUserDto,
    @TransactionParam() trx: Transaction
  ) {
    return this.authService.registration({ payload, trx });
  }

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
