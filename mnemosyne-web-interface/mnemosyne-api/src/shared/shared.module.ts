import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { EmailService } from '@shared/email.service';
import { ConfirmationHashModule } from '@modules/confirmation-hash/confirmation-hash.module';
import { PhoneService } from '@shared/phone.service';
import { UsersModule } from '@modules/users.module';
import { CryptographicService } from '@shared/cryptographic.service';
import { TimeService } from '@shared/time.service';
import { EmailTemplatesService } from '@shared/email-templates.service';
import { SmsTemplatesService } from '@shared/sms-templates.service';

const providers = [
  ApiConfigService,
  EmailService,
  PhoneService,
  CryptographicService,
  TimeService,
  EmailTemplatesService,
  SmsTemplatesService
];

@Global()
@Module({
  providers,
  exports: [...providers],
  imports: [ConfirmationHashModule, UsersModule]
})
export class SharedModule {}
