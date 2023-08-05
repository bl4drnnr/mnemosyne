import {Column, CreatedAt, DataType, Default, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript";

interface CompanyCreationAttributes {}

@Table({ tableName: 'companies' })
export class Company extends Model<Company, CompanyCreationAttributes> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
