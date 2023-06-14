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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('login')
  async login(@Body() payload: LogInUserDto, @Res({ passthrough: true }) res) {
    const response = await this.authService.login(payload);

    res.cookie('_rt', response._rt);

    return { _at: response._at };
  }

  @UsePipes(ValidationPipe)
  @Post('registration')
  registration(@Body() payload: CreateUserDto) {
    return this.authService.registration(payload);
  }

  @UseGuards(AuthGuard)
  @Get('logout')
  async logout(@UserId() userId: string, @Res() res) {
    res.clearCookie('_rt');

    const response = await this.authService.logout({ userId });

    return res.status(HttpStatus.OK).json(response);
  }

  @UseGuards(AuthGuard)
  @Get('refresh')
  async refreshTokens(
    @CookieRefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res
  ) {
    const { _rt, _at } = await this.authService.refreshToken({
      refreshToken
    });

    res.cookie('_rt', _rt);

    return { _at };
  }
}
