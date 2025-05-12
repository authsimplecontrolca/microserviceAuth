// models/Route.ts
import { Table, Column, Model, DataType, AllowNull } from 'sequelize-typescript';

@Table({ tableName: 'routes', timestamps: true })
export class Route extends Model<Route> {
  // Ruta almacenada
  @AllowNull(false)
  @Column(DataType.STRING)
  routePattern!: string;

  // Descripción de la ruta, por ejemplo, 'Acceso al perfil del usuario'
  @AllowNull(false)
  @Column(DataType.STRING)
  description!: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  isActive!: boolean;

  // Almacenar los roles que tienen acceso en un array
  @AllowNull(false)
  @Column(DataType.JSON) // Aquí usamos JSON para almacenar los IDs de los roles
  roleIds!: number[];
}
