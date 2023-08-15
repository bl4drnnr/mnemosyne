import { S3 } from 'aws-sdk';
import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs';
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

@Injectable()
export class UsersService {
  constructor(
    private readonly roleService: RolesService,
    private readonly emailService: EmailService,
    private readonly configService: ApiConfigService,
    private readonly timeService: TimeService,
    @Inject(forwardRef(() => ConfirmationHashService))
    private readonly confirmationHashService: ConfirmationHashService,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(UserSettings)
    private readonly userSettingsRepository: typeof UserSettings
  ) {}

  async getUserByEmail({ email, trx: transaction }: GetUserByEmailInterface) {
    return await this.userRepository.findOne({
      where: { email },
      include: [{ all: true }],
      transaction
    });
  }

  async createUser({ payload, trx: transaction }: CreateUserInterface) {
    const defaultRole = await this.roleService.getRoleByValue('DEFAULT');
    const user = await this.userRepository.create(payload, { transaction });
    await user.$set('roles', [defaultRole.id], { transaction });
    return user;
  }

  async createUserSettings({
    userId,
    trx: transaction
  }: CreateUserSettingsInterface) {
    return await this.userSettingsRepository.create(
      { userId },
      { transaction }
    );
  }

  async updateUserSettings({
    payload,
    userId,
    trx: transaction
  }: UpdateUserSettingsInterface) {
    return await this.userSettingsRepository.update(
      {
        ...payload
      },
      { where: { userId }, transaction }
    );
  }

  async updateUser({ payload, userId, trx: transaction }: UpdateUserInterface) {
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
  }: GetUserSettingsInterface) {
    return await this.userSettingsRepository.findOne({
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

  async verifyUserCredentials({
    email,
    password,
    trx: transaction
  }: VerifyUserCredentialsInterface) {
    const user = await this.getUserByEmail({ email, trx: transaction });
    if (!user) throw new WrongCredentialsException();

    const passwordEquals = await bcryptjs.compare(password, user.password);
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

    const confirmationHash = crypto.randomBytes(20).toString('hex');

    await this.emailService.sendForgotPasswordEmail({
      payload: {
        to: email,
        confirmationType: Confirmation.FORGOT_PASSWORD,
        confirmationHash,
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

  async getUserInfo({ userId, trx }: GetUserInfoInterface) {
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

    const { firstName, lastName, email } = await this.getUserById({
      id: userId,
      trx
    });

    return {
      userId: userIdHash,
      firstName,
      lastName,
      email,
      isProfilePicPresent
    };
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

    return {
      phoneStatus: { isSetUp, twoLastDigit },
      passwordCanBeChanged,
      emailChanged,
      isTwoFaSetUp,
      email
    };
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
      where: { recoveryKeysFingerprint },
      transaction
    });

    if (!userSettings) throw new WrongRecoveryKeysException();

    return this.getUserById({ id: userSettings.userId, trx: transaction });
  }

  async deleteUserAccount({ userId, trx }: DeleteUserAccountInterface) {
    // @TODO Think about either make it soft or hard delete
  }
}
