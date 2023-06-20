import * as node2fa from 'node-2fa';
import * as dayjs from 'dayjs';
import * as jwt from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import { User } from '@models/user.model';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
import { LogInUserDto } from '@dto/log-in-user.dto';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { AccountNotConfirmedException } from '@exceptions/account-not-confirmed.exception';
import { MfaRequiredDto } from '@dto/mfa-required.dto';
import { WrongCodeException } from '@exceptions/wrong-code.exception';
import { SmsExpiredException } from '@exceptions/sms-expired.exception';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';
import { UserSettings } from '@models/user-settings.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectModel(Session) private readonly sessionRepository: typeof Session
  ) {}

  async login({ payload, trx }: { payload: LogInUserDto; trx: Transaction }) {
    const user = await this.usersService.getUserByEmail({
      email: payload.email,
      trx
    });
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

    if (!user.isSecurityCompliant) return new MfaNotSetDto();

    const mfaStatusResponse = this.checkUserMfaStatus({
      mfaCode: payload.mfaCode,
      phoneCode: payload.phoneCode,
      userSettings: user.userSettings
    });

    if (mfaStatusResponse) return mfaStatusResponse;

    const { _rt, _at } = await this.generateTokens({ user, trx });

    return { _rt, _at };
  }

  async registration({
    payload,
    trx
  }: {
    payload: CreateUserDto;
    trx: Transaction;
  }) {
    const existingUser = await this.usersService.getUserByEmail({
      email: payload.email,
      trx
    });

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

    await this.usersService.createUserSettings({ userId: createdUser.id, trx });

    return new UserCreatedDto();
  }

  async logout({ userId, trx }: { userId: string; trx: Transaction }) {
    await this.sessionRepository.destroy({
      where: { userId },
      transaction: trx
    });

    return new LoggedOutDto();
  }

  async refreshToken({
    refreshToken,
    trx
  }: {
    refreshToken: string;
    trx: Transaction;
  }) {
    if (!refreshToken) throw new CorruptedTokenException();

    const payload: { id: string } = this.verifyToken({ token: refreshToken });

    const token = await this.getTokenById({ tokenId: payload.id, trx });

    if (!token) throw new InvalidTokenException();

    const user = await this.usersService.getUserById({ id: token.userId, trx });

    const { _at, _rt } = await this.generateTokens({ user, trx });

    return { _at, _rt };
  }

  checkUserMfaStatus({
    mfaCode,
    phoneCode,
    userSettings
  }: {
    mfaCode: string;
    phoneCode: string;
    userSettings: UserSettings;
  }): MfaRequiredDto | void {
    const {
      twoFaToken: userTwoFaToken,
      phoneCode: userPhoneCode,
      codeSentAt: phoneCodeSentAt,
      phone
    } = userSettings;

    if (!mfaCode && userTwoFaToken && !phoneCode && phone)
      return new MfaRequiredDto();

    if (!mfaCode && userTwoFaToken)
      return new MfaRequiredDto('two-fa-required');
    if (!phoneCode && userPhoneCode)
      return new MfaRequiredDto('phone-required');

    if (phoneCode && phone) {
      if (userPhoneCode !== phoneCode) throw new WrongCodeException();

      const fiveMinutesAgo = dayjs().subtract(5, 'minutes');

      if (
        userPhoneCode === phoneCode &&
        dayjs(phoneCodeSentAt) < fiveMinutesAgo
      )
        throw new SmsExpiredException();
    }

    if (mfaCode && userTwoFaToken) {
      const delta = node2fa.verifyToken(userTwoFaToken, mfaCode);

      if (!delta || (delta && delta.delta !== 0))
        throw new WrongCodeException();
    }
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
    trx: transaction
  }: {
    userId: string;
    tokenId: string;
    trx?: Transaction;
  }) {
    const currentSession = await this.sessionRepository.findOne({
      where: { userId },
      transaction
    });

    if (currentSession) {
      await this.sessionRepository.destroy({
        where: { id: currentSession.id },
        transaction
      });
    }

    await this.sessionRepository.create(
      {
        userId,
        tokenId
      },
      { transaction }
    );
  }

  private async generateTokens({
    user,
    trx: transaction
  }: {
    user: User;
    trx?: Transaction;
  }) {
    const accessToken = this.generateAccessToken({
      roles: user.roles.map((role) => role.value),
      userId: user.id
    });
    const refreshToken = this.generateRefreshToken();

    await this.updateRefreshToken({
      userId: user.id,
      tokenId: refreshToken.id,
      trx: transaction
    });

    return { _at: accessToken, _rt: refreshToken.token };
  }

  private async getTokenById({
    tokenId,
    trx: transaction
  }: {
    tokenId: string;
    trx?: Transaction;
  }) {
    return this.sessionRepository.findOne({
      where: { tokenId },
      transaction
    });
  }
}
