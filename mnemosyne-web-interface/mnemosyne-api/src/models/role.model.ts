import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { User } from '@models/user.model';
import { UserRole } from '@models/user-role.model';
import { AccessControlList } from '@models/access-control-list.model';
import { AclRole } from '@models/acl-role.model';

interface RoleCreationAttributes {
  value: string;
  description: string;
}

@Table({ tableName: 'roles' })
export class Role extends Model<Role, RoleCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  value: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @BelongsToMany(() => User, () => UserRole)
  users: User[];

  @BelongsToMany(() => AccessControlList, () => AclRole)
  acl: AccessControlList[];
}
