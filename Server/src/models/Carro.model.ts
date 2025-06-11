import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Cliente } from './Cliente.model';
import { Ocupacion } from './Ocupacion.model';

@Table({
  tableName: 'carro',
  timestamps: false,
})
export class Carro extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id_carro: number;

  @Column(DataType.STRING(20))
  placas: string;

  @Column(DataType.STRING(50))
  numero_serie: string;

  @ForeignKey(() => Cliente)
  @Column(DataType.INTEGER)
  id_cliente: number;

  @BelongsTo(() => Cliente)
  cliente: Cliente;

  @HasMany(() => Ocupacion)
  ocupaciones: Ocupacion[];
}
export default Carro;