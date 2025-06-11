import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Ocupacion } from './Ocupacion.model';

@Table({
  tableName: 'cajones',
  timestamps: false,
})
export class Cajones extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id_cajon: number;

  @Column(DataType.STRING(10))
  numero: string;

  @Column(DataType.STRING(50))
  ubicacion: string;

  @Column(DataType.DECIMAL(10, 2))
  precio_hora: number;

  @Column(DataType.STRING(20))
  estado: string;

  @HasMany(() => Ocupacion)
  ocupaciones: Ocupacion[];
}
export default Cajones;