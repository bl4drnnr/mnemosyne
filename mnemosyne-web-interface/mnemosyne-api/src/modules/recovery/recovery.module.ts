import { Module } from '@nestjs/common';
import { RecoveryController } from './recovery.controller';
import { RecoveryService } from './recovery.service';
import { ConfirmationHashModule } from '@modules/confirmation-hash.module';
import { UsersModule } from '@modules/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/config.service';

@Module({
  controllers: [RecoveryController],
  providers: [RecoveryService],
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    }),
    ConfirmationHashModule,
    UsersModule
  ],
  exports: [RecoveryService]
})
export class RecoveryModule {}
