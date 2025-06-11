<template>
  <v-card width="500" class="pa-4">
    <v-card-title>{{ esEdicion ? 'Editar Cliente' : 'Crear Cliente' }}</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="guardarCliente" ref="formRef" v-model="formValido">
        <v-text-field
          v-model="form.nombre"
          label="Nombre"
          :rules="[v => !!v || 'El nombre es requerido', v => v.length >= 3 || 'Mínimo 3 caracteres']"
          required
        />
        <v-text-field
          v-model="form.correo"
          label="Correo electrónico"
          type="email"
          :rules="[v => !!v || 'El correo es requerido', v => /.+@.+\..+/.test(v) || 'Correo no válido']"
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
          :rules="!esEdicion ? [
            v => !!v || 'La contraseña es requerida',
            v => v.length >= 8 || 'Mínimo 8 caracteres'
          ] : []"
          v-if="!esEdicion"
          required
        />
        <v-btn type="submit" color="primary" class="mt-4">
          {{ esEdicion ? 'Actualizar' : 'Crear' }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useClienteStore } from '@/stores/cliente_store'

const clienteStore = useClienteStore()
const route = useRoute()

const esEdicion = ref(!!route.params.id)
const formValido = ref(false)
const formRef = ref(null)

const form = reactive({
  nombre: '',
  correo: '',
  telefono: '',
  direccion: '',
  contrasena: '',
})

// Función para permitir solo números y máximo 10 dígitos
const soloNumeros = () => {
  form.telefono = form.telefono.replace(/\D/g, '').slice(0, 10)
}

// Si es edición, precargamos datos
onMounted(async () => {
  if (esEdicion.value) {
    await clienteStore.obtenerCliente(route.params.id)
    const cliente = clienteStore.clienteActual
    if (cliente) {
      form.nombre = cliente.nombre || ''
      form.correo = cliente.correo || ''
      form.telefono = cliente.telefono || ''
      form.direccion = cliente.direccion || ''
      // No cargamos contraseña por seguridad
    }
  }
})

const guardarCliente = async () => {
  const validado = await formRef.value.validate()
  if (!validado) return

  try {
    if (esEdicion.value) {
      await clienteStore.actualizarCliente(route.params.id, form)
      alert('Cliente actualizado correctamente')
    } else {
      await clienteStore.crearCliente(form)
      alert('Cliente creado correctamente')
    }
  } catch (error) {
    alert('Error: ' + error.message || error)
  }
}
</script>
