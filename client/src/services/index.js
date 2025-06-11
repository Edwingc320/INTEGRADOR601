import UsuariosService from "/src/services/edwin/UsuariosService.js"
import ClienteService from "/src/services/edwin/ClienteService.js"
import CajonesService from "/src/services/edwin/CajonesService.js"
import OcupacionService from "/src/services/edwin/OcupacionService.js"
import PagoService from "/src/services/edwin/PagoService.js"
import CarroService from "/src/services/edwin/CarroService.js"

export {
  UsuariosService,
  ClienteService,
  CajonesService ,// ✅ Agrégalo aquí
  CarroService
}

export default {
  UsuariosService: UsuariosService.instance,
  ClienteService: ClienteService.instance,
  CajonesService: CajonesService.instance,
  OcupacionService: OcupacionService.instance,
  PagoService: PagoService.instance,
  CarroService: CarroService.instance
}
