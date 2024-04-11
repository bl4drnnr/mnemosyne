import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '@models/role.model';
import { UserRole } from '@models/user-role.model';
import { AuthModule } from '@modules/auth.module';
import { CompanyUsersModule } from '@modules/company-users.module';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    SequelizeModule.forFeature([Role, UserRole]),
    forwardRef(() => CompanyUsersModule),
    AuthModule
  ],
  exports: [RolesService]
})
export class RolesModule {}
