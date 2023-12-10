import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { Role } from '@models/role.model';
import { UserRole } from '@models/user-role.model';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [SequelizeModule.forFeature([Role, UserRole])],
  exports: [RolesService]
})
export class RolesModule {}
