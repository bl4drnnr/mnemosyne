import { Injectable } from '@nestjs/common';
import { Product } from '@models/product.model';
import { InjectModel } from '@nestjs/sequelize';
import { GetProductBySlugInterface } from '@interfaces/get-product-by-slug.interface';
import { SearchProductInterface } from '@interfaces/search-product.interface';
import { ParseException } from '@exceptions/parse.exception';
import { Op } from 'sequelize';
import { User } from '@models/user.model';
import { SearchProductsDto } from '@dto/search-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private readonly productRepository: typeof Product
  ) {}

  getProductBySlug({ slug, trx }: GetProductBySlugInterface) {
    return this.productRepository.findOne({
      include: [{ model: User }],
      where: { slug },
      transaction: trx
    });
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
          { name: { [Op.iLike]: `%${query}%` } },
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
      ({ picture, slug, name, createdAt, price, user }) => {
        return {
          picture,
          slug,
          name,
          createdAt,
          price,
          productUserFirstName: user.firstName,
          productUserLastName: user.lastName
        };
      }
    );

    return new SearchProductsDto(foundProducts);
  }

  createProduct() {}
}
