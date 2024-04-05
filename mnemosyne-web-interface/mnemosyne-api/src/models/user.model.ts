import {
  Column,
  CreatedAt,
  DataType,
  Default,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { Session } from '@models/session.model';
import { ConfirmationHash } from '@models/confirmation-hash.model';
import { UserSettings } from '@models/user-settings.model';
import { Company } from '@models/company.model';
import { CompanyUser } from '@models/company-user.model';
import { Product } from '@models/product.model';

interface UserCreationAttributes {
  email: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'first_name' })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'last_name' })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'name_pronunciation'
  })
  namePronunciation: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'home_address' })
  homeAddress: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'home_phone' })
  homePhone: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_mfa_set'
  })
  isMfaSet: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'tac'
  })
  tac: boolean;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    field: 'favorite_products_ids'
  })
  favoriteProductsIds: Array<string>;

  @HasMany(() => Product)
  products: Array<Product>;

  @HasMany(() => ConfirmationHash)
  confirmationHashes: Array<ConfirmationHash>;

  @HasOne(() => Session)
  session: Session;

  @HasOne(() => Company)
  company: Company;

  @HasOne(() => CompanyUser)
  companyUser: CompanyUser;

  @HasOne(() => UserSettings)
  userSettings: UserSettings;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
