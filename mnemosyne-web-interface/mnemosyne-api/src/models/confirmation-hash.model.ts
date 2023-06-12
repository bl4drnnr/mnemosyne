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
import { ApiProperty } from '@nestjs/swagger';

interface ConfirmationHashCreationAttributes {
  userId: string;
  confirmationHash: string;
  confirmationType: 'EMAIL_CHANGE' | 'REGISTRATION' | 'FORGOT_PASSWORD';
  changingEmail?: string;
}

@Table({
  tableName: 'confirmation_hashes'
})
export class ConfirmationHash extends Model<
  ConfirmationHash,
  ConfirmationHashCreationAttributes
> {
  @ApiProperty({
    type: String,
    nullable: false,
    default: 'uuidv4',
    description: 'Unique Id of the record'
  })
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ApiProperty({
    type: String,
    nullable: false,
    description: 'Confirmation hash'
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'confirmation_hash'
  })
  confirmationHash: string;

  @ApiProperty({
    type: Boolean,
    nullable: false,
    description: 'If hash has been confirmed'
  })
  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: false })
  confirmed: boolean;

  @ApiProperty({
    type: Boolean,
    nullable: false,
    description: 'Type of confirmation'
  })
  @Column({
    type: DataType.ENUM('EMAIL_CHANGE', 'REGISTRATION', 'FORGOT_PASSWORD'),
    allowNull: false,
    field: 'confirmation_type'
  })
  confirmationType: 'EMAIL_CHANGE' | 'REGISTRATION' | 'FORGOT_PASSWORD';

  @ApiProperty({
    type: String,
    nullable: true,
    description: 'Used for temporary storage of email to change'
  })
  @Default(null)
  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'changing_email'
  })
  changingEmail?: string;

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: false,
    description: 'User Id'
  })
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @ApiProperty({
    type: Date,
    nullable: false,
    description: 'Record creation date'
  })
  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    nullable: false,
    description: 'Record update date'
  })
  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
