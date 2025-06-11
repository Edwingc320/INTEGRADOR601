<template>
  <div class="estacionamiento">
    <h2>Mis Datos</h2><br />



    <div v-if="clienteActual" class="cliente-info">
      <h3>Cliente asociado</h3>
      <p><strong>Nombre:</strong> {{ clienteActual.nombre }}</p>
      <p><strong>Teléfono:</strong> {{ clienteActual.telefono }}</p>
      <p><strong>Correo:</strong> {{ clienteActual.correo }}</p>
      <p><strong>Dirección:</strong> {{ clienteActual.direccion }}</p>
      <!--
      <p><strong>ID:</strong> {{ clienteActual.id_cliente }}</p>
      -->
    </div>

      <h2>Reservas Pendientes</h2>
    <!-- Sólo renderizar el componente B cuando clienteActual ya esté cargado -->
    <ReservasPendientesCliente
      v-if="clienteActual && clienteActual.id_cliente"
      :clienteId="clienteActual.id_cliente"
    />


    <h2>Selecciona un espacio disponible</h2><br />
    <div class="grid">
      <div
        v-for="cajon in cajones"
        :key="cajon.id_cajon"
        :class="[
          'espacio',
          cajon.estado === 'libre' ? 'libre' :
          cajon.estado === 'reservado' ? 'reservado' :
          'ocupado',
          cajonSeleccionado?.id_cajon === cajon.id_cajon ? 'seleccionado' : ''
        ]"
        @click="seleccionarCajon(cajon)"
      >
        {{ cajon.numero }}
      </div>
    </div>

    <div v-if="cajonSeleccionado" class="resumen">
      <h3>Resumen de selección</h3>
      <p>Espacio: {{ cajonSeleccionado.numero }}</p>
      <p>Precio por hora: ${{ cajonSeleccionado.precio_hora }}</p>
    </div>

    <div class="resumen1">
      <FormularioCarro
        v-if="clienteActual && cajonSeleccionado && !ocupacionGenerada"
        :id-cliente="clienteActual.id_cliente"
        @carro-creado="manejarCarroCreado"
      />

      <div
        v-if="cajonSeleccionado && formCarroCompletado && !ocupacionGenerada"
        class="form-ocupacion"
      >
        <label>Hora entrada:</label>
        <input type="datetime-local" v-model="horaEntrada" />

        <label>Hora salida:</label>
        <input type="datetime-local" v-model="horaSalida" />

        <label>Fecha reservación:</label>
        <input type="date" v-model="fechaReservacion" />

        <label>Observaciones:</label>
        <textarea v-model="observaciones" placeholder="Opcional"></textarea>

      <div v-if="duracionHoras > 0 && parseFloat(costoTotal) > 0" class="resumen-costo">
          <p><strong>Duración:</strong> {{ duracionHoras.toFixed(2) }} horas</p>
          <p><strong>Costo total estimado:</strong> ${{ costoTotal }}</p>
        </div>

        <button
          class="btn-pagar"
          @click="crearCarroYOcupacion"
          :disabled="!validarFormulario()"
        >
          Reservar espacio
        </button>
      </div>
      <div>
        <p>{{ mensajePago }}</p>

        <button v-if="pagoExitoso" @click="irALogin">
          Ir al login
        </button>
      </div>


    </div>

    <!-- Sección de Pago -->
    <div class="pago-wrapper" v-if="ocupacionGenerada?.id_ocupacion && !ocupacionGenerada.pagado">
      <h3>Seleccione método de pago</h3>
      <label>
        <input type="radio" value="efectivo" v-model="metodoPago" /> Efectivo
      </label>
      <label>
        <input type="radio" value="tarjeta" v-model="metodoPago" /> Tarjeta
      </label>

      <!-- Campos para Tarjeta -->
      <div v-if="metodoPago === 'tarjeta'" class="tarjeta-form">
        <label>Número de tarjeta:</label>
        <input
          type="text"
          v-model="cardNumber"
          placeholder="Numero de tarjeta"
        />

        <label>PIN de tarjeta:</label>
        <input
          type="password"
          v-model="cardPin"
          placeholder="PIN"
        />
      </div>

      <!-- Campo para Efectivo PIN -->
      <div v-if="metodoPago === 'efectivo'" class="efectivo-form">
        <label>PIN ESTACIONAMIENTO:</label>
        <input
          type="password"
          v-model="cashPin"

          placeholder=""
        />
        <!-- placeholder="Ingrese 123 para confirmar" --->
      </div>

      <button
        class="btn-pagar"
        @click="pagarOcupacion"
        :disabled="!puedePagar"
      >
        Pagar ahora
      </button>
      <!-- Botón para cancelar la ocupación -->
    <div v-if="ocupacionGenerada?.id_ocupacion && !ocupacionGenerada.pagado" class="cancelar-ocupacion">
      <button class="btn-cancelar" @click="cancelarOcupacion" >
        Cancelar reservación
      </button>
    </div>
    </div>

    <div v-if="mensajePago" class="confirmacion">
      <p>{{ mensajePago }}</p>
    </div>


    <!-- ¡Botón de login aquí! -->
    <div v-if="pagoExitoso" class="ir-login" style="margin-top: 1rem; text-align: center;">
      <button class="btn-pagar" @click="irALogin">
        Ir al login
      </button>
    </div>

  </div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCajonesStore } from '@/stores/cajones_store'
import { useUsuarioStore } from '@/stores/usuario_store'
import { useClienteStore } from '@/stores/cliente_store'
import { useOcupacionStore } from '@/stores/ocupacion_store'
import ReservasPendientesCliente from '@/components/users/ReservasPendientesCliente.vue'

import { usePagoStore } from '@/stores/pago_store'
import FormularioCarro from '@/components/users/CarroFormulario.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const cajonesStore    = useCajonesStore()
const usuarioStore    = useUsuarioStore()
const clienteStore    = useClienteStore()
const ocupacionStore  = useOcupacionStore()
const pagoStore       = usePagoStore()

const mensajePago         = ref('')
const nuevoCarro          = ref(null)
const formCarroCompletado = ref(false)
const ocupacionGenerada   = ref(null)
//hola

const horaEntrada      = ref('')
const horaSalida       = ref('')
const fechaReservacion = ref('')
const observaciones    = ref('')

// Estados de pago
const metodoPago       = ref<'efectivo'|'tarjeta'>('efectivo')
const cardNumber       = ref('')
const cardPin          = ref('')
const cashPin          = ref('')
const pagoExitoso = ref(false)
const cajones           = computed(() => cajonesStore.cajones)
const cajonSeleccionado = computed(() => cajonesStore.cajonSeleccionado)
const usuarioActual     = computed(() => usuarioStore.usuarioActual)
const clienteActual     = computed(() => clienteStore.clienteActual)

onMounted(async () => {
  await cajonesStore.obtenerCajones()
  if (usuarioActual.value?.id_usuario) {
    // obtiene y establece clienteActual en el store
    await clienteStore.obtenerClientePorUsuario(usuarioActual.value.id_usuario)
  }
})

const duracionHoras = computed(() => {
  if (!horaEntrada.value || !horaSalida.value) return 0
  const diff = new Date(horaSalida.value).getTime() - new Date(horaEntrada.value).getTime()
  return diff > 0 ? diff / 36e5 : 0
})

const costoTotal = computed(() =>
  cajonSeleccionado.value
    ? (duracionHoras.value * cajonSeleccionado.value.precio_hora).toFixed(2)
    : '0'
)

// Validación de pago
const puedePagar = computed(() => {
  if (!ocupacionGenerada.value?.id_ocupacion) return false
  if (metodoPago.value === 'tarjeta') {
    return cardNumber.value.trim().length > 0 && cardPin.value.trim().length > 0
  }
  return cashPin.value === '123'
})

onMounted(async () => {
  await cajonesStore.obtenerCajones()
  if (usuarioActual.value?.id_usuario) {
    await clienteStore.obtenerClientePorUsuario(usuarioActual.value.id_usuario)
  }
})

function irALogin() {
  router.push('/login')
}

async function cancelarOcupacion() {
  const confirmacion = confirm('¿Estás seguro de que deseas cancelar esta reservación?')
  if (!confirmacion || !ocupacionGenerada.value?.id_ocupacion) return

  try {
    await ocupacionStore.eliminarOcupacion(ocupacionGenerada.value.id_ocupacion)
    await cajonesStore.actualizarCajon(cajonSeleccionado.value.id_cajon, { estado: 'libre' })

    mensajePago.value = 'Reservación cancelada exitosamente.'
    ocupacionGenerada.value = null
    await cajonesStore.actualizarCajon(cajonSeleccionado.value.id_cajon, { estado: 'libre' })
    formCarroCompletado.value = false
    nuevoCarro.value = null

  } catch (error) {
    console.error(error)
    mensajePago.value = 'Error al cancelar la reservación.'

  }
}

function seleccionarCajon(cajon) {
  if (cajon.estado === 'libre') {
    cajonesStore.seleccionarCajon(cajon)
    mensajePago.value = ''
    formCarroCompletado.value = false
    ocupacionGenerada.value = null
  }
}


function manejarCarroCreado(carro) {
  if (!carro?.id_carro) {
    mensajePago.value = 'Error al recibir el carro.'
    formCarroCompletado.value = false
    return
  }
  nuevoCarro.value = carro
  const ahora = new Date()
  horaEntrada.value = ahora.toISOString().slice(0, 16)
  horaSalida.value = new Date(ahora.getTime() + 3600e3).toISOString().slice(0, 16)
  fechaReservacion.value = ahora.toISOString().slice(0, 10)
  mensajePago.value = 'Carro registrado. Completa la reservación.'
  formCarroCompletado.value = true
}

async function crearCarroYOcupacion() {
  if (!nuevoCarro.value?.id_carro || !clienteActual.value?.id_cliente) {
    mensajePago.value = 'Faltan datos de carro o cliente.'
    return
  }

  const payload = {
    id_carro: nuevoCarro.value.id_carro,
    id_cajon: cajonSeleccionado.value.id_cajon,
    id_cliente: clienteActual.value.id_cliente,
    hora_entrada: horaEntrada.value,
    hora_salida: horaSalida.value,
    fecha_reservacion: fechaReservacion.value,
    estado: 'reservado',
    observaciones: observaciones.value || ''
  }

  try {
    const response = await ocupacionStore.crearOcupacion(payload)
    ocupacionGenerada.value = response.data ?? response
    await cajonesStore.actualizarCajon(cajonSeleccionado.value.id_cajon, { estado: 'reservado' })
    mensajePago.value = 'Reserva creada. Ahora realiza el pago.'
  } catch (e) {
    console.error(e)
    mensajePago.value = 'Error al crear la reserva.'
  }
}

async function pagarOcupacion() {
  if (!puedePagar.value) {
    mensajePago.value = metodoPago.value === 'efectivo'
      ? 'PIN de efectivo incorrecto.'
      : 'Complete todos los datos de tarjeta.'
    return
  }

  const ahora = new Date()
  const referencia = metodoPago.value === 'tarjeta'
    ? cardNumber.value
    : `REF-${ahora.toISOString().replace(/[-:T.]/g, '').slice(0, 14)}`

  const pagoPayload = {
    id_ocupacion: ocupacionGenerada.value.id_ocupacion,
    metodo: metodoPago.value,
    monto: parseFloat(costoTotal.value),
    descripción: `Pago por ocupación del cajón ${cajonSeleccionado.value.numero}`,
    referencia,
    fecha_pago: ahora.toISOString(),
    estado: 'pagado',
    tipo: 'estacionamiento',
    id_cliente: clienteActual.value.id_cliente
  }

  try {
    const pago = await pagoStore.crearPagoYActualizarOcupacion(pagoPayload)
    mensajePago.value = `Pago exitoso. Ref: ${pago.referencia}`

    ocupacionGenerada.value.pagado = true
    pagoExitoso.value = true //

    await cajonesStore.actualizarCajon(cajonSeleccionado.value.id_cajon, { estado: 'libre' })
    //recargar vista
    //ir a la ruta
  } catch (err) {
    console.error(err)
    mensajePago.value = 'Error al procesar el pago.'
  }
}

function validarFormulario() {
  return (
    nuevoCarro.value &&
    cajonSeleccionado.value &&
    clienteActual.value &&
    horaEntrada.value &&
    horaSalida.value &&
    fechaReservacion.value
  )
}


</script>

<style scoped>

.btn-cancelar {
  background: #e74c3c;
  border: none;
  color: white;
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}
.btn-cancelar:hover {
  background: #c0392b;
}

.estacionamiento { padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px,1fr)); gap: 10px; margin-bottom: 20px; }
.btn-pagar { background:#098c56; border:none; color:white; padding:10px 20px; font-weight:bold; border-radius:6px; cursor:pointer; transition:background-color .3s; }
.btn-pagar:disabled { background:#6c757d; cursor:not-allowed; opacity:.7 }
.btn-pagar:hover:not(:disabled) { background:#07b45a }
.espacio { padding:10px; text-align:center; border-radius:8px; cursor:pointer; color:white; transition:.3s; user-select:none }
.espacio.libre { background:#00b894 }
.espacio.reservado { background:#f39c12; cursor:not-allowed }
.espacio.ocupado { background:#d63031; cursor:not-allowed }
.espacio.seleccionado { box-shadow:0 0 10px 3px #098c56; border:2px solid#fff }
.resumen, .resumen1 { margin-top:20px; background:#f5f5f5; padding:15px; border-radius:8px; text-align:center }
.resumen-costo { background:#e8f5e9; padding:10px; border-radius:6px; margin-top:10px }
.confirmacion { margin-top:15px; color:#00ff95 }
.cliente-info { background:#1c1c2c; padding:12px; border-radius:8px; margin-bottom:20px; color:#dfe6e9 }
.form-ocupacion label { display:block; margin-top:10px; font-weight:600; text-align:left }
.form-ocupacion input, .form-ocupacion textarea { width:100%; padding:6px; margin-top:4px; border-radius:4px; border:1px solid#ccc }
.pago-wrapper { margin-top:20px; text-align:center }
.tarjeta-form, .efectivo-form { margin-top:10px; text-align:left }
</style>
