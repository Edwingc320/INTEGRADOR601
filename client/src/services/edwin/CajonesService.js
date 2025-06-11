//CajonesService.js
import Http from '@/services/http.js'

export default class CajonesService extends Http  {
  static _instance

  constructor() {
    super()
    if (CajonesService._instance) {
      return CajonesService._instance
    }
    CajonesService._instance = this
  }

  static get instance() {
    return this._instance ?? (this._instance = new this())
  }

  obtener() {
    // GET /api/cajones
    return super.get('cajones', null, true)
  }

  obtenerPorId(id) {
    // GET /api/cajones/:id
    return super.get(`cajones/${id}`, null, true)
  }

  crear(payload) {
    // POST /api/cajones
    return super.post('cajones', payload, true)
  }

  actualizar(id, payload) {
    // PUT /api/cajones/:id
    return super.put(`cajones/${id}`, payload, true)
  }

  eliminar(id) {
    // DELETE /api/cajones/:id
    return super.delete(`cajones/${id}`, null, true)
  }

  obtenerDisponibles() {
    // GET /api/cajones/disponibles
    return super.get('cajones/disponibles', null, true)
  }
}
