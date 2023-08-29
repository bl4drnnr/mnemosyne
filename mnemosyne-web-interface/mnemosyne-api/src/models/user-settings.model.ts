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

interface UserSettingsCreationAttributes {
  userId: string;
}

@Table({
  tableName: 'users_settings'
})
export class UserSettings extends Model<
  UserSettings,
  UserSettingsCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({ type: DataType.STRING, allowNull: true, unique: true })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'phone_code' })
  phoneCode: string;

  @Column({ type: DataType.DATE, allowNull: true, field: 'code_sent_at' })
  codeSentAt: Date;

  @Column({ type: DataType.STRING, allowNull: true, field: 'two_fa_token' })
  twoFaToken: string;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, allowNull: true, field: 'email_changed' })
  emailChanged: boolean;

  @Column({ type: DataType.DATE, allowNull: true, field: 'password_changed' })
  passwordChanged: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'recovery_keys_fingerprint'
  })
  recoveryKeysFingerprint: string;

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
