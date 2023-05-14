import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@modules/auth/auth.service';
import { CreateUserDto } from '@dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() payload: CreateUserDto) {
    return this.authService.login(payload);
  }

  @Post('registration')
  registration(@Body() payload: CreateUserDto) {
    return this.authService.registration(payload);
  }
}
