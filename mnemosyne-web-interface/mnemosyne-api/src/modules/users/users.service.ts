import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { CreateUserDto } from '@dto/create-user.dto';
import { RolesService } from '@modules/roles.service';
import { Transaction } from 'sequelize';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly roleService: RolesService
  ) {}

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

  async getUserById(id: string) {
    return await this.userRepository.findByPk(id, {
      include: { all: true }
    });
  }
}
