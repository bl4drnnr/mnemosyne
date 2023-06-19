import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@models/user.model';
import { RolesModule } from '@modules/roles.module';
import { AuthModule } from '@modules/auth.module';
import { UserSettings } from '@models/user-settings.model';
import { ConfirmationHashModule } from '@modules/confirmation-hash.module';
import { ConfirmationHash } from '@models/confirmation-hash.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, UserSettings, ConfirmationHash]),
    forwardRef(() => ConfirmationHashModule),
    forwardRef(() => AuthModule),
    RolesModule
  ],
  exports: [UsersService]
})
export class UsersModule {}
