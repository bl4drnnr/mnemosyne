import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { catchError, Observable, tap } from 'rxjs';
import { Transaction } from 'sequelize';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly sequelizeInstance: Sequelize) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    const transaction: Transaction = await this.sequelizeInstance.transaction();
    req.transaction = transaction;

    return next.handle().pipe(
      tap(async () => {
        await transaction.commit();
      }),
      catchError(async (err) => {
        await transaction.rollback();
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      })
    );
  }
}
