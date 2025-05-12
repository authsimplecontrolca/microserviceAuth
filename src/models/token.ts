import { Table, Column, Model, DataType, Default, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'tokens', timestamps: true })
export class Token extends Model<Token> {
  @AllowNull(false)
  @Column(DataType.TEXT)
  token!: string;

  @AllowNull(false)
  @Column(DataType.BIGINT)
  userId!: number;

  @Default(true)
  @Column(DataType.BOOLEAN)
  isActive?: boolean;
}
