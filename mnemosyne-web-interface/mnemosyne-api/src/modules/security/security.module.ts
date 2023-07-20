import { Module } from '@nestjs/common';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { ConfirmationHashModule } from '@modules/confirmation-hash.module';
import { UsersModule } from '@modules/users.module';
import { AuthModule } from '@modules/auth.module';

@Module({
  controllers: [SecurityController],
  providers: [SecurityService],
  imports: [ConfirmationHashModule, UsersModule, AuthModule]
})
export class SecurityModule {}
