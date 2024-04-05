import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const authHeader = req.headers['x-access-token'];

    const token = authHeader.split(' ')[1];

    if (!token || token === 'null') return next.handle();

    const { userId } = this.jwtService.verify(token);

    req.user = userId || null;

    return next.handle();
  }
}
