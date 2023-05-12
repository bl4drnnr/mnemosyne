import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@modules/auth/auth.service';
import { CreateUserDto } from '@dto/create-user.dto';
import { Roles } from '@decorators/roles.decorator';
import { RoleGuard } from '@guards/role.guard';
import { AuthGuard } from '@guards/auth.guard';

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

  @Roles('ADMIN')
  @UseGuards(AuthGuard, RoleGuard)
  @Post('test')
  test() {
    //
  }
}
