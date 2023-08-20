import { Module } from '@nestjs/common';
import { CompanyUsersController } from './company-users.controller';
import { CompanyUsersService } from './company-users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CompanyUser } from '@models/company-users.model';

@Module({
  controllers: [CompanyUsersController],
  providers: [CompanyUsersService],
  imports: [SequelizeModule.forFeature([CompanyUser])],
  exports: [CompanyUsersService]
})
export class CompanyUsersModule {}
