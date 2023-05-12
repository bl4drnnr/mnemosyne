import { User } from '@models/user.model';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@dto/create-user.dto';
import { UsersService } from '@modules/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserAlreadyExistsException } from '@exceptions/user/user-already-exists.exception';
import { ApiConfigService } from '@shared/config.service';
import * as bcryptjs from 'bcryptjs';
import { UserCreatedDto } from '@dto/user-created.dto';
import { UserDoesntExistException } from '@exceptions/user/user-doesnt-exist.exception';
import { WrongCredentialsException } from '@exceptions/user/wrong-credentials.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService
  ) {}

  async login(payload: CreateUserDto) {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user) throw new UserDoesntExistException();

    const passwordEquals = await bcryptjs.compare(
      user.password,
      payload.password
    );

    if (!passwordEquals) throw new WrongCredentialsException();

    return this.generateToken(user);
  }

  async registration(payload: CreateUserDto) {
    const existingUser = await this.userService.getUserByEmail(payload.email);
    if (existingUser) throw new UserAlreadyExistsException();

    const hashedPassword = await bcryptjs.hash(
      payload.password,
      this.configService.hashPasswordRounds
    );

    await this.userService.createUser({
      ...payload,
      password: hashedPassword
    });

    return new UserCreatedDto();
  }

  private generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return { token: this.jwtService.sign(payload) };
  }
}
