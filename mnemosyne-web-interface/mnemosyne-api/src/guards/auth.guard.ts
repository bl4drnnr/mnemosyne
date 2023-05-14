import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { InvalidTokenException } from '@exceptions/auth/invalid-token.exception';
import { CorruptedTokenException } from '@exceptions/auth/corrupted-token.exception';
import { ExpiredTokenException } from '@exceptions/auth/expired-token.exception';

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
      return true;
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError)
        throw new ExpiredTokenException();
      else if (error instanceof jwt.JsonWebTokenError)
        throw new InvalidTokenException();
    }
  }
}
