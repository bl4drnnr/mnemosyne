import { Module } from '@nestjs/common';
import { ConfirmationHashController } from './confirmation-hash.controller';
import { ConfirmationHashService } from './confirmation-hash.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { UsersModule } from '@modules/users.module';

@Module({
  controllers: [ConfirmationHashController],
  providers: [ConfirmationHashService],
  imports: [SequelizeModule.forFeature([ConfirmationHash]), UsersModule],
  exports: [ConfirmationHashService]
})
export class ConfirmationHashModule {}
