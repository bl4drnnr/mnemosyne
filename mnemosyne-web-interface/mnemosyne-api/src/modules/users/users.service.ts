import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { CreateUserDto } from '@dto/create-user.dto';
import { RolesService } from '@modules/roles.service';
import { Transaction } from 'sequelize';
import { UserSettings } from '@models/user-settings.model';

@Injectable()
export class UsersService {
  constructor(
    private readonly roleService: RolesService,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectModel(UserSettings)
    private readonly userSettingsRepository: typeof UserSettings
  ) {}

  async changeSecurityComplianceStatus({
    userId,
    isSecurityCompliant
  }: {
    userId: string;
    isSecurityCompliant: boolean;
  }) {
    return await this.userRepository.update(
      {
        isSecurityCompliant
      },
      { where: { id: userId } }
    );
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      include: [{ all: true }]
    });
  }

  async createUser({
    payload,
    trx
  }: {
    payload: CreateUserDto;
    trx: Transaction;
  }) {
    const defaultRole = await this.roleService.getRoleByValue('AUTH_USER');
    const user = await this.userRepository.create(payload, {
      transaction: trx
    });
    await user.$set('roles', [defaultRole.id], { transaction: trx });
    return user;
  }

  async createUserSettings({
    userId,
    trx
  }: {
    userId: string;
    trx: Transaction;
  }) {
    return await this.userSettingsRepository.create(
      { userId },
      { transaction: trx }
    );
  }

  async updateUserSettings({
    payload,
    userId
  }: {
    payload: Partial<UserSettings>;
    userId: string;
  }) {
    return await this.userSettingsRepository.update(
      {
        ...payload
      },
      { where: { userId } }
    );
  }

  async getUserSettingsByUserId({ userId }: { userId: string }) {
    return await this.userSettingsRepository.findOne({
      where: { userId }
    });
  }

  async getUserById({ id }: { id: string }) {
    return await this.userRepository.findByPk(id, {
      include: { all: true }
    });
  }
}
