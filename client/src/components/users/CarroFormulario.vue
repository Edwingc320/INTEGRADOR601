<!-- components/FormularioCarro.vue -->
<template>
  <form @submit.prevent="enviarFormulario" class="form-carro" novalidate>
    <div class="form-group">
      <label for="placas">Placas:</label>
      <input
        v-model="form.placas"
        id="placas"
        type="text"
        required
        :disabled="formEnviado"
        :class="{ 'input-error': errores.placas }"
        placeholder="Ej. ABC-1234"
        maxlength="10"
        @blur="validarCampo('placas')"
      />
      <p v-if="errores.placas" class="error-msg">{{ errores.placas }}</p>
    </div>

    <div class="form-group">
      <label for="numero_serie">Número de Serie:</label>
      <input
        v-model="form.numero_serie"
        id="numero_serie"
        type="text"
        required
        :disabled="formEnviado"
        :class="{ 'input-error': errores.numero_serie }"
        placeholder="Ej. 1HGCM82633A004352"
        maxlength="17"
        @blur="validarCampo('numero_serie')"
      />
      <p v-if="errores.numero_serie" class="error-msg">{{ errores.numero_serie }}</p>
    </div>

    <!-- Campo oculto para id_cliente -->
    <input type="hidden" v-model.number="form.id_cliente" />

    <!-- Botón se oculta si ya se envió el formulario -->


    <button
      v-if="!formEnviado"
      ref="btnEnviar"
      type="submit"
      class="btn-pagar"
      :disabled="enviando || tieneErrores || formEnviado"
    >
      {{ enviando ? 'Enviando...' : 'Siguiente' }}
    </button>

  </form>


</template>

<script setup>
const emit = defineEmits(['carro-creado'])

import { ref, watch, reactive, computed } from 'vue'
import { useCarroStore } from '@/stores/carro_store'

const props = defineProps({
  idCliente: {
    type: Number,
    required: true
  }
})

const carroStore = useCarroStore()

const form = reactive({
  placas: '',
  numero_serie: '',
  id_cliente: props.idCliente
})

watch(
  () => props.idCliente,
  (nuevoId) => {
    form.id_cliente = nuevoId
  },
  { immediate: true }
)

const enviando = ref(false)
const formEnviado = ref(false)
const btnEnviar = ref(null)

const errores = reactive({
  placas: '',
  numero_serie: ''
})

const validarCampo = (campo) => {
  if (campo === 'placas') {
    if (!form.placas.trim()) {
      errores.placas = 'Las placas son obligatorias.'
    } else if (!/^[A-Z0-9-]{3,10}$/i.test(form.placas.trim())) {
      errores.placas = 'Formato de placas inválido.'
    } else {
      errores.placas = ''
    }
  }

  if (campo === 'numero_serie') {
    if (!form.numero_serie.trim()) {
      errores.numero_serie = 'El número de serie es obligatorio.'
    } else if (!/^[A-Z0-9]{10,17}$/i.test(form.numero_serie.trim())) {
      errores.numero_serie = 'Número de serie inválido.'
    } else {
      errores.numero_serie = ''
    }
  }
}

const tieneErrores = computed(() => {
  return Object.values(errores).some(error => error.length > 0)
})

const enviarFormulario = async () => {
  // Validar campos
  validarCampo('placas')
  validarCampo('numero_serie')

  if (tieneErrores.value || enviando.value || formEnviado.value) return

  try {
    enviando.value = true
    // 1) capturo el carro tal cual lo devuelve el store (incluye id_carro)
    const carroCreado = await carroStore.crearCarro({ ...form })

    // 2) marco como enviado...
    formEnviado.value = true
    //a
    // 2) ...y deshabilito el botón
    // saa
    // 3) emito el objeto completo, con su id_carro

    emit('carro-creado', carroCreado)
  } catch (error) {
    console.error('Error al crear carro:', error)
  } finally {
    enviando.value = false
    // Reseteo el formulario
  }
}



</script>

<style scoped>
.form-carro {
  margin-top: 20px;
  padding: 25px 20px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

input[type="text"] {
  padding: 10px 12px;
  font-size: 1rem;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus {
  outline: none;
  border-color: #098c56;
  box-shadow: 0 0 6px #07b45aaa;
}

.input-error {
  border-color: #e74c3c;
}

.error-msg {
  margin-top: 4px;
  font-size: 0.875rem;
  color: #e74c3c;
}

.btn-pagar {
  width: 100%;
  background-color: #098c56;
  border: none;
  color: white;
  padding: 14px 0;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;
}

.btn-pagar:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-pagar:hover:not(:disabled) {
  background-color: #07b45a;
}

</style>

