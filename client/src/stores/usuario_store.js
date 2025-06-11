// stores/usuarioStore.ts
import { defineStore } from 'pinia'
import { UsuariosService } from '@/services'
import { crearSesion } from '@/seguridad/sesion'
import { OK } from '@/utilities/constantes.js'

export const useUsuarioStore = defineStore('usuario_store', {
  state: () => ({
    usuarios: [],
    logueado: false,
    usuarioActual: null, // NUEVO
  }),

  getters: {
    esUsuarioLogueado: (state) => state.logueado === true,
  },

  actions: {
      async login(payload) {
      try {
        const response = await UsuariosService.instance.login(payload)
        const usuario = response.data
        crearSesion(OK, usuario)
        this.usuarioActual = usuario
        return response

      } catch (err) {
        this.usuarioActual = null
        this.logueado = false
        throw err
      }
    },


    async crearUsuario(payload) {
      const resp = await UsuariosService.instance.registrar(payload)
      // resp.data es { data: { id_usuario: ..., ... } } ó { id_usuario: ..., ... }
      // Ajusta según la forma exacta de tu API:
      const usuario = resp.data.data ?? resp.data
      return usuario
    },

    async obtenerUsuarios() {

        const resp = await UsuariosService.instance.obtener()
        this.usuarios = resp
        return OK

    },


    async eliminarUsuario(id_usuario) {
    return await UsuariosService.instance.eliminar(id_usuario)
    },

    // Método para actualizar usuario
    async actualizarUsuario(id_usuario, payload) {

        const respuesta = await UsuariosService.instance.actualizar(id_usuario, payload)
        // Opcional: actualizar la lista local de usuarios después de modificar
        const index = this.usuarios.findIndex(u => u.id_usuario === id_usuario)
        if (index !== -1) {
          this.usuarios[index] = respuesta // o respuesta.data, según cómo venga el backend
        }
        return respuesta

    },




    async obtenerUsuarioPorId(id) {
      return await UsuariosService.instance.obtenerPorId(id)
    },


     async buscarUsuarioPorNombre(nombre) {
      const resp = await UsuariosService.instance.buscarPorNombre(nombre)
      this.usuarios = resp.data // si no quieres sobrescribir `usuarios`, elimina esta línea
      return resp.data
    },

  },

  persist: true,
})
