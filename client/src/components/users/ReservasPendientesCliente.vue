<!-- src/components/users/ReservasPendientesCliente.vue -->
<template>
  <div>
    <!---<h2>Ocupaciones Reservadas del Cliente</h2>-->

    <!-- Podemos ocultar el input de ID, o dejarlo deshabilitado si solo se usa para mostrar -->

    <div class="filtro-busqueda">
      <!--
      <input v-model="clienteId" placeholder="ID de cliente" readonly
      />
      -->


      <!-- Si quieres ocultar el botón buscar, simplemente remuévelo o deshabilítalo: -->
      <button
        v-if="false"
        @click="cargarReservadas"
        :disabled="cargandoReservas || !clienteId"
      >
        {{ cargandoReservas ? 'Cargando...' : 'Buscar' }}
      </button>
    </div>

    <div v-if="errorReservas" class="error">{{ errorReservas }}</div>

    <table v-if="ocupaciones.length" class="tabla-reservas">
      <thead>
        <tr>
          <th>ID</th>
          <th>Estado</th>
          <th>Fecha Reservación</th>
          <th>ID Cajón</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
       <tr v-for="o in reservasPaginadas" :key="o.id_ocupacion">
          <td>{{ o.id_ocupacion }}</td>
          <td>{{ o.estado }}</td>
          <td>{{ formateaFecha(o.fecha_reservacion) }}</td>
          <td>{{ o.id_cajon }}</td>
          <td>
            <button
              @click="seleccionarParaPago(o)"
              :disabled="procesandoPago || pagadoGlobal"
            >Pagar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="no-hay">No hay reservaciones.</div>
    <!-- Controles de paginación: solo si hay más de una página -->
<div v-if="ocupaciones.length > elementosPorPagina" class="paginacion">
  <button @click="paginaAnterior" :disabled="paginaActual === 1">Anterior</button>
  Página {{ paginaActual }} de {{ totalPaginas }}
  <button @click="paginaSiguiente" :disabled="paginaActual === totalPaginas">Siguiente</button>
</div>


    <div v-if="ocupacionSeleccionada" class="payment-container">
      <h3>Pago para Reservación #{{ ocupacionSeleccionada.id_ocupacion }}</h3>

      <div class="campo">
        <label><input type="radio" value="efectivo" v-model="metodoPago" /> Efectivo</label>
        <label><input type="radio" value="tarjeta" v-model="metodoPago" /> Tarjeta</label>
      </div>

      <div class="campo">
        <label>Monto a pagar:</label>
        <input type="number" v-model.number="montoPago" min="0" step="0.01" readonly />
      </div>

      <div v-if="metodoPago==='tarjeta'" class="campo tarjeta-pago">
        <label>Número de tarjeta:</label>
        <input v-model="cardNumber" placeholder="1234567890123456" />
        <label>PIN tarjeta:</label>
        <input type="password" v-model="cardPin" />
      </div>

      <div v-else class="campo">
        <label>PIN efectivo (123):</label>
        <input type="password" v-model="cashPin" />
      </div>

      <div class="acciones-pago">
        <button @click="confirmarPago" :disabled="!puedePagar || procesandoPago">
          {{ procesandoPago ? 'Procesando...' : 'Confirmar Pago' }}
        </button>
        <button @click="cancelarPago" :disabled="procesandoPago">Cancelar</button>
      </div>

      <div v-if="errorPago" class="error">{{ errorPago }}</div>
      <div v-if="successPago" class="success">{{ successPago }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useOcupacionStore } from '@/stores/ocupacion_store'
import { usePagoStore } from '@/stores/pago_store'
import { useCajonesStore } from '@/stores/cajones_store'

// Recibe el ID de cliente desde el padre
const props = defineProps({
  clienteId: {
    type: [String, Number],
    required: true
  }
})

const ocupacionStore = useOcupacionStore()
const pagoStore       = usePagoStore()
const cajonesStore    = useCajonesStore()

// Listado hola
const clienteId = ref(props.clienteId)
const ocupaciones     = ref([])
const cargandoReservas= ref(false)
const errorReservas   = ref(null)
const pagadoGlobal    = ref(false)

// Pago
const ocupacionSeleccionada = ref(null)
const metodoPago            = ref('efectivo')
const montoPago             = ref(0)
const cardNumber            = ref('')
const cardPin               = ref('')
const cashPin               = ref('')
const procesandoPago        = ref(false)
const errorPago             = ref(null)
const successPago           = ref(null)

const formateaFecha = dt => dt ? new Date(dt).toLocaleDateString() : ''

// Cuando cambie la prop clienteId, recargar reservas
watch(() => props.clienteId, (nuevoId) => {
  if (nuevoId) {
    clienteId.value = nuevoId
    cargarReservadas()
  } else {
    clienteId.value = ''
    ocupaciones.value = []
  }
}, { immediate: true })

// 1) Carga las reservas reservadas
async function cargarReservadas() {
  if (!clienteId.value) {
    ocupaciones.value = []
    return
  }
  cargandoReservas.value = true
  errorReservas.value = null
  ocupacionSeleccionada.value = null
  successPago.value = errorPago.value = null
  pagadoGlobal.value = false

  try {
    await ocupacionStore.obtenerOcupacionesReservadasPorCliente(clienteId.value)
    ocupaciones.value = Array.isArray(ocupacionStore.ocupaciones)
      ? ocupacionStore.ocupaciones
      : (ocupacionStore.ocupaciones.data ?? [])
  } catch (e) {
    console.error(e)
    errorReservas.value = 'No se pudieron cargar las reservaciones.'
  } finally {
    cargandoReservas.value = false
  }
}

// 2) Prepara el monto y método
async function seleccionarParaPago(ocup) {
  ocupacionSeleccionada.value = { ...ocup }
  // Obtener precio del cajón
  try {
    const cajon = await cajonesStore.obtenerCajonPorId(ocup.id_cajon)
    montoPago.value = Number(cajon.precio_hora ?? ocup.monto ?? 0)
  } catch {
    montoPago.value = ocup.monto ?? 0
  }

  // reset formularios
  metodoPago.value   = 'efectivo'
  cardNumber.value   = cardPin.value = cashPin.value = ''
  errorPago.value    = successPago.value = null
  pagadoGlobal.value = false
}

// 3) Habilita botón
const puedePagar = computed(() => {
  if (!ocupacionSeleccionada.value) return false
  if (metodoPago.value === 'tarjeta')
    return cardNumber.value.length >= 10 && cardPin.value.length >= 4
  return cashPin.value === '123'
})

// 4) Cancelar
function cancelarPago() {
  ocupacionSeleccionada.value = null
  errorPago.value = successPago.value = null
}

function limpiarCampos() {
  // No limpiamos clienteId, porque viene de padre
  ocupaciones.value = []
  ocupacionSeleccionada.value = null
  metodoPago.value = 'efectivo'
  montoPago.value = 0
  cardNumber.value = ''
  cardPin.value = ''
  cashPin.value = ''
  errorPago.value = null
  successPago.value = null
  errorReservas.value = null
  pagadoGlobal.value = false
}

// 5) Confirmar pago: crea pago, actualiza ocupación, libera cajón y recarga
async function confirmarPago() {
  if (!ocupacionSeleccionada.value) return
  procesandoPago.value = true
  errorPago.value = successPago.value = null

  try {
    const ahora = new Date().toISOString()
    const refStr= metodoPago.value==='tarjeta'
      ? cardNumber.value.slice(-6)
      : `REF-${ahora.replace(/[-:T.]/g,'').slice(0,14)}`

    const payloadPago = {
      id_ocupacion: ocupacionSeleccionada.value.id_ocupacion,
      id_cliente:   clienteId.value,
      metodo:       metodoPago.value,
      monto:        montoPago.value,
      referencia:   refStr,
      fecha_pago:   ahora,
      estado:       'pagado',
      tipo:         'estacionamiento',
      descripcion:  `Pago cajón ${ocupacionSeleccionada.value.id_cajon}`
    }

    // 1) crear pago y actualizar ocupación
    const pago = await pagoStore.crearPagoYActualizarOcupacion(payloadPago)

    // 2) liberar cajón
    await cajonesStore.actualizarCajon(ocupacionSeleccionada.value.id_cajon, { estado: 'libre' })

    successPago.value = `¡Pago exitoso! ID: ${pago.id_pago}`
    pagadoGlobal.value = true

    // 3) recargar lista
    await cargarReservadas()
    ocupacionSeleccionada.value = null

    // No limpiamos clienteId, porque viene de padre.
    limpiarCampos()
    // Pero podemos limpiar los campos de pago:
    metodoPago.value = 'efectivo'
    montoPago.value = 0
    cardNumber.value = ''
    cardPin.value = ''
    cashPin.value = ''
  } catch (err) {
    console.error(err)
    errorPago.value = 'No se pudo procesar el pago.'
  } finally {
    procesandoPago.value = false
  }
}


// 1. Estado de paginación
const paginaActual = ref(1)
const elementosPorPagina = ref(5) // o el número que prefieras por página

// 2. Computed total de páginas
const totalPaginas = computed(() => {
  return Math.max(1, Math.ceil(ocupaciones.value.length / elementosPorPagina.value))
})

// 3. Computed de reservas para la página actual
const reservasPaginadas = computed(() => {
  const start = (paginaActual.value - 1) * elementosPorPagina.value
  return ocupaciones.value.slice(start, start + elementosPorPagina.value)
})

// 4. Funciones para cambiar de página
function paginaAnterior() {
  if (paginaActual.value > 1) {
    paginaActual.value--
  }
}
function paginaSiguiente() {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++
  }
}

// 5. Ajuste dentro de cargarReservadas(): tras asignar ocupaciones.value, asegurarse de que paginaActual no exceda totalPaginas
// Por ejemplo, dentro de tu función cargarReservadas, después de:
//   ocupaciones.value = [...]
if (paginaActual.value > totalPaginas.value) {
  paginaActual.value = totalPaginas.value
}
// (Opcional: si prefieres reiniciar siempre al buscar nuevo cliente, poner paginaActual.value = 1)


</script>

<style scoped>
.tarjeta-pago label {
  display: block;
  margin-top: 0.8em;
}

.tarjeta-pago input {
  display: block;
  width: 100%;
  margin-top: 0.2em;
}

.filtro-busqueda { margin-bottom:1em; }
.tabla-reservas { width:100%; border-collapse:collapse; margin-bottom:1em; }
.tabla-reservas th, .tabla-reservas td { border:1px solid #ccc; padding:6px; }
.payment-container { padding:1em; border:1px solid #ddd; max-width:400px; }
.campo { margin:0.5em 0; }
.acciones-pago button { margin-right:0.5em; }
.error { color:red; margin-top:0.5em; }
.success { color:green; margin-top:0.5em; }
</style>
