import type { NestMiddleware } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import { ApiConfigService } from '@shared/config.service';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  constructor(private configService: ApiConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers['authorization']) {
      const authorization = req.headers['authorization'];
      const basic = authorization.match(/^Basic (.+)$/);

      if (!basic) return new UnauthorizedException();

      const credentials = Buffer.from(basic[1], 'base64').toString('utf-8');

      const apiUsername = this.configService.basicAuthConfig.username;
      const apiPassword = this.configService.basicAuthConfig.password;

      if (credentials != `${apiUsername}:${apiPassword}`) {
        return new UnauthorizedException();
      }

      return next();
    }
    return new UnauthorizedException();
  }
}
