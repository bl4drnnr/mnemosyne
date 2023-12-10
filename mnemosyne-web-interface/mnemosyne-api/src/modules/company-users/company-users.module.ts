import { forwardRef, Module } from '@nestjs/common';
import { CompanyUsersController } from './company-users.controller';
import { CompanyUsersService } from './company-users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyUser } from '@models/company-user.model';
import { AuthModule } from '@modules/auth.module';
import { UsersModule } from '@modules/users.module';
import { CompanyModule } from '@modules/company.module';

@Module({
  controllers: [CompanyUsersController],
  providers: [CompanyUsersService],
  imports: [
    SequelizeModule.forFeature([CompanyUser]),
    forwardRef(() => UsersModule),
    forwardRef(() => CompanyModule),
    AuthModule
  ],
  exports: [CompanyUsersService]
})
export class CompanyUsersModule {}
