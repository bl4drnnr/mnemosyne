import * as jwt from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';
import * as uuid from 'uuid';
import { User } from '@models/user.model';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@dto/create-user.dto';
import { UsersService } from '@modules/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserAlreadyExistsException } from '@exceptions/user/user-already-exists.exception';
import { ApiConfigService } from '@shared/config.service';
import { UserCreatedDto } from '@dto/user-created.dto';
import { UserDoesntExistException } from '@exceptions/user/user-doesnt-exist.exception';
import { WrongCredentialsException } from '@exceptions/user/wrong-credentials.exception';
import { InjectModel } from '@nestjs/sequelize';
import { Session } from '@models/session.model';
import { CorruptedTokenException } from '@exceptions/auth/corrupted-token.exception';
import { InvalidTokenException } from '@exceptions/auth/invalid-token.exception';
import { ExpiredTokenException } from '@exceptions/auth/expired-token.exception';
import { LoggedOutDto } from '@dto/logged-out.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
    @InjectModel(Session) private readonly sessionRepository: typeof Session
  ) {}

  async login(payload: CreateUserDto) {
    const user = await this.usersService.getUserByEmail(payload.email);
    if (!user) throw new UserDoesntExistException();

    const passwordEquals = await bcryptjs.compare(
      payload.password,
      user.password
    );

    if (!passwordEquals) throw new WrongCredentialsException();

    return this.generateTokens(user);
  }

  async registration(payload: CreateUserDto) {
    const existingUser = await this.usersService.getUserByEmail(payload.email);
    if (existingUser) throw new UserAlreadyExistsException();

    const hashedPassword = await bcryptjs.hash(
      payload.password,
      this.configService.hashPasswordRounds
    );

    await this.usersService.createUser({
      ...payload,
      password: hashedPassword
    });

    return new UserCreatedDto();
  }

  async logout({ userId }: { userId: string }) {
    await this.sessionRepository.destroy({ where: { userId } });
    return new LoggedOutDto();
  }

  async refreshToken({ refreshToken }: { refreshToken: string }) {
    if (!refreshToken) throw new CorruptedTokenException();

    const payload: { id: string } = this.verifyToken({ token: refreshToken });

    const token = await this.getTokenById(payload.id);

    if (!token) throw new InvalidTokenException();

    const user = await this.usersService.getUserById(token.userId);

    const { _at, _rt } = await this.generateTokens(user);

    return { _at, _rt };
  }

  private verifyToken({ token }: { token: string }) {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.jwtAuthConfig.secret
      });
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError)
        throw new ExpiredTokenException();
      else if (error instanceof jwt.JsonWebTokenError)
        throw new InvalidTokenException();
    }
  }

  private generateAccessToken({
    userId,
    roles
  }: {
    userId: string;
    roles: Array<string>;
  }) {
    const payload = { roles, userId, type: 'access' };

    const options = {
      expiresIn: this.configService.jwtAuthConfig.accessExpiresIn,
      secret: this.configService.jwtAuthConfig.secret
    };

    return this.jwtService.sign(payload, options);
  }

  private generateRefreshToken() {
    const id = uuid.v4();
    const payload = { id, type: 'refresh' };
    const options = {
      expiresIn: this.configService.jwtAuthConfig.refreshExpiresIn,
      secret: this.configService.jwtAuthConfig.secret
    };

    return { id, token: this.jwtService.sign(payload, options) };
  }

  private async updateRefreshToken(refreshTokenPayload: {
    userId: string;
    tokenId: string;
  }) {
    const currentSession = await this.sessionRepository.findOne({
      where: { userId: refreshTokenPayload.userId }
    });

    if (currentSession) {
      await this.sessionRepository.destroy({
        where: { id: currentSession.id }
      });
    }

    await this.sessionRepository.create({
      ...refreshTokenPayload
    });
  }

  private async generateTokens({ id, roles }: User) {
    const accessToken = this.generateAccessToken({
      roles: roles.map((role) => role.value),
      userId: id
    });
    const refreshToken = this.generateRefreshToken();

    await this.updateRefreshToken({
      userId: id,
      tokenId: refreshToken.id
    });

    return { _at: accessToken, _rt: refreshToken.token };
  }

  private async getTokenById(tokenId: string) {
    return this.sessionRepository.findOne({
      where: { tokenId }
    });
  }
}