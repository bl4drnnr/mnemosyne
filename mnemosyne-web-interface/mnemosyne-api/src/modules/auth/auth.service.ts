import * as jwt from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
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
import { TacNotAcceptedException } from '@exceptions/user/tac-not-accepted.exception';
import { EmailService } from '@shared/email.service';
import { UserSettings } from '@models/user-settings.model';
import { LogInUserDto } from '@dto/log-in-user.dto';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { AccountNotConfirmedException } from '@exceptions/account-not-confirmed.exception';
import { AccountNotSecuredException } from '@exceptions/account-not-secured.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
    private readonly emailService: EmailService,
    @InjectModel(Session) private readonly sessionRepository: typeof Session,
    @InjectModel(UserSettings)
    private readonly userSettingsRepository: typeof UserSettings
  ) {}

  async login(payload: LogInUserDto) {
    const trx = await this.sequelize.transaction();

    const user = await this.usersService.getUserByEmail(payload.email);
    if (!user) throw new UserDoesntExistException();

    const passwordEquals = await bcryptjs.compare(
      payload.password,
      user.password
    );

    if (!passwordEquals) throw new WrongCredentialsException();

    const registrationHash = user.confirmationHashes.find(
      (hash) => hash.confirmationType === 'REGISTRATION'
    );
    if (!registrationHash.confirmed) throw new AccountNotConfirmedException();

    if (!user.userSettings.phone || !user.userSettings.twoFaToken)
      throw new AccountNotSecuredException();

    const { _rt, _at } = await this.generateTokens({ user, trx });

    await trx.commit();

    return { _rt, _at };
  }

  async registration(payload: CreateUserDto) {
    const trx = await this.sequelize.transaction();

    const existingUser = await this.usersService.getUserByEmail(payload.email);

    if (existingUser) throw new UserAlreadyExistsException();
    if (!payload.tac) throw new TacNotAcceptedException();

    const hashedPassword = await bcryptjs.hash(
      payload.password,
      this.configService.hashPasswordRounds
    );

    const createdUser = await this.usersService.createUser({
      payload: {
        ...payload,
        password: hashedPassword
      },
      trx
    });

    const confirmationHash = crypto.randomBytes(20).toString('hex');

    await this.emailService.sendVerificationEmail({
      payload: {
        confirmationHash,
        confirmationType: 'REGISTRATION',
        userId: createdUser.id,
        email: createdUser.email
      },
      trx
    });

    await this.userSettingsRepository.create(
      {
        userId: createdUser.id
      },
      { transaction: trx }
    );

    await trx.commit();

    return new UserCreatedDto();
  }

  async logout({ userId }: { userId: string }) {
    await this.sessionRepository.destroy({ where: { userId } });

    return new LoggedOutDto();
  }

  async refreshToken({ refreshToken }: { refreshToken: string }) {
    const trx = await this.sequelize.transaction();

    if (!refreshToken) throw new CorruptedTokenException();

    const payload: { id: string } = this.verifyToken({ token: refreshToken });

    const token = await this.getTokenById(payload.id);

    if (!token) throw new InvalidTokenException();

    const user = await this.usersService.getUserById(token.userId);

    const { _at, _rt } = await this.generateTokens({ user, trx });

    await trx.commit();

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

  private async updateRefreshToken({
    userId,
    tokenId,
    trx
  }: {
    userId: string;
    tokenId: string;
    trx: Transaction;
  }) {
    const currentSession = await this.sessionRepository.findOne({
      where: { userId }
    });

    if (currentSession) {
      await this.sessionRepository.destroy({
        where: { id: currentSession.id },
        transaction: trx
      });
    }

    await this.sessionRepository.create(
      {
        userId,
        tokenId
      },
      { transaction: trx }
    );
  }

  private async generateTokens({
    user,
    trx
  }: {
    user: User;
    trx: Transaction;
  }) {
    const accessToken = this.generateAccessToken({
      roles: user.roles.map((role) => role.value),
      userId: user.id
    });
    const refreshToken = this.generateRefreshToken();

    await this.updateRefreshToken({
      userId: user.id,
      tokenId: refreshToken.id,
      trx
    });

    return { _at: accessToken, _rt: refreshToken.token };
  }

  private async getTokenById(tokenId: string) {
    return this.sessionRepository.findOne({
      where: { tokenId }
    });
  }
}
