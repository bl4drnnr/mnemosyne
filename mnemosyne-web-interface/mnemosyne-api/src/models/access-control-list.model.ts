import {
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';
import { Role } from '@models/role.model';
import { Endpoint } from '@models/endpoint.model';

interface AccessControlListCreationAttributes {
  permissions: 'read' | 'write' | 'full';
}

@Table({ tableName: 'access_control_list' })
export class AccessControlList extends Model<
  AccessControlList,
  AccessControlListCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => Role)
  @Column({ type: DataType.UUID, field: 'role_id' })
  roleId: string;

  @ForeignKey(() => Endpoint)
  @Column({ type: DataType.UUID, field: 'endpoint_id' })
  endpointId: string;

  @Column({ type: DataType.ENUM('read', 'write', 'full'), allowNull: false })
  permissions: 'read' | 'write' | 'full';

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
