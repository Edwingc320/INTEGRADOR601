import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Cliente } from './Cliente.model';
import { Ocupacion } from './Ocupacion.model';

@Table({
  tableName: 'pago',
  timestamps: false,
})
export class Pago extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id_pago!: number;

  @Column(DataType.STRING(50))
  metodo!: string;

  @Column(DataType.DECIMAL(10, 2))
  monto!: number;

  @Column(DataType.DATE)
  fecha_pago!: Date;

  @Column(DataType.STRING(20))
  estado!: string;

  @Column(DataType.TEXT)
  descripcion!: string;

  @Column(DataType.STRING(100))
  referencia!: string;

  @Column(DataType.STRING(50))
  tipo!: string;

  @ForeignKey(() => Cliente)
  @Column(DataType.INTEGER)
  id_cliente!: number;

  @BelongsTo(() => Cliente)
  cliente!: Cliente;

  @ForeignKey(() => Ocupacion)
  @Column(DataType.INTEGER)
  id_ocupacion!: number;

  @BelongsTo(() => Ocupacion)
  ocupacion!: Ocupacion;
}
export default Pago;
