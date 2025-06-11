// SERVICES/http.JS
import axios from 'axios'
// Importa constantes con la extensión .js para evitar problemas de resolución en Vite
import { OK, NO_DATA } from '@/utilities/constantes.js'
import { existePropiedad } from '@/utilities/objetos'
import { obtenerSesion, verificarSesion } from '@/seguridad/sesion'
import ENV from './config/env'

export default class Http {
  constructor() {
    this.apiUrl = ENV.API
  }

  handlePromise(promise) {
    return promise
      .then((response) => {
        if (!response) return Promise.resolve(NO_DATA)

        let data = response.data

        if (typeof data === 'string' || data instanceof Array) {
          return Promise.resolve(data)
        }

        if (typeof data === 'object') {
          let obj = ['id']
          let modo = obj.some((item) => existePropiedad(data, item)) ? 1 : 0

          if (modo === 0) {
            return Promise.resolve(existePropiedad(data, 'mensaje') ? data.mensaje : data)
          }

          return Promise.resolve(data)
        }

        return Promise.resolve(OK)
      })
      .catch((error) => {
        if (error.response) {
          if (typeof error.response.data === 'object') {
            let obj = []
            let modo = obj.some((item) => existePropiedad(error.response.data, item)) ? 1 : 0

            if (modo === 1) {
              return Promise.reject(error.response.data)
            }
          }

          return Promise.reject(error.response.data.mensaje || '¡Ocurrió un error!')
        }

        if (error.request) {
          return Promise.reject('Servidor fuera de línea!')
        }

        return Promise.reject(error.message || 'Error desconocido')
      })
  }

  applySecurity() {
    if (verificarSesion()) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${obtenerSesion()}`
    }
  }

  get(url, params = null, secure = false) {
    if (secure) {
      this.applySecurity()
    }
    if (!params) {
      return this.handlePromise(axios.get(`${this.apiUrl}${url}`))
    } else {
      return this.handlePromise(axios.get(`${this.apiUrl}${url}`, { params }))
    }
  }

  post(url, payload, secure = false, config = {}) {
    if (secure) {
      this.applySecurity()
    }
    if (!payload) {
      return Promise.reject('Payload requerido.')
    }
    return this.handlePromise(axios.post(`${this.apiUrl}${url}`, payload, config))
  }

  put(url, payload, secure = false) {
    if (secure) {
      this.applySecurity()
    }
    if (!payload) {
      return Promise.reject('Payload requerido.')
    }
    return this.handlePromise(axios.put(`${this.apiUrl}${url}`, payload))
  }

  patch(url, payload = null, secure = false) {
    if (secure) {
      this.applySecurity()
    }
    if (!payload) {
      return this.handlePromise(axios.patch(`${this.apiUrl}${url}`))
    }
    return this.handlePromise(axios.patch(`${this.apiUrl}${url}`, payload))
  }

  delete(url, payload, secure = false) {
    if (secure) {
      this.applySecurity()
    }
    const urls = `${this.apiUrl}${url}/${payload}`
    return this.handlePromise(axios.delete(urls))
  }

  postWithFiles(url, payload, secure = false) {
    if (secure) {
      this.applySecurity()
    }
    return this.handlePromise(
      axios.post(`${this.apiUrl}${url}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    )
  }
}
