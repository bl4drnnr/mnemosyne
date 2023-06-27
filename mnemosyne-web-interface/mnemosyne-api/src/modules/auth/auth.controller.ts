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
import { AuthService } from '@modules/auth/auth.service';
import { CreateUserDto } from '@dto/create-user.dto';
import { AuthGuard } from '@guards/auth.guard';
import { CookieRefreshToken } from '@decorators/cookie-refresh-token.decorator';
import { UserId } from '@decorators/user-id.decorator';
import { ValidationPipe } from '@pipes/validation.pipe';
import { LogInUserDto } from '@dto/log-in-user.dto';
import { MfaRequiredDto } from '@dto/mfa-required.dto';
import { TransactionParam } from '@decorators/transaction.decorator';
import { Transaction } from 'sequelize';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('login')
  async login(
    @Body() payload: LogInUserDto,
    @Res({ passthrough: true }) res,
    @TransactionParam() trx: Transaction
  ) {
    const response = await this.authService.login({ payload, trx });

    if (
      response instanceof MfaRequiredDto ||
      response instanceof MfaNotSetDto
    ) {
      return response;
    } else if (response && '_rt' in response && '_at' in response) {
      res.cookie('_rt', response._rt);

      return { _at: response._at };
    }
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
    @Res() res,
    @TransactionParam() trx: Transaction
  ) {
    res.clearCookie('_rt');

    const response = await this.authService.logout({ userId, trx });

    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(AuthGuard)
  @Get('refresh')
  async refreshTokens(
    @CookieRefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res,
    @TransactionParam() trx: Transaction
  ) {
    const { _rt, _at } = await this.authService.refreshToken({
      refreshToken,
      trx
    });

    res.cookie('_rt', _rt);

    return { _at };
  }
}
