import * as crypto from 'crypto';
import * as bcryptjs from 'bcryptjs';
import * as dayjs from 'dayjs';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable
} from '@nestjs/common';
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
import { ConfirmationHash } from '@models/confirmation-hash.model';

@Injectable()
export class UsersService {
  constructor(
    private readonly sequelize: Sequelize,
    private readonly roleService: RolesService,
    private readonly emailService: EmailService,
    private readonly configService: ApiConfigService,
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

  async changeSecurityComplianceStatus({
    userId,
    isSecurityCompliant,
    trx: transaction
  }: {
    userId: string;
    isSecurityCompliant: boolean;
    trx?: Transaction;
  }) {
    return await this.userRepository.update(
      {
        isSecurityCompliant
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

  async forgotPassword({
    payload,
    trx
  }: {
    payload: ForgotPasswordDto;
    trx: Transaction;
  }) {
    const user = await this.userRepository.findOne({
      where: { email: payload.email },
      transaction: trx
    });

    if (!user) return new ResetPasswordEmailDto();

    const userLastPasswordReset =
      (await this.confirmationHashService.getUserConfirmationHashes({
        userId: user.id,
        getOne: true
      })) as ConfirmationHash;

    const threeMinutesAgo = dayjs().subtract(3, 'minutes');

    if (dayjs(userLastPasswordReset.createdAt) < threeMinutesAgo)
      throw new BadRequestException();

    const forgotPasswordHash = crypto.randomBytes(20).toString('hex');

    await this.emailService.sendVerificationEmail({
      payload: {
        confirmationHash: forgotPasswordHash,
        confirmationType: 'FORGOT_PASSWORD',
        userId: user.id,
        email: user.email
      },
      trx
    });

    return new ResetPasswordEmailDto();
  }

  async resetUserPassword({
    payload,
    trx
  }: {
    payload: ResetUserPasswordDto;
    trx: Transaction;
  }) {
    const { password, hash, phoneCode, mfaCode } = payload;

    const forgotPasswordHash =
      await this.confirmationHashService.getUserByConfirmationHash({
        confirmationHash: hash
      });

    if (forgotPasswordHash && !password) return;

    const user = await this.userRepository.findByPk(forgotPasswordHash.userId, {
      transaction: trx
    });

    this.authService.checkUserMfaStatus({
      mfaCode,
      phoneCode,
      userSettings: user.userSettings
    });

    const hashedPassword = await bcryptjs.hash(
      password,
      this.configService.hashPasswordRounds
    );

    await this.updateUser({
      payload: { password: hashedPassword },
      userId: forgotPasswordHash.userId,
      trx
    });

    return new PasswordResetDto();
  }
}
