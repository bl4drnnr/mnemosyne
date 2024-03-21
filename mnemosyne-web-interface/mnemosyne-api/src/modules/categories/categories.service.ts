import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '@models/category.model';
import { GetAllCategoriesInterface } from '@interfaces/get-all-categories.interface';
import { GetAllCategoriesDto } from '@dto/get-all-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private readonly categoryRepository: typeof Category
  ) {}

  async getAllCategories({ trx }: GetAllCategoriesInterface) {
    const allCategories = await this.categoryRepository.findAll({
      attributes: ['name', 'description', 'sub_categories'],
      transaction: trx
    });

    const categories = allCategories.map(
      ({ name, description, subCategories }) => {
        return { name, description, subCategories };
      }
    );

    return new GetAllCategoriesDto(categories);
  }
}
