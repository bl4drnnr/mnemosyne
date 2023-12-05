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
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @ForeignKey(() => Company)
  @Column({ type: DataType.UUID, allowNull: false, field: 'company_id' })
  companyId: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, allowNull: false, field: 'role_id' })
  roleId: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
