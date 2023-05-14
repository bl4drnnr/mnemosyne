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
import { AccessControlList } from '@models/access-control-list.model';
import { AclEndpoint } from '@models/acl-endpoint.model';

@Table({ tableName: 'endpoints' })
export class Endpoint extends Model<Endpoint> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;

  @BelongsToMany(() => AccessControlList, () => AclEndpoint)
  acl: AccessControlList[];
}
