import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@dto/create-user.dto';
import { UsersService } from '@modules/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserAlreadyExistsException } from '@exceptions/user/user-already-exists.exception';
import { ApiConfigService } from '@shared/config.service';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService
  ) {}

  login(payload: CreateUserDto) {
    //
  }

  async registration(payload: CreateUserDto) {
    const existingUser = await this.userService.getUserByEmail(payload.email);
    if (existingUser) throw new UserAlreadyExistsException();

    const hashedPassword = await bcryptjs.hash(
      payload.password,
      this.configService.hashPasswordRounds
    );

    return await this.userService.createUser({
      ...payload,
      password: hashedPassword
    });
  }
}
