import { Module } from '@nestjs/common';
import { CompanyRolesService } from './company-roles.service';
import { CompanyRolesController } from './company-roles.controller';

@Module({
  providers: [CompanyRolesService],
  controllers: [CompanyRolesController]
})
export class CompanyRolesModule {}
