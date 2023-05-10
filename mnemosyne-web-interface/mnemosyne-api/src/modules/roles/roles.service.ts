import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@models/role.model';
import { CreateRoleDto } from '@dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private readonly roleRepository: typeof Role
  ) {}

  async createRole(payload: CreateRoleDto) {
    return await this.roleRepository.create(payload);
  }

  async getRoleByValue(value: string) {
    return await this.roleRepository.findOne({
      where: { value }
    });
  }
}
