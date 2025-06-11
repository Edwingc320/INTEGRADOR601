import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Cliente } from './Cliente.model';

@Table({
  tableName: 'usuario',
  timestamps: false,
})
export class Usuario extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id_usuario: number;

  @Column(DataType.STRING(50))
  puesto: string;

  @Column(DataType.STRING(20))
  telefono: string;

  @Column(DataType.STRING(100))
  contrasena: string;

  @Column(DataType.STRING(100))
  correo: string;

  @Column(DataType.STRING(100))
  nombre: string;

  @HasMany(() => Cliente)
  clientes: Cliente[];
}
export default Usuario;