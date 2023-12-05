import {
  BelongsTo,
  BelongsToMany,
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
import { CompanyUser } from '@models/company-user.model';
import { User } from '@models/user.model';
import { Role } from '@models/role.model';
import { UserRole } from '@models/user-role.model';

interface CompanyCreationAttributes {
  companyName: string;
  companyLocation: string;
  companyWebsite: string;
  companyOwnerId: string;
  tac: boolean;
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

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'tac'
  })
  tac: boolean;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => CompanyUser)
  companyUsers: Array<CompanyUser>;

  @BelongsToMany(() => Role, () => UserRole)
  roles: Array<Role>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
