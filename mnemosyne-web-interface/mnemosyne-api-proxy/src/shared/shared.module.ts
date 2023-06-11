import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { ProxyHttpService } from '@shared/http.service';
import { HttpModule } from '@nestjs/axios';

const providers = [ApiConfigService, ProxyHttpService];

@Global()
@Module({
  providers,
  exports: [...providers],
  imports: [HttpModule]
})
export class SharedModule {}
