import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CookieRefreshToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const cookies = request.headers.cookie;
    const refreshToken = cookies
      .split(';')
      .find((cookie) => cookie.trim().startsWith('_rt='))
      .split('=')[1];
    return refreshToken || '';
  }
);
