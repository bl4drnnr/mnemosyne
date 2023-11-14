import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@models/role.model';
import { User } from '@models/user.model';
import { GrantRoleInterface } from '@interfaces/grant-role.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly roleRepository: typeof Role,
    @InjectModel(User) private readonly userRepository: typeof User
  ) {}

  async grantRole({ userId, value, trx: transaction }: GrantRoleInterface) {
    const user = await this.userRepository.findByPk(userId, { transaction });
    const assignedRoles = await this.roleRepository.findOne({
      where: { value }
    });
    await user.$add('roles', [assignedRoles.id], { transaction });
  }
}
