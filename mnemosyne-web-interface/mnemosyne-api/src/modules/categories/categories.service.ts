import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from '@models/category.model';
import { GetAllCategoriesInterface } from '@interfaces/get-all-categories.interface';
import { GetAllCategoriesDto } from '@dto/get-all-categories.dto';
import { GetCategoryByNameInterface } from '@interfaces/get-category-by-name.interface';
import { CategoryNotFoundException } from '@exceptions/category-not-found.exception';
import { GetAllSubcategoriesInterface } from '@interfaces/get-all-subcategories.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category)
    private readonly categoryRepository: typeof Category
  ) {}

  async getAllCategories({ trx }: GetAllCategoriesInterface) {
    const allCategories = await this.categoryRepository.findAll({
      attributes: ['name', 'description', 'subCategories'],
      transaction: trx
    });

    const categories = allCategories.map(
      ({ name, description, subCategories }) => {
        return { name, description, subCategories };
      }
    );

    return new GetAllCategoriesDto(categories);
  }

  async getAllSubcategories({ trx }: GetAllSubcategoriesInterface) {
    const { categories } = await this.getAllCategories({ trx });
    const allSubcategories = [];

    categories.forEach(({ subCategories }) => {
      subCategories.forEach((subCategory) => {
        allSubcategories.push(subCategory);
      });
    });

    return allSubcategories;
  }

  async getCategoryByName({ name, trx }: GetCategoryByNameInterface) {
    const category = await this.categoryRepository.findOne({
      where: { name },
      transaction: trx
    });

    if (!category) throw new CategoryNotFoundException();

    return category;
  }
}
