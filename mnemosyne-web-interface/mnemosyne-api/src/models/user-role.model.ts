import {
  Table,
  Model,
  ForeignKey,
  CreatedAt,
  Column,
  UpdatedAt,
  PrimaryKey,
  Default,
  DataType
} from 'sequelize-typescript';
import { Role } from '@models/role.model';
import { Company } from '@models/company.model';
import { CompanyUser } from '@models/company-user.model';

@Table({ tableName: 'users_roles' })
export class UserRole extends Model<UserRole> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => CompanyUser)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'company_user_id',
    unique: false
  })
  companyUserId: string;

  @ForeignKey(() => Company)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'company_id',
    unique: false
  })
  companyId: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'role_id',
    unique: false
  })
  roleId: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
