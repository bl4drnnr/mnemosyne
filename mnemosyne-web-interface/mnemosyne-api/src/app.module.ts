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
import { AuthModule } from '@modules/auth/auth.module';
import { SharedModule } from '@shared/shared.module';
import { BasicAuthMiddleware } from '@middlewares/basic-auth.middleware';

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
      models: [User, Role, UserRole],
      autoLoadModels: true
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    SharedModule
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
