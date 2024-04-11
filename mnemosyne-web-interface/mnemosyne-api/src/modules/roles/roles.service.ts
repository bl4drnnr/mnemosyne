import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
import { AssignRoleInterface } from '@interfaces/assign-role.interface';
import { CompanyRoleAssignedDto } from '@dto/company-role-assigned.dto';
import { GetCompanyRolesInterface } from '@interfaces/get-company-roles.interface';
import { Company } from '@models/company.model';
import { UtilsService } from '@shared/utils.service';
import { RoleDoesntExistException } from '@exceptions/role-doesnt-exist.exception';
import { RoleAlreadyExistsException } from '@exceptions/role-already-exists.exception';
import { GetCompanyRolesDto } from '@dto/get-company-roles.dto';
import { UpdateUserRoleInterface } from '@interfaces/update-user-role.interface';
import { GetRoleByIdInterface } from '@interfaces/get-role-by-id.interface';
import { ChangeCompanyMemberRoleInterface } from '@interfaces/change-company-member-role.interface';
import { CompanyUsersService } from '@modules/company-users.service';
import { UserNotFoundException } from '@exceptions/user-not-found.exception';
import { CompanyMemberRoleChangedDto } from '@dto/company-member-role-changed.dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly utilsService: UtilsService,
    @Inject(forwardRef(() => CompanyUsersService))
    private readonly companyUsersService: CompanyUsersService,
    @InjectModel(Role) private readonly roleRepository: typeof Role,
    @InjectModel(UserRole) private readonly userRoleRepository: typeof UserRole
  ) {}

  async getRoleById({ id, trx: transaction }: GetRoleByIdInterface) {
    return await this.roleRepository.findOne({
      where: { id },
      transaction
    });
  }

  async getCompanyRoles({
    companyId,
    trx: transaction
  }: GetCompanyRolesInterface) {
    const allAssignedRoles = await this.roleRepository.findAll({
      include: {
        model: Company,
        where: { id: companyId }
      },
      transaction
    });

    const roles = allAssignedRoles.map(
      ({ id, name, description, roleScopes }) => {
        return { id, name, description, roleScopes };
      }
    );

    const companyRoles = this.utilsService.removeDuplicates(roles, 'name');

    return new GetCompanyRolesDto(companyRoles);
  }

  async createCompanyRole({
    companyId,
    payload,
    trx: transaction
  }: CreateCompanyRoleInterface) {
    const { name, description, roleScopes, roleAssignees } = payload;

    const alreadyExistingRoles = await this.roleRepository.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      },
      include: {
        model: Company,
        where: { id: companyId }
      },
      transaction
    });

    if (alreadyExistingRoles.length > 0) throw new RoleAlreadyExistsException();

    const createdRole = await this.roleRepository.create(
      {
        name,
        description,
        roleScopes
      },
      { transaction, returning: ['id'] }
    );

    for (const companyUserId of roleAssignees) {
      await this.userRoleRepository.destroy({
        where: { companyUserId },
        transaction
      });
    }

    for (const companyUserId of roleAssignees) {
      await this.userRoleRepository.create(
        {
          companyId,
          companyUserId,
          roleId: createdRole.id
        },
        { transaction }
      );
    }

    return new CompanyRoleCreatedDto();
  }

  async updateCompanyRole({
    companyId,
    payload,
    trx: transaction
  }: UpdateCompanyRoleInterface) {
    const { name } = payload;

    const companyRoles = await this.roleRepository.findAll({
      where: { name },
      include: {
        model: Company,
        where: { id: companyId }
      },
      transaction
    });

    if (!companyRoles) throw new RoleDoesntExistException();

    const companyRolesIds = companyRoles.map(({ id }) => id);

    await this.roleRepository.update(
      {
        ...payload
      },
      {
        returning: false,
        where: {
          id: { [Op.in]: companyRolesIds }
        },
        transaction
      }
    );

    return new CompanyRoleUpdatedDto();
  }

  async changeCompanyMemberRole({
    companyId,
    payload,
    trx
  }: ChangeCompanyMemberRoleInterface) {
    const { newRoleId, userId } = payload;

    const companyUser = await this.companyUsersService.getCompanyUserByUserId({
      userId,
      trx
    });

    if (!companyUser) throw new UserNotFoundException();

    const newRole = await this.roleRepository.findByPk(newRoleId, {
      transaction: trx
    });

    if (!newRole) throw new RoleDoesntExistException();

    if (newRole.name === 'PRIMARY_ADMIN') throw new RoleDoesntExistException();

    await this.userRoleRepository.update(
      {
        roleId: newRole.id
      },
      { where: { companyId, companyUserId: companyUser.id } }
    );

    return new CompanyMemberRoleChangedDto();
  }

  async assignRoleToUser({
    companyId,
    roleId,
    companyUserId,
    trx
  }: AssignRoleInterface) {
    await this.userRoleRepository.create(
      {
        companyId,
        roleId,
        companyUserId
      },
      { transaction: trx }
    );
    return new CompanyRoleAssignedDto();
  }

  async getUserRolesByCompanyUserId({
    companyUserId,
    trx: transaction
  }: GetUserRolesByCompanyUserIdInterface) {
    const userRole = await this.userRoleRepository.findOne({
      where: { companyUserId },
      transaction
    });

    const { name, description, id, roleScopes } =
      await this.roleRepository.findOne({
        where: { id: userRole.roleId },
        transaction
      });

    return { name, description, id, roleScopes };
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

  async updateUserRole({
    companyUserId,
    companyId,
    newRoleId,
    trx
  }: UpdateUserRoleInterface) {
    await this.userRoleRepository.update(
      {
        roleId: newRoleId
      },
      { where: { companyUserId, companyId }, transaction: trx }
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
          description: 'primary_admin_desc',
          roleScopes: [
            Scopes.USER_MANAGEMENT,
            Scopes.ROLES_MANAGEMENT,
            Scopes.COMPANY_INFORMATION_MANAGEMENT,
            Scopes.PRODUCT_MANAGEMENT
          ]
        };
      case 'ADMIN':
        return {
          name: initRole,
          description: 'admin_desc',
          roleScopes: [
            Scopes.USER_MANAGEMENT,
            Scopes.ROLES_MANAGEMENT,
            Scopes.COMPANY_INFORMATION_MANAGEMENT,
            Scopes.PRODUCT_MANAGEMENT
          ]
        };
      case 'DEFAULT':
        return {
          name: initRole,
          description: 'default_desc',
          roleScopes: []
        };
      case 'PRODUCT_MANAGEMENT':
        return {
          name: initRole,
          description: 'product_management_desc',
          roleScopes: [Scopes.PRODUCT_MANAGEMENT]
        };
      default:
        return {
          name: initRole,
          description: 'default_desc',
          roleScopes: []
        };
    }
  }
}
