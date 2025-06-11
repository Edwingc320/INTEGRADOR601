// stores/pago.js
import { defineStore } from 'pinia'
import PagoService from '@/services/edwin/PagoService.js'
//import OcupacionService from '@/services/edwin/OcupacionService.js'
import { useOcupacionStore } from '@/stores/ocupacion_store'
export const usePagoStore = defineStore('pago', {
  state: () => ({
    pagos: [],
    cargando: false,
    error: null,
  }),

  actions: {
    /**
     * Crea un pago y luego actualiza la ocupación con su id_pago.
     * El objeto pagoPayload debe incluir la propiedad id_ocupacion.
     */
    async crearPagoYActualizarOcupacion(pagoPayload) {
        this.cargando = true
        this.error = null

        if (!pagoPayload.id_ocupacion) {
          this.cargando = false
          throw new Error('Falta id_ocupacion en el payload de pago')
        }

        try {
          // ✅ NO separamos id_ocupacion — lo mandamos completo
          //const { data: nuevoPago } = await PagoService.crear(pagoPayload)
          // que es un objeto { data: { … } } o directamente el pago.
          const respuesta = await PagoService.crear(pagoPayload)

          // Si viene anidado en .data.data, extráelo:
          const nuevoPago = respuesta.data?.data ?? respuesta.data ?? respuesta

          console.log('Pago creado REAL:', nuevoPago)
          console.log('Pago creado:', nuevoPago)
          console.log('Ocupación a actualizar:', pagoPayload.id_ocupacion)
          this.pagos.push(nuevoPago)


          // ...
          const ocupacionStore = useOcupacionStore()
          await ocupacionStore.actualizarOcupacion(pagoPayload.id_ocupacion, {
            id_pago: nuevoPago.id_pago ?? nuevoPago.id,
            estado: 'pagado'
          })



          return nuevoPago
        } catch (err) {
          this.error = 'Error al crear pago y/o actualizar ocupación'
          console.error(err)
          throw err
        } finally {
          this.cargando = false
        }
      },

      async cargarPagos() {
      this.cargando = true
      this.error = null
      try {
        const res = await fetch('/api/pagos')
        if (!res.ok) throw new Error('Error al cargar pagos')
        const json = await res.json()
        this.pagos = json.data ?? json
      } catch (err) {
        this.error = (err).message || 'Error desconocido'
      } finally {
        this.cargando = false
      }
    },

  }
})
