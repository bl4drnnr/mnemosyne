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
import { ApiConfigService } from '@shared/config.service';
import { S3 } from 'aws-sdk';
import { WrongPictureException } from '@exceptions/wrong-picture.exception';
import { CryptoHashAlgorithm } from '@interfaces/crypto-hash-algorithm.enum';
import { CryptographicService } from '@shared/cryptographic.service';
import { CategoriesService } from '@modules/categories.service';
import { ProductNotFoundException } from '@exceptions/product-not-found.exception';

@Injectable()
export class ProductsService {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly cryptographicService: CryptographicService,
    private readonly categoriesService: CategoriesService,
    @InjectModel(Product)
    private readonly productRepository: typeof Product
  ) {}

  async getProductBySlug({ slug, trx }: GetProductBySlugInterface) {
    const foundProduct = await this.productRepository.findOne({
      include: [{ model: User, attributes: ['firstName', 'lastName'] }],
      where: { slug },
      transaction: trx
    });

    if (!foundProduct) throw new ProductNotFoundException();

    const product = {
      title: foundProduct.title,
      description: foundProduct.description,
      pictures: foundProduct.pictures,
      location: foundProduct.location,
      currency: foundProduct.currency,
      price: foundProduct.price,
      subcategory: foundProduct.subcategory,
      category: foundProduct.category,
      contactPerson: foundProduct.contactPerson,
      contactPhone: foundProduct.contactPhone,
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

  async createProduct({ userId, payload, trx }: PostProductInterface) {
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

    const slug = this.generateProductSlug(title);
    const picturesHashes = [];

    const { accessKeyId, secretAccessKey, bucketName } =
      this.configService.awsSdkCredentials;

    const s3 = new S3({ accessKeyId, secretAccessKey });

    for (const pic of pictures) {
      const base64Data = Buffer.from(
        pic.replace(/^data:image\/\w+;base64,/, ''),
        'base64'
      );

      const type = pic.split(';')[0].split('/')[1];

      if (type !== 'png') throw new WrongPictureException();

      const pictureHash = this.cryptographicService.hash({
        data: base64Data.toString(),
        algorithm: CryptoHashAlgorithm.MD5
      });

      picturesHashes.push(pictureHash);

      const params = {
        Bucket: bucketName,
        Key: `products/${pictureHash}.${type}`,
        Body: base64Data,
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
      };

      await s3.upload(params).promise();
    }

    const { id: categoryId } = await this.categoriesService.getCategoryByName({
      name: category,
      trx
    });

    await this.productRepository.create(
      {
        title,
        slug,
        description,
        pictures: picturesHashes,
        location,
        currency,
        price,
        subcategory,
        contactPhone,
        contactPerson,
        userId,
        categoryId
      },
      {
        transaction: trx
      }
    );

    const productLink = `/marketplace/product/${slug}`;

    return new ProductPostedDto(productLink);
  }

  private generateProductSlug(productName: string) {
    let slug = productName.toLowerCase();
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/[^\w\-]+/g, '');

    const randomNumber = String((Date.now() + Math.random()) * 10000).slice(-6);

    slug += `-${randomNumber}`;

    return slug;
  }
}
