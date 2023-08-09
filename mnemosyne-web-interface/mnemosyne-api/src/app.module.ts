import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@modules/users.module';
import { User } from '@models/user.model';
import { RolesModule } from '@modules/roles.module';
import { Role } from '@models/role.model';
import { UserRole } from '@models/user-role.model';
import { AuthModule } from '@modules/auth.module';
import { SharedModule } from '@shared/shared.module';
import { BasicAuthMiddleware } from '@middlewares/basic-auth.middleware';
import { Session } from '@models/session.model';
import { Endpoint } from '@models/endpoint.model';
import { AccessControlList } from '@models/access-control-list.model';
import { AclEndpoint } from '@models/acl-endpoint.model';
import { AclRole } from '@models/acl-role.model';
import { PermissionsModule } from '@modules/permissions.module';
import { ConfirmationHashModule } from '@modules/confirmation-hash.module';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { SecurityModule } from '@modules/security/security.module';
import { UserSettings } from '@models/user-settings.model';
import { Transaction } from 'sequelize';
import TYPES = Transaction.TYPES;
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransactionInterceptor } from '@interceptors/transaction.interceptor';
import { RecoveryModule } from '@modules/recovery.module';
import { CompanyModule } from '@modules/company.module';
import { Company } from '@models/company.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USERNAME,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      transactionType: TYPES.EXCLUSIVE,
      models: [
        User,
        Role,
        UserRole,
        Session,
        Endpoint,
        AccessControlList,
        ConfirmationHash,
        AclEndpoint,
        AclRole,
        UserSettings,
        Company
      ],
      autoLoadModels: true
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    SharedModule,
    PermissionsModule,
    ConfirmationHashModule,
    SecurityModule,
    RecoveryModule,
    CompanyModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BasicAuthMiddleware).forRoutes({
      path: '/api/*',
      method: RequestMethod.ALL
    });
  }
}
