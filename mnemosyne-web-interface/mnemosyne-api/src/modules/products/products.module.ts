import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from '@models/product.model';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '@shared/config.service';
import { CategoriesModule } from '@modules/categories.module';
import { UsersModule } from '@modules/users.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    UsersModule,
    CategoriesModule,
    SequelizeModule.forFeature([Product]),
    JwtModule.registerAsync({
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.jwtAuthConfig.secret
      }),
      inject: [ApiConfigService]
    })
  ],
  exports: [ProductsService]
})
export class ProductsModule {}
