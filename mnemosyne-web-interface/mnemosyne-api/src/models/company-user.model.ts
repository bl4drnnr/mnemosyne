import {
  BelongsTo,
  BelongsToMany,
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
import { Company } from '@models/company.model';
import { User } from '@models/user.model';
import { Role } from '@models/role.model';
import { UserRole } from '@models/user-role.model';

interface CompanyUserCreationAttributes {
  userId: string;
  companyId: string;
  invitationSentAt: Date;
}

@Table({ tableName: 'company_users' })
export class CompanyUser extends Model<
  CompanyUser,
  CompanyUserCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @ForeignKey(() => Company)
  @Column({ type: DataType.UUID, allowNull: false, field: 'company_id' })
  companyId: string;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'invitation_confirmed'
  })
  invitationConfirmed: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'invitation_sent_at'
  })
  invitationSentAt: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Company)
  company: Company;

  @BelongsToMany(() => Role, {
    through: {
      model: () => UserRole,
      unique: false
    }
  })
  roles: Array<Role>;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
