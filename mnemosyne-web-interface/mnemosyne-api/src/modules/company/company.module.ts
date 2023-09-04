import { forwardRef, Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from '@models/company.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '@modules/users.module';
import { CompanyUsersModule } from '@modules/company-users.module';
import {RolesModule} from "@modules/roles.module";

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [
    SequelizeModule.forFeature([Company]),
    forwardRef(() => UsersModule),
    forwardRef(() => CompanyUsersModule),
    forwardRef(() => RolesModule)
  ],
  exports: [CompanyService]
})
export class CompanyModule {}
