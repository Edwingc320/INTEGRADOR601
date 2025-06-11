import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Carro } from './Carro.model';
import { Cajones } from './Cajones.model';
import { Cliente } from './Cliente.model';
import { Pago } from './Pago.model'; // ✅ Asegúrate de que esté bien importado

@Table({
  tableName: 'ocupacion',
  timestamps: false,
})
export class Ocupacion extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id_ocupacion!: number;

  @ForeignKey(() => Carro)
  @Column({ type: DataType.INTEGER, allowNull: true })
  id_carro?: number;

  @BelongsTo(() => Carro)
  carro?: Carro;

  @ForeignKey(() => Cajones)
  @Column({ type: DataType.INTEGER, allowNull: true })
  id_cajon?: number;

  @BelongsTo(() => Cajones)
  cajon?: Cajones;

  @ForeignKey(() => Cliente)
  @Column({ type: DataType.INTEGER, allowNull: true })
  id_cliente?: number;

  @BelongsTo(() => Cliente)
  cliente?: Cliente;

  @ForeignKey(() => Pago)
  @Column({ type: DataType.INTEGER, allowNull: true })
  id_pago?: number;

  @BelongsTo(() => Pago)
  pago?: Pago;

  @Column({ type: DataType.DATE, allowNull: true })
  hora_entrada?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  hora_salida?: Date;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  fecha_reservacion?: Date;

  @Column({ type: DataType.STRING(20), allowNull: true })
  estado?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  observaciones?: string;
}


export default Ocupacion;
