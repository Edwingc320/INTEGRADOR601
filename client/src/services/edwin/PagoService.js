//PAGO SERVICE

import axios from 'axios'

class PagoService {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000/api/pagos',
      headers: { 'Content-Type': 'application/json' }
    })
  }

  obtenerTodos() {
    return this.api.get('/')
  }

  obtenerPorId(id) {
    return this.api.get(`/${id}`)
  }

  crear(pago) {
    return this.api.post('/', pago)
  }

  actualizar(id, pago) {
    return this.api.put(`/${id}`, pago)
  }

  eliminar(id) {
    return this.api.delete(`/${id}`)
  }
}

export default new PagoService()
