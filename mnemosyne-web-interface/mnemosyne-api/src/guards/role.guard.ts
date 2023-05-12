import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@decorators/roles.decorator';
import { ForbiddenResourceException } from '@exceptions/auth/forbidden-resource.exception';
import { CorruptedTokenException } from '@exceptions/auth/corrupted-token.exception';
import { InvalidTokenException } from '@exceptions/auth/invalid-token.exception';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Array<string>>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) return true;

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['x-access-token'];

    if (!authHeader) throw new InvalidTokenException();

    if (authHeader.split(' ')[0] !== 'Bearer' || !authHeader.split(' ')[1])
      throw new CorruptedTokenException();

    try {
      const user = this.jwtService.verify(authHeader.split(' ')[1]);
      req.user = user;
      return user.roles.some((role) => requiredRoles.includes(role.value));
    } catch (e) {
      throw new ForbiddenResourceException();
    }
  }
}
