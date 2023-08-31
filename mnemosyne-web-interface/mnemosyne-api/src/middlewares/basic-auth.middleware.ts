import type { NestMiddleware } from '@nestjs/common';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import { ApiConfigService } from '@shared/config.service';

@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  constructor(private configService: ApiConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const unAuthMessage = 'unauthorized';

    if (req.headers['authorization']) {
      const authorization = req.headers['authorization'];
      const basic = authorization.match(/^Basic (.+)$/);

      if (!basic) throw new UnauthorizedException(unAuthMessage);

      const credentials = Buffer.from(basic[1], 'base64').toString('utf-8');

      const apiUsername = this.configService.basicAuthConfig.username;
      const apiPassword = this.configService.basicAuthConfig.password;

      if (credentials != `${apiUsername}:${apiPassword}`) {
        throw new UnauthorizedException(unAuthMessage);
      }

      return next();
    } else {
      throw new UnauthorizedException(unAuthMessage);
    }
  }
}
