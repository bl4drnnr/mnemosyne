import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GrantInitRoleInterface } from '@interfaces/grant-init-role.interface';
import { Role } from '@models/role.model';
import { Role as RoleType } from '@custom-types/role.type';
import { UserRole } from '@models/user-role.model';
import { Scopes } from '@interfaces/role-scopes.enum';
import { CreateInitRoleInterface } from '@interfaces/create-init-role.interface';
import { Op } from 'sequelize';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly roleRepository: typeof Role,
    @InjectModel(UserRole) private readonly userRoleRepository: typeof UserRole
  ) {}

  async grantInitRole({
    companyUserId,
    companyId,
    role,
    trx: transaction
  }: GrantInitRoleInterface) {
    const existingRoles = await this.roleRepository.findAll({
      where: { name: role },
      transaction
    });
    const existingRolesIds = existingRoles.map((role) => role.id);

    const existingUserRole = await this.userRoleRepository.findOne({
      where: {
        companyId,
        companyUserId,
        roleId: {
          [Op.in]: existingRolesIds
        }
      },
      transaction
    });

    let newRole: Role;

    if (!existingUserRole) {
      newRole = await this.createInitRole({ role, trx: transaction });
    } else if (existingUserRole) {
      newRole = await this.roleRepository.findByPk(existingUserRole.roleId, {
        transaction
      });
    }

    await this.userRoleRepository.create(
      {
        companyUserId,
        companyId,
        roleId: newRole.id
      },
      { transaction }
    );
  }

  private async createInitRole({
    role,
    trx: transaction
  }: CreateInitRoleInterface) {
    const initRole = this.getInitRoleInfo(role);

    return await this.roleRepository.create(
      {
        ...initRole
      },
      { transaction }
    );
  }

  private getInitRoleInfo(initRole: RoleType | string) {
    switch (initRole) {
      case 'PRIMARY_ADMIN':
        return {
          name: initRole,
          description: 'The owner of the company account.',
          roleScopes: [
            Scopes.USER_MANAGEMENT,
            Scopes.ROLES_MANAGEMENT,
            Scopes.COMPANY_INFORMATION_MANAGEMENT
          ]
        };
      case 'ADMIN':
        return {
          name: initRole,
          description: 'The default administrator of the company account',
          roleScopes: [
            Scopes.USER_MANAGEMENT,
            Scopes.ROLES_MANAGEMENT,
            Scopes.COMPANY_INFORMATION_MANAGEMENT
          ]
        };
      case 'DEFAULT':
        return {
          name: initRole,
          description: 'The role of the default user',
          roleScopes: []
        };
    }
  }
}
