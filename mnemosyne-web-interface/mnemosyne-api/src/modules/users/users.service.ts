import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { CreateUserDto } from '@dto/create-user.dto';
import { RolesService } from '@modules/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly roleService: RolesService
  ) {}

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      include: { all: true }
    });
  }

  async createUser(payload: CreateUserDto) {
    const defaultRole = await this.roleService.getRoleByValue('USER');
    const user = await this.userRepository.create(payload);
    await user.$set('roles', [defaultRole.id]);
  }

  async getUserById(id: string) {
    return await this.userRepository.findByPk(id, {
      include: { all: true }
    });
  }
}
