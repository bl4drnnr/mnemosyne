import { Injectable } from '@nestjs/common';
import { ProxyHttpService } from '@shared/http.service';
import { ProxyActionPayloadInterface } from '@interfaces/proxy-action-payload.interface';

@Injectable()
export class ProxyService {
  constructor(private proxyHttpService: ProxyHttpService) {}

  async proxyAction({
    controller,
    action,
    payload,
    method,
    params,
    accessToken,
    cookies
  }: ProxyActionPayloadInterface) {
    return await this.proxyHttpService.proxyRequest({
      controller,
      action,
      payload,
      method,
      params,
      accessToken,
      cookies
    });
  }
}
