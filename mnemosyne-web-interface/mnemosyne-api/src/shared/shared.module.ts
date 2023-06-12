import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { EmailService } from '@shared/email.service';
import { ConfirmationHashModule } from '@modules/confirmation-hash/confirmation-hash.module';

const providers = [ApiConfigService, EmailService];

@Global()
@Module({
  providers,
  exports: [...providers],
  imports: [ConfirmationHashModule]
})
export class SharedModule {}
