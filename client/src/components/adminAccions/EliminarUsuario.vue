<template>
  <v-card width="500" class="pa-4">
    <v-card-title>Eliminar Usuario</v-card-title>
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
      <v-btn
        color="error"
        class="mt-4"
        :disabled="!usuarioSeleccionado"
        @click="confirmarEliminacion"
      >
        Eliminar
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useUsuarioStore } from '@/stores/usuario_store'

const usuarioStore = useUsuarioStore()

const filtro = ref('')
const usuarioSeleccionado = ref(null)
const usuariosFiltrados = ref([])

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

const confirmarEliminacion = async () => {
  if (!usuarioSeleccionado.value) return
  const confirmacion = confirm(`¿Seguro que deseas eliminar a ${usuarioSeleccionado.value.nombre}?`)
  if (confirmacion) {
    try {
      await usuarioStore.eliminarUsuario(usuarioSeleccionado.value.id_usuario)  // usa id_usuario
      alert('Usuario eliminado correctamente')
      usuarioSeleccionado.value = null
      filtro.value = ''
      usuariosFiltrados.value = []
    } catch (error) {
      alert('Error al eliminar: ' + error)
    }
  }
}
</script>
