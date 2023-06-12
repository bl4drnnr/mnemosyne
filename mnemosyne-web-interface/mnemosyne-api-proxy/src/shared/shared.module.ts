import { Global, Module } from '@nestjs/common';
import { ApiConfigService } from '@shared/config.service';
import { ProxyHttpService } from '@shared/http.service';
import { HttpModule } from '@nestjs/axios';
import { LoggerService } from '@shared/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InformationLog, LogSchema } from '@schemas/log.schema';

const providers = [ApiConfigService, ProxyHttpService, LoggerService];

@Global()
@Module({
  providers,
  exports: [...providers],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: InformationLog.name, schema: LogSchema }
    ])
  ]
})
export class SharedModule {}
