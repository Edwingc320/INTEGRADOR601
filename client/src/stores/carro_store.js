// carro_store.js
import { defineStore } from 'pinia'
import CarroService from '@/services/edwin/CarroService.js'

export const useCarroStore = defineStore('carro', {
  state: () => ({
    carros: [],
    carroActual: null,
    cargando: false,
    error: null
  }),

  actions: {
    async cargarCarros() {
      this.cargando = true
      try {
        const { data } = await CarroService.instance.obtenerTodos()
        this.carros = data.data
      } catch (err) {
        this.error = 'Error al cargar carros'
        console.error(err)
      } finally {
        this.cargando = false
      }
    },

    async obtenerCarro(id) {
      this.cargando = true
      try {
        const { data } = await CarroService.instance.obtenerPorId(id)
        this.carroActual = data.data
      } catch (err) {
        this.error = 'Error al obtener carro'
        console.error(err)
      } finally {
        this.cargando = false
      }
    },

      async crearCarro(carro) {
  try {
    // 1) Llamada al servicio
    const response = await CarroService.instance.crear(carro)
    // 2) Extraer el objeto recién creado:
    //    si viene anidado en response.data.data, lo usa, si no, toma response.data directamente.
    const nuevo = response.data.data ?? response.data
    console.log('Respuesta del backend (objeto carro):', nuevo)
    // 3) Guardar en estado y retornar:
    this.carros.push(nuevo)
    return nuevo
  } catch (err) {
    this.error = 'Error al crear carro'
    console.error('Error al crear carro:', err)
    throw err
  }
},





    async actualizarCarro(id, carro) {
      try {
        const { data } = await CarroService.instance.actualizar(id, carro)
        const index = this.carros.findIndex(c => c.id_carro === id)
        if (index !== -1) this.carros[index] = data.data
      } catch (err) {
        this.error = 'Error al actualizar carro'
        console.error(err)
      }
    },

    async eliminarCarro(id) {
      try {
        await CarroService.instance.eliminar(id)
        this.carros = this.carros.filter(c => c.id_carro !== id)
      } catch (err) {
        this.error = 'Error al eliminar carro'
        console.error(err)
      }
    }
  }
})
