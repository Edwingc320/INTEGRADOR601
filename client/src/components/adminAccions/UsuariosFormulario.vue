<template>
  <v-card
      width="600"
      class="pa-6 elevation-8 rounded-lg"
      style="background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%); color: black;"
    >
    <v-card-title>{{ esEdicion ? 'Editar Usuario' : 'Crear Usuario' }}</v-card-title>
    <v-card-text class="content">
      <v-form @submit.prevent="guardarUsuario" ref="formRef" v-model="formValido">
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
        <v-select
          v-model="form.puesto"
          :items="['ADMINISTRADOR', 'CLIENTE']"
          label="Puesto"
          :rules="[v => !!v || 'El puesto es requerido']"
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
import { reactive, ref } from 'vue'
import { useUsuarioStore } from '@/stores/usuario_store'
import { useRoute } from 'vue-router'

const usuarioStore = useUsuarioStore()
const route = useRoute()

const esEdicion = ref(!!route.params.id)
const formValido = ref(false)
const formRef = ref(null)

const form = reactive({
  nombre: '',
  correo: '',
  telefono: '',
  puesto: '',
  contrasena: '',
})

// Precarga datos si es edición
if (esEdicion.value) {
  usuarioStore.obtenerUsuarioPorId(route.params.id).then((usuario) => {
    form.nombre = usuario.nombre
    form.correo = usuario.correo
    form.telefono = usuario.telefono
    form.puesto = usuario.puesto
  })
}

// Función para permitir solo números y máximo 10 dígitos
const soloNumeros = () => {
  form.telefono = form.telefono.replace(/\D/g, '').slice(0, 10)
}

const guardarUsuario = async () => {
  const validado = await formRef.value.validate()
  if (!validado.valid) return

  try {
    if (esEdicion.value) {
      await usuarioStore.actualizarUsuario(route.params.id, form)
      alert('Usuario actualizado correctamente')
    } else {
      await usuarioStore.crearUsuario(form)
      alert('Usuario creado correctamente')
    }
  } catch (error) {
    alert('Error: ' + error)
  }
}


</script>


<style scoped>
.layout {
  display: flex;
  max-height: 100vh;  /* Para evitar que el layout se desborde */
  overflow: hidden;   /* Corta cualquier desbordamiento */
  background: #ffffff5b;
  color: rgb(0, 0, 0);
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 250px;
  background: #a2aec600;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(244, 237, 237, 0.3);
  overflow-y: auto;         /* Habilita scroll vertical */
  max-height: 100vh;        /* Evita que exceda la ventana */
}


.sidebar h2 {
  margin-bottom: 20px;
  text-align: center;
  font-size: 22px;
  color: #ffffff;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav-item {
  background: #00000062;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s;
}
.content {
  flex: 1;
  padding: 40px;
  text-align: center;
  background: #fefefe;
  overflow-y: auto;
  max-height: 100vh;
}

.nav-item:hover {
  background: #ff2516;
}

.icon {
  font-size: 20px;
}

.content {
  flex: 1;
  padding: 40px;
  background: #ffffff00;
}
</style>
