import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { ProductCurrency } from '@interfaces/product-currency.enum';
import { User } from '@models/user.model';
import { Category } from '@models/category.model';
import { ProductSubcategory } from '@interfaces/product-subcategory.enum';

const currencyTypes = [
  ProductCurrency.EUR,
  ProductCurrency.USD,
  ProductCurrency.PLN
];

const productSubcategories = [
  ProductSubcategory.KITCHEN,
  ProductSubcategory.BEDROOM,
  ProductSubcategory.BATHROOM,
  ProductSubcategory.DECORATION,
  ProductSubcategory.HIKING,
  ProductSubcategory.CYCLING,
  ProductSubcategory.SWIMMING,
  ProductSubcategory.FINANCE,
  ProductSubcategory.EQUIPMENT,
  ProductSubcategory.BUSINESS_SOFTWARE,
  ProductSubcategory.SERVICE,
  ProductSubcategory.INGREDIENTS,
  ProductSubcategory.DISHES,
  ProductSubcategory.COOKING_BOOKS,
  ProductSubcategory.SPORTS_EQUIPMENT,
  ProductSubcategory.TRAIN,
  ProductSubcategory.HARDWARE,
  ProductSubcategory.SOFTWARE,
  ProductSubcategory.IT_BOOKS
];

interface ProductCreationAttributes {
  title: string;
  slug: string;
  description: string;
  pictures: Array<string>;
  location: string;
  currency: ProductCurrency;
  price: number;
  subcategory: ProductSubcategory;
  contactPerson: string;
  contactPhone: string;
  userId: string;
  categoryId: string;
}

@Table({ tableName: 'products' })
export class Product extends Model<Product, ProductCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  slug: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  pictures: Array<string>;

  @Column({ type: DataType.STRING, allowNull: false })
  location: string;

  @Column({
    type: DataType.ENUM(...currencyTypes),
    allowNull: false
  })
  currency: ProductCurrency;

  @Column({ type: DataType.DOUBLE, allowNull: false })
  price: number;

  @Column({ type: DataType.ENUM(...productSubcategories), allowNull: false })
  subcategory: ProductSubcategory;

  @Column({ type: DataType.STRING, allowNull: false, field: 'contact_person' })
  contactPerson: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'contact_phone' })
  contactPhone: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.UUID, allowNull: false, field: 'category_id' })
  categoryId: string;

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
