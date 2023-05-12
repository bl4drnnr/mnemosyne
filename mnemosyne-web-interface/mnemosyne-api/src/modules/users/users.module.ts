import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { Role } from '@models/role.model';
import { RolesModule } from '@modules/roles.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role]),
    RolesModule,
    forwardRef(() => AuthModule)
  ],
  exports: [UsersService]
})
export class UsersModule {}
