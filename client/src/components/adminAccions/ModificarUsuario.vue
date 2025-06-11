<template>
  <v-card width="500" class="pa-4">
    <v-card-title>Modificar Usuario</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="filtro"
        label="Buscar por nombre"
        @input="filtrarUsuarios"
        append-icon="mdi-magnify"
        clearable
      />
      <v-autocomplete
        v-model="usuarioSeleccionado"
        :items="usuariosFiltrados"
        item-title="nombre"
        item-value="id_usuario"
        label="Selecciona un usuario"
        :disabled="usuariosFiltrados.length === 0"
        return-object
      />

      <v-text-field
        v-model="usuario.nombre"
        label="Nombre"
        :disabled="!usuarioSeleccionado"
      />
      <v-text-field
        v-model="usuario.correo"
        label="Correo"
        :disabled="!usuarioSeleccionado"
      />
      <v-text-field
        v-model="usuario.puesto"
        label="Puesto"
        :disabled="!usuarioSeleccionado"
      />
      <v-text-field
        v-model="usuario.telefono"
        label="Teléfono"
        :disabled="!usuarioSeleccionado"
      />
      <v-text-field
        type="password"
        v-model="usuario.contrasena"
        label="Contraseña"
        :disabled="!usuarioSeleccionado"
      />

      <v-btn
        color="primary"
        class="mt-4"
        :disabled="!usuarioSeleccionado"
        @click="guardarCambios"
      >
        Guardar Cambios
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUsuarioStore } from '@/stores/usuario_store'

const usuarioStore = useUsuarioStore()

const filtro = ref('')
const usuarioSeleccionado = ref(null)
const usuariosFiltrados = ref([])

const usuario = ref({
  id_usuario: null,
  nombre: '',
  correo: '',
  puesto: '',
  telefono: '',
  contrasena: '',
})

watch(usuarioSeleccionado, (nuevo) => {
  if (nuevo) {
    usuario.value = { ...nuevo }
  } else {
    usuario.value = {
      id_usuario: null,
      nombre: '',
      correo: '',
      puesto: '',
      telefono: '',
      contrasena: '',
    }
  }
})

const filtrarUsuarios = async () => {
  if (!filtro.value.trim()) {
    usuariosFiltrados.value = []
    usuarioSeleccionado.value = null
    return
  }
  try {
    const resultados = await usuarioStore.buscarUsuarioPorNombre(filtro.value)
    usuariosFiltrados.value = resultados
  } catch (error) {
    console.error('Error al buscar usuarios:', error)
    usuariosFiltrados.value = []
    usuarioSeleccionado.value = null
  }
}

const guardarCambios = async () => {
  if (!usuario.value.id_usuario) {
    alert('Selecciona un usuario primero')
    return
  }
  try {
    await usuarioStore.actualizarUsuario(usuario.value.id_usuario, usuario.value)
    alert('Usuario actualizado correctamente')
    filtro.value = ''
    usuarioSeleccionado.value = null
    usuariosFiltrados.value = []
  } catch (error) {
    alert('Error al actualizar usuario: ' + error)
  }
}
</script>
