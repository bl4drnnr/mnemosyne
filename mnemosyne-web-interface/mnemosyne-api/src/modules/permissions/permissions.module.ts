import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessControlList } from '@models/access-control-list.model';

@Module({
  providers: [PermissionsService],
  controllers: [PermissionsController],
  imports: [SequelizeModule.forFeature([AccessControlList])]
})
export class PermissionsModule {}
