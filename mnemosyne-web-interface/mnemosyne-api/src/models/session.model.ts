import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt
} from 'sequelize-typescript';

interface SessionCreationAttributes {
  tokenId: string;
  userId: string;
}

@Table({
  tableName: 'sessions'
})
export class Session extends Model<Session, SessionCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.UUID, allowNull: false, field: 'token_id' })
  tokenId: string;

  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
