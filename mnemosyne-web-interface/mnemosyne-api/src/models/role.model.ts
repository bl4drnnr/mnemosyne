import {
  Table,
  Column,
  Model,
  BelongsToMany,
  PrimaryKey,
  Default,
  DataType,
  CreatedAt,
  UpdatedAt
} from 'sequelize-typescript';
import { CompanyUser } from '@models/company-user.model';
import { UserRole } from '@models/user-role.model';
import { Company } from '@models/company.model';
import { RoleScope } from '@custom-types/role-scope.type';
import { Scopes } from '@interfaces/role-scopes.enum';

const roleScopes = [
  Scopes.USER_MANAGEMENT,
  Scopes.ROLES_MANAGEMENT,
  Scopes.COMPANY_INFORMATION_MANAGEMENT
];

@Table({ tableName: 'roles' })
export class Role extends Model<Role> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({
    type: DataType.ARRAY(DataType.ENUM(...roleScopes)),
    allowNull: false,
    field: 'role_scopes'
  })
  roleScopes: Array<RoleScope>;

  @BelongsToMany(() => CompanyUser, () => UserRole)
  users: Array<CompanyUser>;

  @BelongsToMany(() => Company, () => UserRole)
  companies: Array<Company>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
