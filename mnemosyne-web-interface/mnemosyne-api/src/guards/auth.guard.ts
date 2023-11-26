import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InvalidTokenException } from '@exceptions/invalid-token.exception';
import { CorruptedTokenException } from '@exceptions/corrupted-token.exception';
import { ExpiredTokenException } from '@exceptions/expired-token.exception';
import { AuthError } from '@interfaces/auth-error.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['x-access-token'];

    if (!authHeader) throw new InvalidTokenException();

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !token) throw new CorruptedTokenException();

    try {
      const tokenData = this.jwtService.verify(token);
      req.user = tokenData.userId;

      if (tokenData.companyId) req.company = tokenData.companyId;

      return true;
    } catch (error: any) {
      const errorName = error.name as AuthError;
      switch (errorName) {
        case AuthError.TOKEN_EXPIRED_ERROR:
          throw new ExpiredTokenException();
        case AuthError.JSON_WEB_TOKEN_ERROR:
          throw new InvalidTokenException();
        default:
          throw new InvalidTokenException();
      }
    }
  }
}
