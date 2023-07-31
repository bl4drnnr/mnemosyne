import { S3 } from 'aws-sdk';
import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs';
import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { CreateUserDto } from '@dto/create-user.dto';
import { RolesService } from '@modules/roles.service';
import { Transaction } from 'sequelize';
import { UserSettings } from '@models/user-settings.model';
import { ForgotPasswordDto } from '@dto/forgot-password.dto';
import { EmailService } from '@shared/email.service';
import { Sequelize } from 'sequelize-typescript';
import { ResetUserPasswordDto } from '@dto/reset-user-password.dto';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { ApiConfigService } from '@shared/config.service';
import { AuthService } from '@modules/auth.service';
import { PasswordResetDto } from '@dto/password-reset.dto';
import { ResetPasswordEmailDto } from '@dto/reset-password-email.dto';
import { PreviousPasswordException } from '@exceptions/previous-password.exception';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { UploadPhotoDto } from '@dto/upload-photo.dto';
import { WrongPictureException } from '@exceptions/wrong-picture.exception';
import { PhotoUploadedDto } from '@dto/photo-uploaded.dto';
import { LinkExpiredException } from '@exceptions/link-expired.exception';
import { UpdateUserInfoDto } from '@dto/update-user-info.dto';
import { UserUpdatedDto } from '@dto/user-updated.dto';
import { WrongRecoveryKeysException } from '@exceptions/wrong-recovery-keys.exception';
import { CONFIRMATION_TYPE } from '@interfaces/confirmation-type.interface';
import { TimeService } from '@shared/time.service';
import { WrongTimeframeException } from '@exceptions/wrong-timeframe.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly roleService: RolesService,
    private readonly emailService: EmailService,
    private readonly configService: ApiConfigService,
    private readonly timeService: TimeService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => ConfirmationHashService))
    private readonly confirmationHashService: ConfirmationHashService,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(UserSettings)
    private readonly userSettingsRepository: typeof UserSettings
  ) {}

  async getUserByEmail({
    email,
    trx: transaction
  }: {
    email: string;
    trx?: Transaction;
  }) {
    return await this.userRepository.findOne({
      where: { email },
      include: [{ all: true }],
      transaction
    });
  }

  async createUser({
    payload,
    trx: transaction
  }: {
    payload: CreateUserDto;
    trx?: Transaction;
  }) {
    const defaultRole = await this.roleService.getRoleByValue('AUTH_USER');
    const user = await this.userRepository.create(payload, { transaction });
    await user.$set('roles', [defaultRole.id], { transaction });
    return user;
  }

  async createUserSettings({
    userId,
    trx: transaction
  }: {
    userId: string;
    trx?: Transaction;
  }) {
    return await this.userSettingsRepository.create(
      { userId },
      { transaction }
    );
  }

  async updateUserSettings({
    payload,
    userId,
    trx: transaction
  }: {
    payload: Partial<UserSettings>;
    userId: string;
    trx?: Transaction;
  }) {
    return await this.userSettingsRepository.update(
      {
        ...payload
      },
      { where: { userId }, transaction }
    );
  }

  async updateUser({
    payload,
    userId,
    trx: transaction
  }: {
    payload: Partial<User>;
    userId: string;
    trx?: Transaction;
  }) {
    return await this.userRepository.update(
      {
        ...payload
      },
      { where: { id: userId }, transaction }
    );
  }

  async getUserSettingsByUserId({
    userId,
    trx: transaction
  }: {
    userId: string;
    trx?: Transaction;
  }) {
    return await this.userSettingsRepository.findOne({
      where: { userId },
      transaction
    });
  }

  async getUserById({
    id,
    trx: transaction
  }: {
    id: string;
    trx?: Transaction;
  }) {
    return await this.userRepository.findByPk(id, {
      include: { all: true },
      transaction
    });
  }

  async verifyUserCredentials({
    email,
    password,
    trx: transaction
  }: {
    email: string;
    password: string;
    trx?: Transaction;
  }) {
    const user = await this.getUserByEmail({ email, trx: transaction });
    if (!user) throw new WrongCredentialsException();

    const passwordEquals = await bcryptjs.compare(password, user.password);
    if (!passwordEquals) throw new WrongCredentialsException();

    return user;
  }

  async forgotPassword({
    payload,
    trx
  }: {
    payload: ForgotPasswordDto;
    trx?: Transaction;
  }) {
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
      transaction: trx
    });

    if (!user) return new ResetPasswordEmailDto();

    const userLastPasswordReset =
      await this.confirmationHashService.getUserLastPasswordReset({
        userId: user.id,
        trx
      });

    if (userLastPasswordReset) {
      const isWithinThreeMinutes = this.timeService.isWithinTimeframe({
        time: userLastPasswordReset.createdAt,
        seconds: 180
      });

      if (isWithinThreeMinutes) throw new WrongTimeframeException();
    }

    const forgotPasswordHash = crypto.randomBytes(20).toString('hex');

    await this.emailService.sendForgotPasswordEmail({
      payload: {
        confirmationHash: forgotPasswordHash,
        confirmationType: CONFIRMATION_TYPE.FORGOT_PASSWORD,
        userId: user.id,
        email: user.email
      },
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName
      },
      language: payload.language,
      trx
    });

    return new ResetPasswordEmailDto();
  }

  async resetUserPassword({
    payload,
    trx
  }: {
    payload: ResetUserPasswordDto;
    trx?: Transaction;
  }) {
    const { password, hash, phoneCode, mfaCode } = payload;

    const forgotPasswordHash =
      await this.confirmationHashService.getUserByConfirmationHash({
        confirmationHash: hash
      });

    if (forgotPasswordHash && !password) return;

    const { createdAt } =
      await this.confirmationHashService.getConfirmationHash({
        confirmationHash: hash,
        trx
      });

    const isWithinDay = this.timeService.isWithinTimeframe({
      time: createdAt,
      seconds: 86400
    });

    if (!isWithinDay) throw new LinkExpiredException();

    const user = await this.userRepository.findByPk(forgotPasswordHash.userId, {
      transaction: trx,
      include: [{ all: true }]
    });

    try {
      const mfaStatusResponse = await this.authService.checkUserMfaStatus({
        mfaCode,
        phoneCode,
        userSettings: user.userSettings,
        userId: user.id,
        trx
      });

      if (mfaStatusResponse) return mfaStatusResponse;
    } catch (e: any) {
      throw new HttpException(e.response.message, e.status);
    }

    const hashedPassword = await bcryptjs.hash(
      password,
      this.configService.hashPasswordRounds
    );

    const isPreviousPassword = await bcryptjs.compare(
      hashedPassword,
      user.password
    );

    if (isPreviousPassword) throw new PreviousPasswordException();

    await this.updateUser({
      payload: { password: hashedPassword },
      userId: forgotPasswordHash.userId,
      trx
    });

    return new PasswordResetDto();
  }

  async uploadUserPhoto({
    payload,
    userId
  }: {
    payload: UploadPhotoDto;
    userId: string;
  }) {
    const { accessKeyId, secretAccessKey, bucketName } =
      this.configService.awsSdkCredentials;

    const s3 = new S3({ accessKeyId, secretAccessKey });

    const base64Data = Buffer.from(
      payload.userPhoto.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    const type = payload.userPhoto.split(';')[0].split('/')[1];

    if (type !== 'png') throw new WrongPictureException();

    const userIdHash = crypto.createHash('md5').update(userId).digest('hex');

    const params = {
      Bucket: bucketName,
      Key: `users-profile-pictures/${userIdHash}.${type}`,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`
    };

    await s3.upload(params).promise();

    return new PhotoUploadedDto();
  }

  async getUserInfo({ userId, trx }: { userId: string; trx?: Transaction }) {
    const { accessKeyId, secretAccessKey, bucketName } =
      this.configService.awsSdkCredentials;

    const s3 = new S3({ accessKeyId, secretAccessKey });

    const userIdHash = crypto.createHash('md5').update(userId).digest('hex');

    let isProfilePicPresent = true;

    try {
      await s3
        .headObject({
          Bucket: bucketName,
          Key: `users-profile-pictures/${userIdHash}.png`
        })
        .promise();
    } catch (e) {
      isProfilePicPresent = false;
    }

    const userData = await this.getUserById({ id: userId, trx });

    return {
      userId: userIdHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      location: userData.location,
      company: userData.company,
      website: userData.website,
      email: userData.email,
      isProfilePicPresent
    };
  }

  async getUserSecuritySettings({
    userId,
    trx
  }: {
    userId: string;
    trx?: Transaction;
  }) {
    const { userSettings, email } = await this.getUserById({
      id: userId,
      trx
    });

    const passwordCanBeChanged = userSettings.passwordChanged
      ? this.timeService.isWithinTimeframe({
          time: userSettings.passwordChanged,
          seconds: 86400
        })
      : true;

    const emailChanged = !!userSettings.emailChanged;
    const isTwoFaSetUp = !!userSettings.twoFaToken;
    const isSetUp = !!userSettings.phone;
    const twoLastDigit = !!userSettings.phone
      ? userSettings.phone.slice(-2)
      : null;

    return {
      phoneStatus: { isSetUp, twoLastDigit },
      passwordCanBeChanged,
      emailChanged,
      isTwoFaSetUp,
      email
    };
  }

  async updateUserInfo({
    userId,
    payload,
    trx
  }: {
    userId: string;
    payload: UpdateUserInfoDto;
    trx?: Transaction;
  }) {
    await this.updateUser({ payload, userId, trx });

    return new UserUpdatedDto();
  }

  async getUserByRecoveryKeysFingerprint({
    recoveryKeysFingerprint,
    trx: transaction
  }: {
    recoveryKeysFingerprint: string;
    trx?: Transaction;
  }) {
    const userSettings = await this.userSettingsRepository.findOne({
      where: { recoveryKeysFingerprint },
      transaction
    });

    if (!userSettings) throw new WrongRecoveryKeysException();

    return this.getUserById({ id: userSettings.userId, trx: transaction });
  }

  async deleteUserAccount({
    userId,
    trx
  }: {
    userId: string;
    trx?: Transaction;
  }) {
    // @TODO Think about either make it soft or hard delete
  }
}
