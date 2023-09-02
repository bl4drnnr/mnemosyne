import {
  ApiBody,
  ApiExtraModels,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Controller, Param, Post, Body, Res, Headers } from '@nestjs/common';
import { ProxyService } from '@proxy/proxy.service';
import { ProxyActionInterface } from '@interfaces/proxy-action.interface';
import { ProxyDocs } from '@docs/proxy.docs';

@ApiTags('Proxy')
@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @ApiOperation(ProxyDocs.ProxyAction.ApiOperation)
  @ApiExtraModels(...ProxyDocs.ProxyAction.ApiExtraModels)
  @ApiResponse(ProxyDocs.ProxyAction.ApiResponse)
  @ApiBody(ProxyDocs.ProxyAction.ApiBody)
  @ApiQuery(ProxyDocs.ProxyAction.ApiControllerQuery)
  @ApiQuery(ProxyDocs.ProxyAction.ApiActionQuery)
  @ApiHeader(ProxyDocs.ProxyAction.ApiAccessTokenHeader)
  @ApiHeader(ProxyDocs.ProxyAction.ApiCookieHeader)
  @Post(':controller/:action')
  async proxyAction(
    @Param('controller') controller: string,
    @Param('action') action: string,
    @Res({ passthrough: true }) res,
    @Body() { method, payload, params }: ProxyActionInterface,
    @Headers('X-Access-Token') accessToken?: string,
    @Headers('cookie') cookies?: string
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
