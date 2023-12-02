import { Module } from '@nestjs/common';
import { CompanyRolesService } from './company-roles.service';
import { CompanyRolesController } from './company-roles.controller';
import { AuthModule } from '@modules/auth.module';

@Module({
  providers: [CompanyRolesService],
  controllers: [CompanyRolesController],
  imports: [AuthModule]
})
export class CompanyRolesModule {}
