import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Usuario } from './Usuario.model';
import { Carro } from './Carro.model';

@Table({
  tableName: 'cliente',
  timestamps: false,
})
export class Cliente extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id_cliente: number;

  @Column(DataType.STRING(100))
  nombre: string;

  @Column(DataType.STRING(100))
  correo: string;

  @Column(DataType.STRING(20))
  telefono: string;

  @Column(DataType.STRING(150))
  direccion: string;

  @Column(DataType.STRING(100))
  contrasena: string;

  @ForeignKey(() => Usuario)
  @Column(DataType.INTEGER)
  id_usuario: number;

  @BelongsTo(() => Usuario)
  usuario: Usuario;

  @HasMany(() => Carro)
  carros: Carro[];
}
export default Cliente;