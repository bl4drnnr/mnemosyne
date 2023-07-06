import { Controller, Param, Post, Body, Res } from '@nestjs/common';
import { ProxyService } from '@proxy/proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @Post(':controller/:action')
  async proxyAction(
    @Param('controller') controller: string,
    @Param('action') action: string,
    @Res({ passthrough: true }) res,
    @Body()
    {
      method,
      payload,
      params
    }: {
      method: string;
      payload?: object;
      params?: object;
    }
  ) {
    const response = await this.proxyService.proxyAction({
      controller,
      action,
      payload,
      method,
      params
    });

    if ('_at' in response && '_rt' in response) {
      res.cookie('_rt', response._rt, { httpOnly: true });
      return { _at: response._at };
    } else {
      return response;
    }
  }
}
