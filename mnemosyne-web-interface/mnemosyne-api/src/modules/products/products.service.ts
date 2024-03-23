import { Injectable } from '@nestjs/common';
import { Product } from '@models/product.model';
import { InjectModel } from '@nestjs/sequelize';
import { GetProductBySlugInterface } from '@interfaces/get-product-by-slug.interface';
import { SearchProductInterface } from '@interfaces/search-product.interface';
import { ParseException } from '@exceptions/parse.exception';
import { Op } from 'sequelize';
import { User } from '@models/user.model';
import { SearchProductsDto } from '@dto/search-products.dto';
import { ProductBySlugDto } from '@dto/product-by-slug.dto';
import { GetLatestProductsInterface } from '@interfaces/get-latest-products.interface';
import { LatestProductsDto } from '@dto/latest-products.dto';
import { ProductPostedDto } from '@dto/product-posted.dto';
import { PostProductInterface } from '@interfaces/post-product.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productRepository: typeof Product
  ) {}

  async getProductBySlug({ slug, trx }: GetProductBySlugInterface) {
    const foundProduct = await this.productRepository.findOne({
      include: [{ model: User, attributes: ['firstName', 'lastName'] }],
      where: { slug },
      transaction: trx
    });

    const product = {
      title: foundProduct.title,
      description: foundProduct.description,
      pictures: foundProduct.pictures,
      currency: foundProduct.currency,
      price: foundProduct.price,
      subcategory: foundProduct.subcategory,
      category: foundProduct.category,
      productUserFirstName: foundProduct.user.firstName,
      productUserLastName: foundProduct.user.lastName
    };

    return new ProductBySlugDto(product);
  }

  async getLatestProducts({ trx }: GetLatestProductsInterface) {
    const products = await this.productRepository.findAll({
      attributes: [
        'title',
        'slug',
        'pictures',
        'currency',
        'price',
        'category',
        'subcategory'
      ],
      order: [['created_at', 'DESC']],
      limit: 10,
      offset: 0,
      transaction: trx
    });

    const latestProducts = products.map(
      ({ title, slug, pictures, currency, price, category, subcategory }) => {
        return {
          title,
          slug,
          pictures,
          currency,
          price,
          category,
          subcategory
        };
      }
    );

    return new LatestProductsDto(latestProducts);
  }

  async searchProduct({ query, page, pageSize, trx }: SearchProductInterface) {
    const offset = Number(page) * Number(pageSize);
    const limit = Number(pageSize);

    const paginationParseError =
      isNaN(offset) || isNaN(limit) || offset < 0 || limit < 0;

    if (paginationParseError) throw new ParseException();

    const products = await this.productRepository.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
          { slug: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [{ model: User, attributes: ['first_name', 'last_name'] }],
      attributes: ['picture', 'slug', 'name', 'created_at', 'price'],
      limit,
      offset,
      transaction: trx
    });

    const foundProducts = products.map(
      ({ pictures, slug, title, createdAt, price, user }) => {
        return {
          pictures,
          slug,
          title,
          createdAt,
          price,
          productUserFirstName: user.firstName,
          productUserLastName: user.lastName
        };
      }
    );

    return new SearchProductsDto(foundProducts);
  }

  createProduct({ userId, payload, trx }: PostProductInterface) {
    const {
      title,
      description,
      pictures,
      currency,
      price,
      location,
      contactPhone,
      contactPerson,
      category,
      subcategory
    } = payload;

    return new ProductPostedDto('');
  }
}
