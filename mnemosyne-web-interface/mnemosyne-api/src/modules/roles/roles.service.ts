import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@models/role.model';
import { CreateRoleDto } from '@dto/create-role.dto';
import { GrantRoleDto } from '@dto/grant-role.dto';
import { User } from '@models/user.model';
import {Role as RoleType } from "@custom-types/role.type";

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly roleRepository: typeof Role,
    @InjectModel(User) private readonly userRepository: typeof User
  ) {}

  async createRole(payload: CreateRoleDto) {
    return await this.roleRepository.create(payload);
  }

  async getRoleByValue(value: RoleType) {
    return await this.roleRepository.findOne({
      where: { value }
    });
  }

  async grantRole({
    userId, value, trx: transaction
                  }: GrantRoleDto) {
    const user = await this.userRepository.findByPk(userId);
    const assignedRoles = await this.getRoleByValue(value);
    await user.$set('roles', [assignedRoles.id], { transaction });
  }
}
