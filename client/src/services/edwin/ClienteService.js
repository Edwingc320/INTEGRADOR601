import Http from '@/services/http.js'
export default class ClienteService extends Http {
  static _instance

  constructor() {
    super()
    if (ClienteService._instance) return ClienteService._instance
    ClienteService._instance = this
  }

  static get instance() {
    return this._instance ?? (this._instance = new this())
  }

  obtenerTodos() {
    return super.get('clientes', null, true) // 🔁 antes decía 'cliente'
  }

  obtenerPorId(id) {
    return super.get(`clientes/${id}`, null, true)
  }

  obtenerPorUsuario(id_usuario) {
  return super.get(`clientes/por-usuario/${id_usuario}`, null, true)
  }



  crear(payload) {
    return super.post('clientes', payload, true)
  }

  actualizar(id, payload) {
    return super.put(`clientes/${id}`, payload, true)
  }

  eliminar(id) {
    return super.delete(`clientes/${id}`, null, true)
  }
}
