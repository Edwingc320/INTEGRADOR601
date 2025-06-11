// stores/cajones_store.js

import { defineStore } from 'pinia'
import { CajonesService } from '@/services'
import { OK } from '@/utilities/constantes.js'
//import { c } from 'vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf'

export const useCajonesStore = defineStore('cajones_store', {
  state: () => ({
    cajones: [],
    cajonSeleccionado: null,
  }),

  getters: {
    cajonesDisponibles: (state) => state.cajones.filter(c => c.estado === 'libre'),
    totalCajones: (state) => state.cajones.length,
  },

  actions: {
    async obtenerCajones() {
        const resp = await CajonesService.instance.obtener()

        this.cajones = resp.data
        return OK
    },

    async obtenerCajonPorId(id) {
        const resp = await CajonesService.instance.obtenerPorId(id)
         console.log(resp.data)
        return resp.data

    },

    async crearCajon(payload) {
        const resp = await CajonesService.instance.crear(payload)
        this.cajones.push(resp.data)
        return resp.data
    },

    async actualizarCajon(id, payload) {
        const resp = await CajonesService.instance.actualizar(id, payload)
        const index = this.cajones.findIndex(c => c.id_cajon === id)
        if (index !== -1) this.cajones[index] = resp.data
        return resp.data
    },

    async eliminarCajon(id) {
        await CajonesService.instance.eliminar(id)
        this.cajones = this.cajones.filter(c => c.id_cajon !== id)
        return OK
    },

    async obtenerCajonesDisponibles() {
        const resp = await CajonesService.instance.obtenerDisponibles()
        console.log(resp.data)
        return resp.data


    },

    seleccionarCajon(cajon) {
      this.cajonSeleccionado = cajon
    },

    limpiarSeleccion() {
      this.cajonSeleccionado = null
    }
  },

  persist: true,
})
