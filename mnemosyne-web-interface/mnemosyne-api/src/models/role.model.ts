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

// @TODO Add all needed fields for roles including name, description and scopes, and refactor the code, where previous tables were deleted (for example, JWT tokens) in order to check not only roles, but also scopes
@Table({ tableName: 'roles' })
export class Role extends Model<Role> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

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
