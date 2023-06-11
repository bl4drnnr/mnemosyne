import { Controller, Param, Post, Body, Headers } from '@nestjs/common';
import { ProxyService } from '@proxy/proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @Post(':controller/:action')
  async proxyAction(
    @Param('controller') controller: string,
    @Param('action') action: string,
    @Body()
    {
      method,
      payload,
      params
    }: {
      method: string;
      payload?: object;
      params?: object;
    },
    @Headers('registration-authorization') signUpApiAuthToken?: string
  ) {
    return await this.proxyService.proxyAction({
      controller,
      action,
      payload,
      method,
      params,
      signUpApiAuthToken
    });
  }
}
