import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { ConfirmationHashModule } from '@modules/confirmation-hash.module';
import { UsersModule } from '@modules/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserSettings } from '@models/user-settings.model';

@Module({
  controllers: [SecurityController],
  providers: [SecurityService],
  imports: [
    SequelizeModule.forFeature([UserSettings]),
    ConfirmationHashModule,
    UsersModule
  ]
})
export class SecurityModule {}
