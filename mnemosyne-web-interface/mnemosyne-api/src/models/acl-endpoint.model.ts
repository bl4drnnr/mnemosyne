import {
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import { AccessControlList } from '@models/access-control-list.model';
import { Endpoint } from '@models/endpoint.model';

@Table({ tableName: 'acl_endpoint', createdAt: false, updatedAt: false })
export class AclEndpoint extends Model<AclEndpoint> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => AccessControlList)
  @Column({ type: DataType.UUID, field: 'acl_id' })
  aclId: string;

  @ForeignKey(() => Endpoint)
  @Column({ type: DataType.UUID, field: 'endpoint_id' })
  endpointId: string;
}
