import { Module } from '@nestjs/common';
import { ConfirmationHashController } from './confirmation-hash.controller';
import { ConfirmationHashService } from './confirmation-hash.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { UserSettings } from '@models/user-settings.model';

@Module({
  controllers: [ConfirmationHashController],
  providers: [ConfirmationHashService],
  imports: [SequelizeModule.forFeature([ConfirmationHash, UserSettings])],
  exports: [ConfirmationHashService]
})
export class ConfirmationHashModule {}
