import Http from '@/services/http.js'

export default class CarroService extends Http {
  static _instance

  constructor() {
    super()
    if (CarroService._instance) return CarroService._instance
    CarroService._instance = this
  }

  static get instance() {
    return this._instance ?? (this._instance = new this())
  }

  obtenerTodos() {
    return super.get('carros', null, true)
  }

  obtenerPorId(id) {
    return super.get(`carros/${id}`, null, true)
  }

  crear(payload) {
    return super.post('carros', payload, true)
  }

  actualizar(id, payload) {
    return super.put(`carros/${id}`, payload, true)
  }

  eliminar(id) {
    return super.delete(`carros/${id}`, null, true)
  }
}
