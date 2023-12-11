import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GrantInitRoleInterface } from '@interfaces/grant-init-role.interface';
import { Role } from '@models/role.model';
import { Role as RoleType } from '@custom-types/role.type';
import { UserRole } from '@models/user-role.model';
import { Scopes } from '@interfaces/role-scopes.enum';
import { CreateInitRoleInterface } from '@interfaces/create-init-role.interface';
import { Op } from 'sequelize';
import { GetUserRolesByCompanyUserIdInterface } from '@interfaces/get-user-roles-by-company-user-id.interface';
import { CreateCompanyRoleInterface } from '@interfaces/create-company-role.interface';
import { CompanyRoleCreatedDto } from '@dto/company-role-created.dto';
import { UpdateCompanyRoleInterface } from '@interfaces/update-company-role.interface';
import { CompanyRoleUpdatedDto } from '@dto/company-role-updated.dto';
import { DeleteCompanyRoleInterface } from '@interfaces/delete-company-role.interface';
import { CompanyRoleDeletedDto } from '@dto/company-role-deleted.dto';
import { AssignRoleInterface } from '@interfaces/assign-role.interface';
import { CompanyRoleAssignedDto } from '@dto/company-role-assigned.dto';
import { RevokeRoleInterface } from '@interfaces/revoke-role.interface';
import { CompanyRoleRevokedDto } from '@dto/company-role-revoked.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly roleRepository: typeof Role,
    @InjectModel(UserRole) private readonly userRoleRepository: typeof UserRole
  ) {}

  async getUserRolesByCompanyUserId({
    companyUserId,
    trx: transaction
  }: GetUserRolesByCompanyUserIdInterface) {
    const userRoles = await this.userRoleRepository.findAll({
      where: { companyUserId },
      transaction
    });

    const userRolesIds = userRoles.map(({ roleId }) => roleId);

    const roles = await this.roleRepository.findAll({
      where: {
        id: {
          [Op.in]: userRolesIds
        }
      }
    });

    // @TODO I might need to delete duplicates
    return roles.map(({ id, name, description }) => {
      return { name, description, id };
    });
  }

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

  createCompanyRole({ companyId, payload, trx }: CreateCompanyRoleInterface) {
    return new CompanyRoleCreatedDto();
  }

  updateCompanyRole({ companyId, payload, trx }: UpdateCompanyRoleInterface) {
    return new CompanyRoleUpdatedDto();
  }

  deleteCompanyRole({ companyId, payload, trx }: DeleteCompanyRoleInterface) {
    return new CompanyRoleDeletedDto();
  }

  assignRoleToUser({ companyId, payload, trx }: AssignRoleInterface) {
    return new CompanyRoleAssignedDto();
  }

  revokeUserRole({ companyId, payload, trx }: RevokeRoleInterface) {
    return new CompanyRoleRevokedDto();
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
