import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@modules/users.module';
import { User } from '@models/user.model';
import { RolesModule } from '@modules/roles.module';
import { AuthModule } from '@modules/auth.module';
import { SharedModule } from '@shared/shared.module';
import { BasicAuthMiddleware } from '@middlewares/basic-auth.middleware';
import { Session } from '@models/session.model';
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
import { CompanyUser } from '@models/company-user.model';
import { CompanyUsersModule } from '@modules/company-users.module';
import { CompanyRolesModule } from '@modules/company-roles.module';
import { Role } from '@models/role.model';
import { UserRole } from '@models/user-role.model';

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
        Session,
        ConfirmationHash,
        UserSettings,
        Company,
        CompanyUser,
        Role,
        UserRole
      ],
      autoLoadModels: true
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    SharedModule,
    ConfirmationHashModule,
    SecurityModule,
    RecoveryModule,
    CompanyModule,
    CompanyUsersModule,
    CompanyRolesModule
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
    consumer.apply(BasicAuthMiddleware).exclude('/docs').forRoutes('*');
  }
}
