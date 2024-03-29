import { forwardRef, Module } from '@nestjs/common';
import { ConfirmationHashController } from './confirmation-hash.controller';
import { ConfirmationHashService } from './confirmation-hash.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { UsersModule } from '@modules/users.module';
import { AuthModule } from '@modules/auth.module';
import { CompanyModule } from '@modules/company.module';

@Module({
  controllers: [ConfirmationHashController],
  providers: [ConfirmationHashService],
  imports: [
    SequelizeModule.forFeature([ConfirmationHash]),
    forwardRef(() => UsersModule),
    forwardRef(() => CompanyModule),
    AuthModule
  ],
  exports: [ConfirmationHashService]
})
export class ConfirmationHashModule {}
