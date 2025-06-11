<template>
  <v-card width="700" class="pa-4 mx-auto">
    <v-card-title>Gestión de Cajones</v-card-title>

    <v-btn-toggle
      v-model="modo"
      class="mb-4"
      mandatory
      background-color="primary"
      color="white"
    >
      <v-btn value="editar">Editar Cajón</v-btn>
      <v-btn value="crear">Crear Cajón</v-btn>
    </v-btn-toggle>

    <v-card-text>
      <div v-if="modo === 'editar'">
        <!-- FORMULARIO EDITAR -->
        <v-autocomplete
          v-model="cajonSeleccionado"
          :items="cajones"
          :item-title="formatCajon"
          item-value="id_cajon"
          label="Selecciona un cajón"
          return-object
          clearable
        />

        <v-text-field
          v-model="cajon.numero"
          label="Número"
          :disabled="!cajonSeleccionado"
        />

        <v-select
          v-model="cajon.ubicacion"
          :items="['PLANTA BAJA', 'PLANTA ALTA']"
          label="Ubicación"
          :disabled="!cajonSeleccionado"
        />

        <v-text-field
          v-model="cajon.precio_hora"
          label="Precio por hora"
          placeholder="Precio por hora: ej. 50.0"
          type="number"
          step="0.01"
          :disabled="!cajonSeleccionado"
          :error="precioErrorEditar"
          :error-messages="precioErrorEditar ? ['Precio debe ser positivo'] : []"
        />

        <v-select
          v-model="cajon.estado"
          :items="['libre', 'ocupado', 'reservado']"
          label="Estado"
          :disabled="!cajonSeleccionado"
        />

        <v-btn
          color="primary"
          class="mt-4"
          :disabled="!cajonSeleccionado || precioErrorEditar"
          @click="guardarCambios"
        >
          Guardar Cambios
        </v-btn>
      </div>

      <div v-else>
        <!-- FORMULARIO CREAR -->
        <v-text-field
          v-model="nuevoCajon.numero"
          label="Número"
          clearable
        />

        <v-select
          v-model="nuevoCajon.ubicacion"
          :items="['PLANTA BAJA', 'PLANTA ALTA']"
          label="Ubicación"
          clearable
        />

        <v-text-field
          v-model="nuevoCajon.precio_hora"
          label="Precio por hora"
          placeholder="Precio por hora: ej. 50.0"
          type="number"
          step="0.01"
          clearable
          :error="precioErrorCrear"
          :error-messages="precioErrorCrear ? ['Precio debe ser positivo'] : []"
        />

        <v-select
          v-model="nuevoCajon.estado"
          :items="['libre', 'ocupado', 'reservado']"
          label="Estado"
        />

        <v-btn
          color="success"
          class="mt-4"
          @click="crearCajon"
          :disabled="!nuevoCajon.numero || !nuevoCajon.precio_hora || !nuevoCajon.ubicacion || precioErrorCrear"
        >
          Crear Cajón
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useCajonesStore } from '@/stores/cajones_store'

const modo = ref('editar') // 'editar' o 'crear'

const cajonesStore = useCajonesStore()
const cajones = ref([])
const cajonSeleccionado = ref(null)

const cajon = ref({
  id_cajon: null,
  numero: '',
  ubicacion: '',
  precio_hora: 0,
  estado: 'libre',
})

// Estado para nuevo cajón
const nuevoCajon = ref({
  numero: '',
  ubicacion: '',
  precio_hora: null,
  estado: 'libre',
})

// Formatea la forma en que se muestra cada cajón en el selector
const formatCajon = (item) => {
  if (!item) return ''
  return `#${item.numero} - ${item.ubicacion || 'Sin ubicación'} (${item.estado})`
}

// Cargar cajones al iniciar
onMounted(async () => {
  try {
    await cajonesStore.obtenerCajones()
    cajones.value = cajonesStore.cajones
  } catch (error) {
    console.error('Error al cargar cajones:', error)
  }
})

// Copiar datos al objeto editable cuando se selecciona uno
watch(cajonSeleccionado, (nuevo) => {
  if (nuevo) {
    cajon.value = { ...nuevo }
  } else {
    cajon.value = {
      id_cajon: null,
      numero: '',
      ubicacion: '',
      precio_hora: 0,
      estado: 'libre',
    }
  }
})

// Validaciones precio por hora
const precioErrorEditar = computed(() => {
  const val = cajon.value.precio_hora
  if (val === null || val === '' || val === undefined) return false // no error si vacío
  return !(parseFloat(val) > 0)
})

const precioErrorCrear = computed(() => {
  const val = nuevoCajon.value.precio_hora
  if (val === null || val === '' || val === undefined) return false // no error si vacío
  return !(parseFloat(val) > 0)
})


// Guardar cambios en el cajón
const guardarCambios = async () => {
  if (!cajon.value.id_cajon) {
    alert('Selecciona un cajón primero')
    return
  }
  if (precioErrorEditar.value) {
    alert('El precio debe ser un número positivo')
    return
  }
  try {
    await cajonesStore.actualizarCajon(cajon.value.id_cajon, cajon.value)
    alert('Cajón actualizado correctamente')
    cajonSeleccionado.value = null
    await cajonesStore.obtenerCajones()
    cajones.value = cajonesStore.cajones
  } catch (error) {
    alert('Error al actualizar cajón: ' + error)
  }
}

// Crear nuevo cajón
const crearCajon = async () => {
  if (!nuevoCajon.value.numero || !nuevoCajon.value.precio_hora || !nuevoCajon.value.ubicacion) {
    alert('Completa número, ubicación y precio por hora')
    return
  }
  if (precioErrorCrear.value) {
    alert('El precio debe ser un número positivo')
    return
  }
  try {
    const creado = await cajonesStore.crearCajon(nuevoCajon.value)
    alert(`Cajón creado: #${creado.numero}`)
    // Limpiar formulario
    nuevoCajon.value = {
      numero: '',
      ubicacion: '',
      precio_hora: null,
      estado: 'libre',
    }
    // Actualizar lista
    await cajonesStore.obtenerCajones()
    cajones.value = cajonesStore.cajones
  } catch (error) {
    alert('Error al crear cajón: ' + error)
  }
}
</script>
