import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { User } from '@models/user.model';

interface CompanyCreationAttributes {
  companyName: string;
  companyLocation: string;
  companyWebsite: string;
  companyOwnerId: string;
}

@Table({ tableName: 'companies' })
export class Company extends Model<Company, CompanyCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'company_name',
    unique: true
  })
  companyName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'company_location'
  })
  companyLocation: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'company_website' })
  companyWebsite: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'company_owner_id'
  })
  companyOwnerId: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_confirmed'
  })
  isConfirmed: boolean;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => User)
  users: Array<User>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
