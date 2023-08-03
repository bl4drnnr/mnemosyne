import * as node2fa from 'node-2fa';
import * as jwt from 'jsonwebtoken';
import * as bcryptjs from 'bcryptjs';
import * as crypto from 'crypto';
import * as uuid from 'uuid';
import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '@modules/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserAlreadyExistsException } from '@exceptions/user-already-exists.exception';
import { ApiConfigService } from '@shared/config.service';
import { UserCreatedDto } from '@dto/user-created.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Session } from '@models/session.model';
import { CorruptedTokenException } from '@exceptions/corrupted-token.exception';
import { InvalidTokenException } from '@exceptions/invalid-token.exception';
import { ExpiredTokenException } from '@exceptions/expired-token.exception';
import { LoggedOutDto } from '@dto/logged-out.dto';
import { TacNotAcceptedException } from '@exceptions/tac-not-accepted.exception';
import { EmailService } from '@shared/email.service';
import { Sequelize } from 'sequelize-typescript';
import { AccountNotConfirmedException } from '@exceptions/account-not-confirmed.exception';
import { MfaRequiredDto } from '@dto/mfa-required.dto';
import { WrongCodeException } from '@exceptions/wrong-code.exception';
import { SmsExpiredException } from '@exceptions/sms-expired.exception';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';
import { PhoneService } from '@shared/phone.service';
import { CONFIRMATION_TYPE } from '@interfaces/confirmation-type.types';
import { RecoveryKeysNotSetDto } from '@dto/recovery-keys-not-set.dto';
import { TimeService } from '@shared/time.service';
import { LoginInterface } from '@interfaces/login.interface';
import { RegistrationInterface } from '@interfaces/registration.interface';
import { LogoutInterface } from '@interfaces/logout.interface';
import { RefreshTokenInterface } from '@interfaces/refresh-token.interface';
import { CheckMfaStatusInterface } from '@interfaces/check-mfa-status.interface';
import { VerifyTokenInterface } from '@interfaces/verify-token.interface';
import { GenerateAccessTokenInterface } from '@interfaces/generate-access-token.interface';
import { UpdateRefreshTokenInterface } from '@interfaces/update-refresh-token.interface';
import { GenerateTokensInterface } from '@interfaces/generate-tokens.interface';
import { GetTokenInterface } from '@interfaces/get-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
    private readonly phoneService: PhoneService,
    private readonly timeService: TimeService,
    @Inject(forwardRef(() => EmailService))
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectModel(Session) private readonly sessionRepository: typeof Session
  ) {}

  async login({ payload, trx }: LoginInterface) {
    const { email, password, mfaCode, phoneCode } = payload;

    const {
      id: userId,
      confirmationHashes,
      isMfaSet,
      userSettings,
      roles
    } = await this.usersService.verifyUserCredentials({
      email,
      password,
      trx
    });

    const registrationHash = confirmationHashes.find(
      (hash) => hash.confirmationType === CONFIRMATION_TYPE.REGISTRATION
    );

    const isAccConfirmed = registrationHash.confirmed;
    const isRecoverySetUp = userSettings.recoveryKeysFingerprint;

    if (!isAccConfirmed) throw new AccountNotConfirmedException();

    if (!isMfaSet) return new MfaNotSetDto();

    if (!isRecoverySetUp) return new RecoveryKeysNotSetDto();

    try {
      const mfaStatusResponse = await this.checkUserMfaStatus({
        mfaCode,
        phoneCode,
        userSettings,
        userId,
        trx
      });

      if (mfaStatusResponse) return mfaStatusResponse;
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }

    const { _rt, _at } = await this.generateTokens({ userId, roles, trx });

    return { _rt, _at };
  }

  async registration({ payload, trx }: RegistrationInterface) {
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

    const {
      id: userId,
      email,
      firstName,
      lastName
    } = await this.usersService.createUser({
      payload: {
        ...payload,
        password: hashedPassword
      },
      trx
    });

    const confirmationHash = crypto.randomBytes(20).toString('hex');

    await this.emailService.sendRegistrationConfirmationEmail({
      payload: {
        to: email,
        confirmationType: CONFIRMATION_TYPE.REGISTRATION,
        confirmationHash,
        userId
      },
      userInfo: {
        firstName,
        lastName
      },
      language: payload.language,
      trx
    });

    await this.usersService.createUserSettings({ userId, trx });

    return new UserCreatedDto();
  }

  async logout({ userId, trx }: LogoutInterface) {
    await this.sessionRepository.destroy({
      where: { userId },
      transaction: trx
    });

    return new LoggedOutDto();
  }

  async refreshToken({ refreshToken, trx }: RefreshTokenInterface) {
    if (!refreshToken) throw new CorruptedTokenException();

    const { id: tokenId }: { id: string } = this.verifyToken({
      token: refreshToken
    });

    const token = await this.getTokenById({ tokenId, trx });

    if (!token) throw new InvalidTokenException();

    const { id: userId, roles } = await this.usersService.getUserById({
      id: token.userId,
      trx
    });

    const { _at, _rt } = await this.generateTokens({ userId, roles, trx });

    return { _at, _rt };
  }

  async checkUserMfaStatus({
    mfaCode,
    phoneCode,
    userSettings,
    userId,
    language,
    trx
  }: CheckMfaStatusInterface) {
    const {
      twoFaToken: userTwoFaToken,
      phoneCode: userPhoneCode,
      codeSentAt: phoneCodeSentAt,
      phone
    } = userSettings;

    if (!mfaCode && userTwoFaToken && !phoneCode && phone) {
      await this.phoneService.verifyAndResendSmsCode({
        language,
        userId,
        phone
      });
      return new MfaRequiredDto();
    }

    if (!mfaCode && userTwoFaToken)
      return new MfaRequiredDto('two-fa-required');

    if (!phoneCode && phone) {
      await this.phoneService.verifyAndResendSmsCode({
        language,
        userId,
        phone
      });
      return new MfaRequiredDto('phone-required');
    }

    if (phoneCode && phone) {
      if (userPhoneCode !== phoneCode) throw new WrongCodeException();

      const isWithinFiveMinutes = this.timeService.isWithinTimeframe({
        time: phoneCodeSentAt,
        seconds: 300
      });

      if (userPhoneCode === phoneCode && !isWithinFiveMinutes)
        throw new SmsExpiredException();

      await this.usersService.updateUserSettings({
        payload: {
          phoneCode: null,
          codeSentAt: null
        },
        userId,
        trx
      });
    }

    if (mfaCode && userTwoFaToken) {
      const delta = node2fa.verifyToken(userTwoFaToken, mfaCode);

      if (!delta || (delta && delta.delta !== 0))
        throw new WrongCodeException();
    }
  }

  private verifyToken({ token }: VerifyTokenInterface) {
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

  private generateAccessToken({ userId, roles }: GenerateAccessTokenInterface) {
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
  }: UpdateRefreshTokenInterface) {
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
    roles,
    userId,
    trx: transaction
  }: GenerateTokensInterface) {
    const _at = this.generateAccessToken({
      roles: roles.map((role) => role.value),
      userId
    });
    const { id: tokenId, token: _rt } = this.generateRefreshToken();

    await this.updateRefreshToken({
      userId,
      tokenId,
      trx: transaction
    });

    return { _at, _rt };
  }

  private async getTokenById({ tokenId, trx: transaction }: GetTokenInterface) {
    return this.sessionRepository.findOne({
      where: { tokenId },
      transaction
    });
  }
}
