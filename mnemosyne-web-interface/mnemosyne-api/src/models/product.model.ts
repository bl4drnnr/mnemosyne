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

const currencyTypes = [
  ProductCurrency.EUR,
  ProductCurrency.USD,
  ProductCurrency.PLN
];

interface ProductCreationAttributes {
  name: string;
  slug: string;
  description: string;
  picture: string;
  currency: ProductCurrency;
  price: number;
  userId: string;
}

@Table({ tableName: 'products' })
export class Product extends Model<Product, ProductCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  slug: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.STRING, allowNull: false })
  picture: string;

  @Column({
    type: DataType.ENUM(...currencyTypes),
    allowNull: false
  })
  currency: ProductCurrency;

  @Column({ type: DataType.DOUBLE, allowNull: false })
  price: number;

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
