//OCUPACION SERVICE
import axios from 'axios'

class OcupacionService {
  constructor() {
    this.api = axios.create({
      //baseURL: 'http://localhost:3000/api/ocupaciones',
      baseURL: 'https://integrador601.onrender.com/api/ocupaciones',
      headers: { 'Content-Type': 'application/json' }
    })
  }

  obtenerTodos() {
    return this.api.get('/')
  }

  // ✅ Método nuevo para reservas pendientes
  //a
  obtenerReservasPendientesPorCliente(id_cliente) {
    return this.api.get(`/cliente/${id_cliente}/reservas-pendientes`)
  }

  obtenerOcupacionesReservadasPorCliente(id_cliente) {
    return this.api.get(`/cliente/${id_cliente}`)
  }



  obtenerPorId(id) {
    return this.api.get(`/${id}`)
  }

  crear(ocupacion) {
    return this.api.post('/', ocupacion)
  }

  actualizar(id, ocupacion) {
    return this.api.put(`/${id}`, ocupacion)
  }

  eliminar(id) {
    return this.api.delete(`/${id}`)
  }
}

export default new OcupacionService()
