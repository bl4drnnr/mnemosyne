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
import { ProductUpdatedDto } from '@dto/product-updated.dto';
import { GetProductBySlugToEditInterface } from '@interfaces/get-product-by-slug-to-edit.interface';
import { ProductBySlugToEditDto } from '@dto/product-by-slug-to-edit.dto';
import { Category } from '@models/category.model';

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
      include: [
        { model: User, attributes: ['firstName', 'lastName'] },
        { model: Category, attributes: ['name'] }
      ],
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
      category: foundProduct.category.name,
      contactPerson: foundProduct.contactPerson,
      contactPhone: foundProduct.contactPhone,
      productUserFirstName: foundProduct.user.firstName,
      productUserLastName: foundProduct.user.lastName
    };

    return new ProductBySlugDto(product);
  }

  // @TODO Fix here as well
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

  // @TODO Fix here as well v2
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
    const picturesHashes = await this.uploadProductPictures(pictures);

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

  async getProductBySlugToEdit({
    userId,
    slug,
    trx
  }: GetProductBySlugToEditInterface) {
    const productToEdit = await this.productRepository.findOne({
      where: { userId, slug },
      include: [{ model: Category, attributes: ['name'] }],
      transaction: trx
    });

    if (!productToEdit) throw new ProductNotFoundException();

    const product = {
      id: productToEdit.id,
      title: productToEdit.title,
      description: productToEdit.description,
      pictures: productToEdit.pictures,
      location: productToEdit.location,
      currency: productToEdit.currency,
      price: productToEdit.price,
      subcategory: productToEdit.subcategory,
      category: productToEdit.category.name,
      contactPerson: productToEdit.contactPerson,
      contactPhone: productToEdit.contactPhone
    };

    return new ProductBySlugToEditDto(product);
  }

  async updateProduct({ userId, payload, trx }: PostProductInterface) {
    const {
      id,
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

    const editedProduct = await this.productRepository.findOne({
      where: { userId, id },
      transaction: trx
    });

    if (!editedProduct) throw new ProductNotFoundException();

    const updatedSlug =
      editedProduct.title !== title
        ? this.generateProductSlug(title)
        : editedProduct.slug;

    const existingPictures = editedProduct.pictures;
    const updatedPictures = this.updatePictures(existingPictures, pictures);
    const replacedPicturesHashes = [];

    for (const pic of updatedPictures) {
      if (this.isBase64Image(pic))
        replacedPicturesHashes.push(await this.uploadProductPicture(pic));
      else replacedPicturesHashes.push(pic);
    }

    const { id: categoryId } = await this.categoriesService.getCategoryByName({
      name: category,
      trx
    });

    await this.productRepository.update(
      {
        title,
        slug: updatedSlug,
        description,
        pictures: replacedPicturesHashes,
        currency,
        price,
        location,
        contactPhone,
        contactPerson,
        categoryId,
        subcategory
      },
      {
        returning: false,
        where: { userId, id },
        transaction: trx
      }
    );

    const productLink = `/marketplace/product/${updatedSlug}`;

    return new ProductUpdatedDto(productLink);
  }

  private generateProductSlug(productName: string) {
    let slug = productName.toLowerCase();
    slug = slug.replace(/\s+/g, '-');
    slug = slug.replace(/[^\w\-]+/g, '');

    const randomNumber = String((Date.now() + Math.random()) * 10000).slice(-6);

    slug += `-${randomNumber}`;

    return slug;
  }

  private async uploadProductPictures(productPictures: Array<string>) {
    const picturesHashes = [];

    for (const pic of productPictures) {
      picturesHashes.push(await this.uploadProductPicture(pic));
    }

    return picturesHashes;
  }

  private async uploadProductPicture(productPicture: string) {
    const { accessKeyId, secretAccessKey, bucketName } =
      this.configService.awsSdkCredentials;

    const s3 = new S3({ accessKeyId, secretAccessKey });

    const base64Data = Buffer.from(
      productPicture.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    );

    const type = productPicture.split(';')[0].split('/')[1];

    if (type !== 'png') throw new WrongPictureException();

    const pictureHash = this.cryptographicService.hash({
      data: base64Data.toString() + Date.now().toString(),
      algorithm: CryptoHashAlgorithm.MD5
    });

    const params = {
      Bucket: bucketName,
      Key: `products/${pictureHash}.${type}`,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: `image/${type}`
    };

    await s3.upload(params).promise();

    return pictureHash;
  }

  private updatePictures(existingPics: Array<string>, newPics: Array<string>) {
    if (newPics.length > existingPics.length) {
      const newIndexes = newPics.filter((pic) => !existingPics.includes(pic));
      existingPics.push(...newIndexes);
    }

    if (newPics.length < existingPics.length) {
      const deleteIndexes = existingPics.filter(
        (pic) => !newPics.includes(pic)
      );
      deleteIndexes.forEach((pic) => {
        const index = existingPics.indexOf(pic);
        if (index !== -1) existingPics.splice(index, 1);
      });
    }

    return existingPics;
  }

  private isBase64Image(str: string): boolean {
    const base64Pattern = /^data:image\/(png);base64,([A-Za-z0-9+/=])+$/;
    return base64Pattern.test(str);
  }
}
