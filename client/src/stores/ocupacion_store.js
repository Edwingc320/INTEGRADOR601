//Ocupacion store
import { defineStore } from 'pinia'
import OcupacionService from '@/services/edwin/OcupacionService.js'

export const useOcupacionStore = defineStore('ocupacion', {
  state: () => ({
    ocupaciones: [],
    ocupacionActual: null,
    cargando: false,
    error: null
  }),
  actions: {
    async crearOcupacion(ocupacion) {
      this.cargando = true
      this.error = null
      try {
        const { data } = await OcupacionService.crear(ocupacion)
        // Aquí asumo que la respuesta es la ocupación creada directamente (no envuelta en data.data)
        if (!this.ocupaciones.find(o => o.id_ocupacion === data.id_ocupacion)) {
          this.ocupaciones.push(data)
        }
        return data
      } catch (err) {
        this.error = 'Error al crear ocupación'
        console.error(err)
        throw err
      } finally {
        this.cargando = false
      }
    },

    async cargarOcupaciones() {
      this.cargando = true
      this.error = null
      try {
        const { data } = await OcupacionService.obtenerTodos()
        // Asumo que la respuesta es { data: [...] }
        this.ocupaciones = data.data ?? data
      } catch (err) {
        this.error = 'Error al cargar ocupaciones'
        console.error(err)
      } finally {
        this.cargando = false
      }
    },

    async obtenerOcupacionesReservadas() {
      this.cargando = true
      this.error = null
      try {
        const { data } = await OcupacionService.obtenerTodos()
        // Filtra solo las ocupaciones con estado "reservado"
        const todas = data.data ?? data
        this.ocupaciones = todas.filter(o => o.estado === 'reservado')
        return this.ocupaciones
      } catch (err) {
        this.error = 'Error al obtener ocupaciones reservadas'
        console.error(err)
        return []
      } finally {
        this.cargando = false
      }
    },

    async obtenerOcupacionesReservadasPorCliente(id_cliente) {
      this.cargando = true
      this.error = null
      try {
        const response = await OcupacionService.obtenerOcupacionesReservadasPorCliente(id_cliente)
        this.ocupaciones = response.data
      } catch (err) {
        this.error = 'Error al cargar ocupaciones reservadas'
        console.error(err)
        this.ocupaciones = []
      } finally {
        this.cargando = false
      }
    },

    async obtenerReservasPendientesPorCliente(id_cliente) {
      this.cargando = true
      this.error = null
      try {
        const response = await OcupacionService.obtenerReservasPendientesPorCliente(id_cliente)
        // Puedes guardar o retornar directamente
        this.ocupaciones = Array.isArray(response.data) ? response.data : (response.data.data ?? [])
      } catch (err) {
        this.error = 'Error al obtener reservas pendientes'
        console.error(err)
        return []
      } finally {
        this.cargando = false
      }
    },









    async obtenerOcupacion(id) {
      this.cargando = true
      this.error = null
      try {
        const { data } = await OcupacionService.obtenerPorId(id)
        // Asumo que la respuesta es { data: {...} }
        this.ocupacionActual = data.data ?? data
      } catch (err) {
        this.error = 'Error al obtener ocupación'
        console.error(err)
      } finally {
        this.cargando = false
      }
    },

    async actualizarOcupacion(id, ocupacion) {
      this.cargando = true
      this.error = null
      try {
        const { data } = await OcupacionService.actualizar(id, ocupacion)
        const ocupacionActualizada = data.data ?? data
        const index = this.ocupaciones.findIndex(o => o.id_ocupacion === id)
        if (index !== -1) this.ocupaciones[index] = ocupacionActualizada
        return ocupacionActualizada  // ✅ retorna la actualización
      } catch (err) {
        this.error = 'Error al actualizar ocupación'
        console.error(err)
        throw err // ✅ relanza el error por si quieres capturarlo fuera
      } finally {
        this.cargando = false
      }
    },


    async eliminarOcupacion(id) {
      this.cargando = true
      this.error = null
      try {
        await OcupacionService.eliminar(id)
        this.ocupaciones = this.ocupaciones.filter(o => o.id_ocupacion !== id)
      } catch (err) {
        this.error = 'Error al eliminar ocupación'
        console.error(err)
      } finally {
        this.cargando = false
      }
    },

    limpiarError() {
      this.error = null
    },

    limpiarOcupacionActual() {
      this.ocupacionActual = null
    },







  }
})
