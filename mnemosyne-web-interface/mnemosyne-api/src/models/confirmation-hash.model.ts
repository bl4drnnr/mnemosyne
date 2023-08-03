import {
  BelongsTo,
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
import { User } from '@models/user.model';
import { CONFIRMATION_TYPE } from '@interfaces/confirmation-type.types';

interface ConfirmationHashCreationAttributes {
  userId: string;
  confirmationHash: string;
  confirmationType: CONFIRMATION_TYPE;
  changingEmail?: string;
}

@Table({
  tableName: 'confirmation_hashes'
})
export class ConfirmationHash extends Model<
  ConfirmationHash,
  ConfirmationHashCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'confirmation_hash'
  })
  confirmationHash: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  confirmed: boolean;

  @Column({
    type: DataType.ENUM('EMAIL_CHANGE', 'REGISTRATION', 'FORGOT_PASSWORD'),
    allowNull: false,
    field: 'confirmation_type'
  })
  confirmationType: CONFIRMATION_TYPE;

  @Default(null)
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'changing_email'
  })
  changingEmail: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
