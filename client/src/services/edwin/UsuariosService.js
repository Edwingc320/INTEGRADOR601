// services/edwin/UsuariosService.js
import Http from '@/services/http.js'

export default class UsuariosService extends Http {
  static _instance

  constructor() {
    super()
    if (UsuariosService._instance) {
      return UsuariosService._instance
    }
    UsuariosService._instance = this
  }

  static get instance() {
    return this._instance ?? (this._instance = new this())
  }

  login(payload) {
    return super.post('usuarios/login', payload, false) // si tu backend tiene esta ruta
  }

  obtener() {
    return super.get('usuarios', null, true)
  }

  registrar(payload) {
    return super.post('usuarios', payload, true)
  }

  eliminar(id) {
    return super.delete('usuarios', id, true)
  }



  obtenerPorId(id) {
    return super.get(`usuarios/${id}`, null, true)
  }

  buscarPorNombre(nombre) {
  return super.get(`usuarios/buscar/nombre?nombre=${encodeURIComponent(nombre)}`, null, true)
  }
  actualizar(id_usuario, payload) {
  return super.put(`usuarios/${id_usuario}`, payload, true)
  }


}
