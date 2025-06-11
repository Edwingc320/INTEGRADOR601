<!--Pago FROM-->
<template>
  <form @submit.prevent="enviarFormulario" class="form-carro" novalidate>
    <div class="form-group">
      <label for="metodo">Método de Pago:</label>
      <input
        v-model="form.metodo"
        id="metodo"
        type="text"
        required
        :disabled="formEnviado"
        :class="{ 'input-error': errores.metodo }"
        placeholder="Ej. efectivo, tarjeta"
        @blur="validarCampo('metodo')"
      />
      <p v-if="errores.metodo" class="error-msg">{{ errores.metodo }}</p>
    </div>

    <div class="form-group">
      <label for="monto">Monto:</label>
      <input
        v-model.number="form.monto"
        id="monto"
        type="number"
        step="0.01"
        required
        :disabled="formEnviado"
        :class="{ 'input-error': errores.monto }"
        placeholder="Ej. 1500.00"
        @blur="validarCampo('monto')"
      />
      <p v-if="errores.monto" class="error-msg">{{ errores.monto }}</p>
    </div>

    <div class="form-group">
      <label for="descripcion">Descripción:</label>
      <input
        v-model="form.descripcion"
        id="descripcion"
        type="text"
        :disabled="formEnviado"
        placeholder="Ej. Pago por ocupación del cajón 4"
      />
    </div>

    <div class="form-group">
      <label for="referencia">Referencia:</label>
      <input
        v-model="form.referencia"
        id="referencia"
        type="text"
        :disabled="formEnviado"
        placeholder="Ej. REF20250606-01"
      />
    </div>

    <!-- Campos ocultos -->
    <input type="hidden" v-model="form.fecha_pago" />
    <input type="hidden" v-model="form.estado" />
    <input type="hidden" v-model.number="form.id_cliente" />
    <input type="hidden" v-model.number="form.id_ocupacion" />
    <input type="hidden" v-model="form.tipo" />

    <button
      v-if="!formEnviado"
      type="submit"
      class="btn-pagar"
      :disabled="enviando || tieneErrores"
    >
      {{ enviando ? 'Enviando...' : 'Pagar' }}
    </button>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { usePagoStore } from '@/stores/pago_store'



const emit = defineEmits(['pago-creado'])



const props = defineProps({
  idCliente: { type: Number, required: true },
  idOcupacion: { type: Number, required: true },
  monto: { type: Number, required: true }
})

const pagoStore = usePagoStore()

const form = reactive({
  metodo: '',
  monto: props.monto,
  descripcion: '',
  referencia: '',
  fecha_pago: new Date().toISOString(),
  estado: 'pagado',
  tipo: 'estacionamiento',
  id_cliente: props.idCliente,
  id_ocupacion: props.idOcupacion
})

const enviando = ref(false)
const formEnviado = ref(false)

const errores = reactive({
  metodo: '',
  monto: ''
})

const validarCampo = (campo) => {
  if (campo === 'metodo') {
    if (!form.metodo.trim()) {
      errores.metodo = 'El método de pago es obligatorio.'
    } else {
      errores.metodo = ''
    }
  }
  if (campo === 'monto') {
    if (!form.monto || form.monto <= 0) {
      errores.monto = 'El monto debe ser mayor a 0.'
    } else {
      errores.monto = ''
    }
  }
}

const tieneErrores = computed(() => Object.values(errores).some(e => e.length > 0))

const enviarFormulario = async () => {
  validarCampo('metodo')
  validarCampo('monto')
  if (tieneErrores.value || enviando.value) return

  try {
    enviando.value = true
    const pagoCreado = await pagoStore.crearPago({ ...form })
    formEnviado.value = true
    emit('pago-creado', pagoCreado)
  } catch (err) {
    console.error('Error al crear pago:', err)
  } finally {
    enviando.value = false
  }
}
</script>

<style scoped>
/* Se reutiliza el estilo de FormularioCarro */
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

input[type="text"],
input[type="number"] {
  padding: 10px 12px;
  font-size: 1rem;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

input:focus {
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
