import { Controller, Param, Post, Body, Res, Headers } from '@nestjs/common';
import { ProxyService } from '@proxy/proxy.service';
import { ProxyActionInterface } from '@interfaces/proxy-action.interface';

@Controller('proxy')
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @Post(':controller/:action')
  async proxyAction(
    @Param('controller') controller: string,
    @Param('action') action: string,
    @Res({ passthrough: true }) res,
    @Headers('X-Access-Token') accessToken: string,
    @Headers('cookie') cookies: string,
    @Body()
    { method, payload, params }: ProxyActionInterface
  ) {
    const response = await this.proxyService.proxyAction({
      controller,
      action,
      payload,
      method,
      params,
      cookies,
      accessToken
    });

    if ('_at' in response && '_rt' in response) {
      res.cookie('_rt', response._rt, { httpOnly: true });
      return { _at: response._at };
    } else {
      return response;
    }
  }
}
