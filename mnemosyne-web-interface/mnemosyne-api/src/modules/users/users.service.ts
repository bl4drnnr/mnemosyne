import { S3 } from 'aws-sdk';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { RolesService } from '@modules/roles.service';
import { UserSettings } from '@models/user-settings.model';
import { EmailService } from '@shared/email.service';
import { ConfirmationHashService } from '@modules/confirmation-hash.service';
import { ApiConfigService } from '@shared/config.service';
import { ResetPasswordEmailDto } from '@dto/reset-password-email.dto';
import { WrongCredentialsException } from '@exceptions/wrong-credentials.exception';
import { WrongPictureException } from '@exceptions/wrong-picture.exception';
import { PhotoUploadedDto } from '@dto/photo-uploaded.dto';
import { UserUpdatedDto } from '@dto/user-updated.dto';
import { WrongRecoveryKeysException } from '@exceptions/wrong-recovery-keys.exception';
import { Confirmation } from '@interfaces/confirmation-type.enum';
import { TimeService } from '@shared/time.service';
import { WrongTimeframeException } from '@exceptions/wrong-timeframe.exception';
import { PasswordChangedException } from '@exceptions/password-changed.exception';
import { GetUserByEmailInterface } from '@interfaces/get-user-by-email.interface';
import { CreateUserInterface } from '@interfaces/create-user.interface';
import { CreateUserSettingsInterface } from '@interfaces/create-user-settings.interface';
import { UpdateUserSettingsInterface } from '@interfaces/update-user-settings.interface';
import { UpdateUserInterface } from '@interfaces/update-user.interface';
import { GetUserSettingsInterface } from '@interfaces/get-user-settings.interface';
import { GetUserByIdInterface } from '@interfaces/get-user-by-id.interface';
import { VerifyUserCredentialsInterface } from '@interfaces/verify-user-credentials.interface';
import { ForgotPasswordInterface } from '@interfaces/forgot-password.interface';
import { UploadPhotoInterface } from '@interfaces/upload-photo.interface';
import { GetUserInfoInterface } from '@interfaces/get-user-info.interface';
import { GetUserSecuritySettingsInterface } from '@interfaces/get-user-security-settings.interface';
import { UpdateUserInfoInterface } from '@interfaces/update-user-info.interface';
import { GetUserByRecoveryKeysInterface } from '@interfaces/get-user-by-recovery-keys.interface';
import { DeleteUserAccountInterface } from '@interfaces/delete-user-account.interface';
import { CryptographicService } from '@shared/cryptographic.service';
import { CryptoHashAlgorithm } from '@interfaces/crypto-hash-algorithm.enum';
import { Roles } from '@interfaces/roles.enum';
import { UserDataNotSetDto } from '@dto/user-data-not-set.dto';
import { PasswordNotSetDto } from '@dto/password-not-set.dto';
import { MfaNotSetDto } from '@dto/mfa-not-set.dto';
import { RecoveryKeysNotSetDto } from '@dto/recovery-keys-not-set.dto';
import { CompanyAccountConfirmedDto } from '@dto/company-account-confirmed.dto';
import { CreateAccFromScratchInterface } from '@interfaces/create-acc-from-scratch.interface';
import { CompanyService } from '@modules/company.service';
import { CompanyMemberAccConfirmedDto } from '@dto/company-member-acc-confirmed.dto';
import { GetUserInfoResponseDto } from '@dto/get-user-info-response.dto';
import { GetUserSecResponseDto } from '@dto/get-user-sec-response.dto';
import { GetUserByPhoneInterface } from '@interfaces/get-user-by-phone.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly cryptographicService: CryptographicService,
    private readonly roleService: RolesService,
    private readonly emailService: EmailService,
    private readonly configService: ApiConfigService,
    private readonly timeService: TimeService,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
    @Inject(forwardRef(() => ConfirmationHashService))
    private readonly confirmationHashService: ConfirmationHashService,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(UserSettings)
    private readonly userSettingsRepository: typeof UserSettings
  ) {}

  async getUserByEmail({ email, trx: transaction }: GetUserByEmailInterface) {
    return await this.userRepository.findOne({
      rejectOnEmpty: undefined,
      where: { email },
      include: [{ all: true }],
      transaction
    });
  }

  async createUser({
    payload,
    role = Roles.DEFAULT,
    trx: transaction
  }: CreateUserInterface) {
    const defaultRole = await this.roleService.getRoleByValue(role);
    const user = await this.userRepository.create(payload, { transaction });
    await user.$add('roles', [defaultRole.id], { transaction });
    await this.createUserSettings({ userId: user.id, trx: transaction });
    return user;
  }

  async updateUserSettings({
    payload,
    userId,
    trx: transaction
  }: UpdateUserSettingsInterface) {
    await this.userSettingsRepository.update(
      {
        ...payload
      },
      { returning: undefined, where: { userId }, transaction }
    );
  }

  async updateUser({ payload, userId, trx: transaction }: UpdateUserInterface) {
    await this.userRepository.update(
      {
        ...payload
      },
      { returning: undefined, where: { id: userId }, transaction }
    );
  }

  async getUserSettingsByUserId({
    userId,
    trx: transaction
  }: GetUserSettingsInterface) {
    return await this.userSettingsRepository.findOne({
      rejectOnEmpty: undefined,
      where: { userId },
      transaction
    });
  }

  async getUserById({ id, trx: transaction }: GetUserByIdInterface) {
    return await this.userRepository.findByPk(id, {
      include: { all: true },
      transaction
    });
  }

  async getUserByPhone({ phone, trx: transaction }: GetUserByPhoneInterface) {
    return await this.userSettingsRepository.findOne({
      rejectOnEmpty: undefined,
      where: { phone },
      transaction
    });
  }

  async verifyUserCredentials({
    email,
    password,
    trx
  }: VerifyUserCredentialsInterface) {
    const user = await this.getUserByEmail({ email, trx });

    if (!user || !user.password) throw new WrongCredentialsException();

    const passwordEquals = await this.cryptographicService.comparePasswords({
      dataToCompare: password,
      hash: user.password
    });
    if (!passwordEquals) throw new WrongCredentialsException();

    return user;
  }

  async forgotPassword({ payload, trx }: ForgotPasswordInterface) {
    const { language } = payload;

    const user = await this.getUserByEmail({
      email: payload.email,
      trx
    });

    if (!user) return new ResetPasswordEmailDto();

    const { id: userId, email, firstName, lastName, userSettings } = user;

    const isWithinDay = this.timeService.isWithinTimeframe({
      time: userSettings.passwordChanged,
      seconds: 86400
    });

    if (isWithinDay) throw new PasswordChangedException();

    const userLastPasswordResent =
      await this.confirmationHashService.getUserLastPasswordResetHash({
        userId,
        trx
      });

    if (userLastPasswordResent) {
      const isWithinThreeMinutes = this.timeService.isWithinTimeframe({
        time: userLastPasswordResent.createdAt,
        seconds: 180
      });

      if (isWithinThreeMinutes) throw new WrongTimeframeException();
    }

    await this.emailService.sendForgotPasswordEmail({
      payload: {
        to: email,
        confirmationType: Confirmation.FORGOT_PASSWORD,
        userId
      },
      userInfo: {
        firstName,
        lastName
      },
      language,
      trx
    });

    return new ResetPasswordEmailDto();
  }

  async uploadUserPhoto({ payload, userId }: UploadPhotoInterface) {
    const { userPhoto } = payload;

    const { accessKeyId, secretAccessKey, bucketName } =
      this.configService.awsSdkCredentials;

    const s3 = new S3({ accessKeyId, secretAccessKey });

    const base64Data = Buffer.from(
      userPhoto.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    const type = userPhoto.split(';')[0].split('/')[1];

    if (type !== 'png') throw new WrongPictureException();

    const userIdHash = this.cryptographicService.hash({
      data: userId,
      algorithm: CryptoHashAlgorithm.MD5
    });

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

  async getUserInfo({ userId, trx }: GetUserInfoInterface) {
    const { accessKeyId, secretAccessKey, bucketName } =
      this.configService.awsSdkCredentials;

    const s3 = new S3({ accessKeyId, secretAccessKey });

    const userIdHash = this.cryptographicService.hash({
      data: userId,
      algorithm: CryptoHashAlgorithm.MD5
    });

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

    const { firstName, lastName, email } = await this.getUserById({
      id: userId,
      trx
    });

    return new GetUserInfoResponseDto({
      userId: userIdHash,
      firstName,
      lastName,
      email,
      isProfilePicPresent
    });
  }

  async getUserSecuritySettings({
    userId,
    trx
  }: GetUserSecuritySettingsInterface) {
    const {
      userSettings: { passwordChanged, emailChanged, twoFaToken, phone },
      email
    } = await this.getUserById({
      id: userId,
      trx
    });

    const isWithinDay = this.timeService.isWithinTimeframe({
      time: passwordChanged,
      seconds: 86400
    });

    const isTwoFaSetUp = !!twoFaToken;
    const isSetUp = !!phone;
    const passwordCanBeChanged = passwordChanged ? !isWithinDay : true;
    const twoLastDigit = !!phone ? phone.slice(-2) : null;

    return new GetUserSecResponseDto({
      phoneStatus: { isSetUp, twoLastDigit },
      passwordCanBeChanged,
      emailChanged,
      isTwoFaSetUp,
      email
    });
  }

  async updateUserInfo({ userId, payload, trx }: UpdateUserInfoInterface) {
    await this.updateUser({ payload, userId, trx });

    return new UserUpdatedDto();
  }

  async getUserByRecoveryKeysFingerprint({
    recoveryKeysFingerprint,
    trx: transaction
  }: GetUserByRecoveryKeysInterface) {
    const userSettings = await this.userSettingsRepository.findOne({
      rejectOnEmpty: undefined,
      where: { recoveryKeysFingerprint },
      transaction
    });

    if (!userSettings) throw new WrongRecoveryKeysException();

    return this.getUserById({ id: userSettings.userId, trx: transaction });
  }

  async deleteUserAccount({
    userId: id,
    trx: transaction
  }: DeleteUserAccountInterface) {
    return await this.userRepository.destroy({
      where: { id },
      transaction
    });
  }

  async createAccountFromScratch({
    user,
    hash,
    payload,
    trx
  }: CreateAccFromScratchInterface) {
    const { language } = payload;
    const hashType = hash.confirmationType;

    const {
      id: userId,
      password,
      isMfaSet,
      userSettings,
      firstName,
      lastName
    } = user;

    const isRecoverySet = userSettings.recoveryKeysFingerprint;

    const userDataSet = !!firstName && !!lastName;
    const userProvidedData = !!payload.firstName && !!payload.lastName;

    const passwordSet = !!password;
    const userProvidedPassword = !!payload.password;

    if (!userDataSet && !userProvidedData) return new UserDataNotSetDto();

    if (!userDataSet && userProvidedData) {
      await this.updateUserInfo({
        payload: { firstName: payload.firstName, lastName: payload.lastName },
        userId,
        trx
      });
    }

    if (!passwordSet && !userProvidedPassword) return new PasswordNotSetDto();

    if (!passwordSet && userProvidedPassword) {
      const hashedPassword = await this.cryptographicService.hashPassword({
        password: payload.password
      });

      await this.updateUser({
        payload: { password: hashedPassword },
        userId
      });
    }

    const isHashConfirmed = hash.confirmed;

    if (!isHashConfirmed) {
      const ownerRegistrationHash =
        await this.confirmationHashService.getConfirmationHashByUserId({
          userId,
          confirmationType: Confirmation.REGISTRATION,
          trx
        });

      if (!ownerRegistrationHash.confirmed) {
        await this.confirmationHashService.confirmHash({
          hashId: ownerRegistrationHash.id,
          trx
        });
      }

      await this.confirmationHashService.confirmHash({
        hashId: hash.id,
        trx
      });
    }

    if (!isHashConfirmed && hashType === Confirmation.COMPANY_REGISTRATION) {
      await this.companyService.confirmCompanyCreation({
        userId,
        language,
        trx
      });
    } else if (
      !isHashConfirmed &&
      hashType === Confirmation.COMPANY_INVITATION
    ) {
      await this.companyService.confirmCompanyMembership({
        language,
        userId,
        trx
      });
    }

    if (!isMfaSet) return new MfaNotSetDto();

    if (!isRecoverySet) return new RecoveryKeysNotSetDto();

    switch (hashType) {
      case Confirmation.COMPANY_REGISTRATION:
        return new CompanyAccountConfirmedDto();
      case Confirmation.COMPANY_INVITATION:
        return new CompanyMemberAccConfirmedDto();
    }
  }

  private async createUserSettings({
    userId,
    trx: transaction
  }: CreateUserSettingsInterface) {
    return await this.userSettingsRepository.create(
      { userId },
      { transaction }
    );
  }
}
