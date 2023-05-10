import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { CreateUserDto } from '@dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User
  ) {}

  async createUser(payload: CreateUserDto) {
    return await this.userRepository.create(payload);
  }

  async getUserById(id: string) {
    return await this.userRepository.findByPk(id);
  }
}
