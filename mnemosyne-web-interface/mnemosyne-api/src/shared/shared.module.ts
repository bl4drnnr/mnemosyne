import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';

const providers = [ApiConfigService];

@Global()
@Module({
  providers,
  exports: [...providers]
})
export class SharedModule {}
