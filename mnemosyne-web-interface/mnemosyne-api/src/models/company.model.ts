import {
  Column,
  CreatedAt,
  DataType,
  Default,
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
  companyOwnerEmail: string;
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

  @Column({ type: DataType.STRING, allowNull: false })
  companyOwnerEmail: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'is_confirmed'
  })
  isConfirmed: boolean;

  @HasMany(() => User)
  users: Array<User>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
