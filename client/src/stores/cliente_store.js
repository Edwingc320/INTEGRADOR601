import { defineStore } from 'pinia'
import ClienteService from '@/services/edwin/ClienteService.js'

export const useClienteStore = defineStore('cliente', {
  state: () => ({
    clientes: [],
    clienteActual: null,
    cargando: false,
    error: null
  }),

  actions: {
    async cargarClientes() {
      this.cargando = true
      try {
        const { data } = await ClienteService.instance.obtenerTodos()
        this.clientes = data.data
      } catch (err) {
        this.error = 'Error al cargar clientes'
        console.error(err)
      } finally {
        this.cargando = false
      }
    },

    async obtenerCliente(id) {
      this.cargando = true
      try {
        const { data } = await ClienteService.instance.obtenerPorId(id)
        this.clienteActual = data.data
      } catch (err) {
        this.error = 'Error al obtener cliente'
        console.error(err)
      } finally {
        this.cargando = false
      }
    },

     async obtenerClientePorUsuario(id_usuario) {
  this.cargando = true
  try {
    const response = await ClienteService.instance.obtenerPorUsuario(id_usuario)
    this.clienteActual = response.data  // <--- aquí debe ir response.data.data
    return response.data
  } catch (err) {
    this.error = 'Error al obtener cliente por usuario'
    console.error(err)
  } finally {
    this.cargando = false
  }
},







    // Después:
    async crearCliente(payload) {
      try {
        const resp = await ClienteService.instance.crear(payload)
        // Extrae el cliente de donde lo mande tu API:
        const cliente = resp.data?.data ?? resp.data
        this.clientes.push(cliente)
        return cliente          // ¡Devolvemos el objeto completo!
      } catch (err) {
        this.error = 'Error al crear cliente'
        console.error('Error en store crearCliente:', err)
        throw err
      }
    },

    async actualizarCliente(id, cliente) {
      try {
        const { data } = await ClienteService.instance.actualizar(id, cliente)
        const index = this.clientes.findIndex(c => c.id_cliente === id)
        if (index !== -1) this.clientes[index] = data.data
      } catch (err) {
        this.error = 'Error al actualizar cliente'
        console.error(err)
      }
    },

    async eliminarCliente(id) {
      try {
        await ClienteService.instance.eliminar(id)
        this.clientes = this.clientes.filter(c => c.id_cliente !== id)
      } catch (err) {
        this.error = 'Error al eliminar cliente'
        console.error(err)
      }
    },




  }
})
