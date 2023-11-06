import {forwardRef, Module} from '@nestjs/common';
import { CompanyUsersController } from './company-users.controller';
import { CompanyUsersService } from './company-users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyUser } from '@models/company-users.model';
import { AuthModule } from '@modules/auth.module';
import {UsersModule} from "@modules/users.module";
import {RolesService} from "@modules/roles.service";

@Module({
  controllers: [CompanyUsersController],
  providers: [CompanyUsersService],
  imports: [
    SequelizeModule.forFeature([CompanyUser]),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesService),
    AuthModule
  ],
  exports: [CompanyUsersService]
})
export class CompanyUsersModule {}
