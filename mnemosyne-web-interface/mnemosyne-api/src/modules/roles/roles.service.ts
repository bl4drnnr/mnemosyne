import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@models/role.model';
import { CreateRoleDto } from '@dto/create-role.dto';
import { GrantRoleDto } from '@dto/grant-role.dto';
import { RevokeRoleDto } from '@dto/revoke-role.dto';
import { User } from '@models/user.model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly roleRepository: typeof Role,
    @InjectModel(User) private readonly userRepository: typeof User
  ) {}

  async createRole(payload: CreateRoleDto) {
    return await this.roleRepository.create(payload);
  }

  async getRoleByValue(value: string) {
    return await this.roleRepository.findOne({
      where: { value }
    });
  }

  async grantRole(payload: GrantRoleDto) {
    const user = await this.userRepository.findByPk(payload.userId);
  }

  async revokeRole(payload: RevokeRoleDto) {
    //
  }
}
