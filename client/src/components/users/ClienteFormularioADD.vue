<!-- components/FormularioCREARCLIENTE/USUARIO.vue -->
<template>
  <v-card width="500" class="pa-4">
    <v-card-title>Crear Cliente</v-card-title>

    <v-card-text>
      <v-form @submit.prevent="guardarCliente" ref="formRef" v-model="formValido">
        <v-text-field
          v-model="form.nombre"
          label="Nombre"
          :rules="[
            v => !!v || 'El nombre es requerido',
            v => v.length >= 3 || 'Mínimo 3 caracteres'
          ]"
          required
        />
        <v-text-field
          v-model="form.correo"
          label="Correo electrónico"
          type="email"
          :rules="[
            v => !!v || 'El correo es requerido',
            v => /.+@.+\..+/.test(v) || 'Correo no válido'
          ]"
          required
        />
        <v-text-field
          v-model="form.telefono"
          label="Teléfono"
          type="tel"
          maxlength="10"
          :rules="[
            v => !!v || 'El teléfono es requerido',
            v => /^\d{10}$/.test(v) || 'Debe tener exactamente 10 dígitos'
          ]"
          @input="soloNumeros"
          required
        />
        <v-text-field
          v-model="form.direccion"
          label="Dirección"
          :rules="[v => !!v || 'La dirección es requerida']"
          required
        />
        <v-text-field
          v-model="form.contrasena"
          label="Contraseña"
          type="password"
          :rules="[
            v => !!v || 'La contraseña es requerida',
            v => v.length >= 8 || 'Mínimo 8 caracteres'
          ]"
          required
        />

        <v-btn type="submit" color="primary" class="mt-4">
          Crear Cliente
        </v-btn>
      </v-form>
    </v-card-text>

    <v-card-actions class="justify-center">
      <router-link to="/login">
        <v-btn text color="secondary">
          Volver a Login
        </v-btn>
      </router-link>
    </v-card-actions>
  </v-card>
</template>


<script setup>
//asynchronousaa
import { reactive, ref } from 'vue'
import { useUsuarioStore } from '@/stores/usuario_store'
import { useClienteStore } from '@/stores/cliente_store'

const usuarioStore = useUsuarioStore()
const clienteStore = useClienteStore()

const formValido = ref(false)
const formRef = ref(null)

const form = reactive({
  nombre: '',
  correo: '',
  telefono: '',
  direccion: '',
  contrasena: ''
})

const soloNumeros = () => {
  form.telefono = form.telefono.replace(/\D/g, '').slice(0, 10)
}

const guardarCliente = async () => {
  const validado = await formRef.value.validate()
  if (!validado) return

  try {
    // Crear el usuario
    const usuarioPayload = {
      nombre: form.nombre,
      correo: form.correo,
      telefono: form.telefono,
      contrasena: form.contrasena,
      puesto: 'CLIENTE'
    }

    const usuarioCreado = await usuarioStore.crearUsuario(usuarioPayload)


    if (!usuarioCreado || !usuarioCreado.id_usuario) {
      throw new Error('No se pudo obtener el ID del usuario creado')
    }

    // Crear el cliente con el ID del usuario
    const clientePayload = {
      nombre: form.nombre,
      correo: form.correo,
      telefono: form.telefono,
      direccion: form.direccion,
      contrasena: form.contrasena,
      id_usuario: usuarioCreado.id_usuario

    }

    await clienteStore.crearCliente(clientePayload)

    alert('Cliente y usuario creados correctamente')
    // Limpiar formulario
    form.nombre = ''
    form.correo = ''
    form.telefono = ''
    form.direccion = ''
    form.contrasena = ''
    formRef.value.resetValidation()

  } catch (error) {
    alert('Error al crear cliente/usuario: ' + (error.message || error))
    console.error(error)
  }
}

</script>

<style scoped>
.router-link.btn {
  text-decoration: none; /* quita subrayado */
  color: white;           /* fuerza color del texto */
}

</style>
