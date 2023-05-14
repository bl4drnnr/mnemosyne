import {
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import { Role } from '@models/role.model';
import { AccessControlList } from '@models/access-control-list.model';

@Table({ tableName: 'acl_role', createdAt: false, updatedAt: false })
export class AclRole extends Model<AclRole> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => AccessControlList)
  @Column({ type: DataType.UUID, field: 'acl_id' })
  aclId: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, field: 'role_id' })
  roleId: string;
}
