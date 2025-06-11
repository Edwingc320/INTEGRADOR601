<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Iniciar sesión</v-toolbar-title>
          </v-toolbar>

          <v-card-text v-if="mensajeVisible">
            <v-alert :icon="icono" :text="mensaje" title="Respuesta" :type="tipo" />
          </v-card-text>

          <v-card-text>
            <v-form v-model="valid">
              <v-text-field
                v-model="usuario"
                label="Usuario"
                :rules="[rules.required]"
                required
                prepend-icon="mdi-account"
              />
              <v-text-field
                v-model="contrasenia"
                label="Contraseña"
                type="password"
                :rules="[rules.required]"
                required
                prepend-icon="mdi-lock"
              />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" :disabled="!valid" @click="login">
              Entrar
            </v-btn>
          </v-card-actions>

          <v-card-actions class="justify-center">
            <router-link to="/usuariosCliente/registro">
              <v-btn text color="secondary">
                Crear cuenta
              </v-btn>
            </router-link>
          </v-card-actions>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '@/stores/usuario_store'

const router = useRouter()
const usuarioStore = useUsuarioStore()

const usuario = ref('')
const contrasenia = ref('')
const valid = ref(false)
const mensaje = ref('')
const tipo = ref('')
const mensajeVisible = ref(false)
const icono = ref('')

const rules = {
  required: (v) => !!v || 'Este campo es obligatorio.',
}

async function login() {
  mensajeVisible.value = false
  if (!valid.value) return

  try {
    const payload = {
      nombre: usuario.value,
      contrasena: contrasenia.value,
    }

    const resp = await usuarioStore.login(payload)

    mensaje.value = resp.message || 'Acceso concedido'
    tipo.value = 'success'
    icono.value = 'mdi-check-circle'

    // ✅ Redirige según el rol del usuario
    const puesto = usuarioStore.usuarioActual?.puesto
    if (puesto === 'ADMINISTRADOR') {
      router.push('/admin')
    } else if (puesto === 'CLIENTE') {
      router.push('/users')
    } else {
      mensaje.value = 'Rol no reconocido'
      tipo.value = 'warning'
      icono.value = 'mdi-alert-circle'
    }

  } catch (err) {
    mensaje.value = err?.message || err || 'Error en login'
    tipo.value = 'error'
    icono.value = 'mdi-alert-circle'
  } finally {
    mensajeVisible.value = true
  }
}
</script>
