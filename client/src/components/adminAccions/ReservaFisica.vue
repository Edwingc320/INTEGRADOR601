<template>
  <v-card width="600" class="pa-4 mx-auto">
    <!-- FORMULARIO CREAR USUARIO + CLIENTE -->
    <div v-if="!clienteCreado">
      <v-card-title>Crear Usuario y Cliente</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="crearUsuarioYCliente" ref="formClienteRef" v-model="formClienteValido">
          <v-text-field
            v-model="formCliente.nombre"
            label="Nombre"
            :rules="[v => !!v || 'Requerido', v => v.length >= 3 || 'Min 3 caracteres']"
            required
          />
          <v-text-field
            v-model="formCliente.correo"
            label="Correo"
            type="email"
            :rules="[v => !!v || 'Requerido', v => /.+@.+\..+/.test(v) || 'Correo inválido']"
            required
          />
          <v-text-field
            v-model="formCliente.telefono"
            label="Teléfono"
            maxlength="10"
            :rules="[v => !!v || 'Requerido', v => /^\d{10}$/.test(v) || '10 dígitos exactos']"
            @input="soloNumerosCliente"
            required
          />
          <v-text-field
            v-model="formCliente.direccion"
            label="Dirección"
            :rules="[v => !!v || 'Requerido']"
            required
          />
          <v-text-field
            v-model="formCliente.contrasena"
            label="Contraseña"
            type="password"
            :rules="[v => !!v || 'Requerido', v => v.length >= 8 || 'Min 8 caracteres']"
            required
          />
          <v-btn
            type="submit"
            color="primary"
            class="mt-4"
            :loading="guardandoCliente"
            :disabled="guardandoCliente"
          >
            Crear Usuario & Cliente
          </v-btn>
        </v-form>
      </v-card-text>
    </div>

    <!-- FORMULARIO CREAR CARRO -->
    <div v-if="clienteCreado && !carroCreado">
      <v-card-title>Registrar Carro para {{ formCliente.nombre }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="guardarCarro" ref="formCarroRef" v-model="formCarroValido">
          <v-text-field
            v-model="formCarro.placas"
            label="Placas"
            :rules="[v => !!v || 'Requerido']"
            required
          />
          <v-text-field
            v-model="formCarro.numero_serie"
            label="Número de serie"
            :rules="[v => !!v || 'Requerido']"
            required
          />
          <v-btn
            type="submit"
            color="primary"
            class="mt-4"
            :loading="guardandoCarro"
            :disabled="guardandoCarro"
          >
            Crear Carro
          </v-btn>
        </v-form>
      </v-card-text>
    </div>

    <!-- FORMULARIO RESERVA -->
    <div v-if="carroCreado && !ocupacionCreada">
      <v-card-title>Reservar Cajón</v-card-title>
      <v-card-text>
        <v-form ref="formReservaRef" v-model="formReservaValido">

          <!-- Selección tipo grid -->
          <div class="grid">
            <div
              v-for="cajon in cajonesLibres"
              :key="cajon.id_cajon"
              :class="[
                'espacio',
                cajon.estado === 'libre' ? 'libre'
                  : cajon.estado === 'reservado' ? 'reservado'
                  : 'ocupado',
                formReserva.id_cajon === cajon.id_cajon ? 'seleccionado' : ''
              ]"
              @click="formReserva.id_cajon = cajon.id_cajon"
            >
              {{ cajon.numero }}
            </div>
          </div>

          <!-- Resumen debajo -->
          <div v-if="formReserva.id_cajon" class="resumen">
            <p><strong>Espacio seleccionado:</strong>
              {{ cajonesLibres.find(c => c.id_cajon === formReserva.id_cajon).numero }}
            </p>
            <p><strong>Precio por hora:</strong> $
              {{ cajonesLibres.find(c => c.id_cajon === formReserva.id_cajon).precio_hora }}
            </p>
            <p><strong>Precio estimado:</strong> $
              {{ precioEstimado }}
            </p>

          </div>


          <v-text-field
            label="Hora Entrada"
            type="datetime-local"
            v-model="formReserva.hora_entrada"
            :rules="[v => !!v || 'Requerido']"
            required
          />
          <v-text-field
            label="Hora Salida"
            type="datetime-local"
            v-model="formReserva.hora_salida"
            :rules="[
              v => !!v || 'Requerido',
              v => new Date(v) > new Date(formReserva.hora_entrada) || 'La hora de salida debe ser posterior a la entrada'
            ]"
            required
          />

          <v-text-field
            label="Fecha Reservación"
            type="date"
            v-model="formReserva.fecha_reservacion"
            :rules="[v => !!v || 'Requerido']"
            required
          />

          <v-textarea
            label="Observaciones (opcional)"
            v-model="formReserva.observaciones"
          />
          <v-btn
            color="primary"
            class="mt-4"
            @click="crearReserva"
            :loading="guardandoReserva"
            :disabled="guardandoReserva || !formReservaValido || !formReserva.id_cajon"
          >
            Reservar espacio
          </v-btn>
        </v-form>
      </v-card-text>
    </div>

    <!-- BOTONES DE PAGAR Y CANCELAR RESERVA -->
    <div v-if="ocupacionCreada && !pagado" class="mt-4">
      <v-card-title>Pago de Reserva</v-card-title>
      <v-card-text>
        <v-radio-group v-model="metodoPago" row>
          <v-radio label="Efectivo" value="efectivo" />
          <v-radio label="Tarjeta" value="tarjeta" />
        </v-radio-group>

        <p><strong>Precio estimado:</strong> $
              {{ precioEstimado }}
            </p>

        <v-text-field
          v-if="metodoPago === 'tarjeta'"
          label="Número de tarjeta"
          v-model="cardNumber"
        />
        <v-text-field
          v-if="metodoPago === 'tarjeta'"
          label="PIN tarjeta"
          type="password"
          v-model="cardPin"
        />

        <v-text-field
          v-if="metodoPago === 'efectivo'"
          label="PIN efectivo (ingrese 123)"
          type="password"
          v-model="cashPin"
        />

        <v-btn
          color="success"
          class="mr-2"
          @click="pagarReserva"
          :disabled="!puedePagar"
          :loading="procesandoPago"
        >
          Pagar
        </v-btn>
        <v-btn
          color="error"
          @click="cancelarReserva"
          :loading="procesandoCancelacion"
        >
          Cancelar Reservación
        </v-btn>
      </v-card-text>
    </div>

    <div v-if="mensaje" class="mt-4">
      <v-alert :type="mensajeTipo" dense>{{ mensaje }}</v-alert>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useUsuarioStore } from '@/stores/usuario_store'
import { useClienteStore } from '@/stores/cliente_store'
import { useCarroStore } from '@/stores/carro_store'
import { useCajonesStore } from '@/stores/cajones_store'
import { useOcupacionStore } from '@/stores/ocupacion_store'
import { usePagoStore } from '@/stores/pago_store'

const usuarioStore = useUsuarioStore()
const clienteStore = useClienteStore()
const carroStore = useCarroStore()
const cajonesStore = useCajonesStore()
const ocupacionStore = useOcupacionStore()
const pagoStore = usePagoStore()

const formCliente = reactive({ nombre: '', correo: '', telefono: '', direccion: '', contrasena: '' })
const formClienteValido = ref(false)
const formClienteRef = ref(null)
const guardandoCliente = ref(false)

const formCarro = reactive({ placas: '', numero_serie: '', id_cliente: null })
const formCarroValido = ref(false)
const formCarroRef = ref(null)
const guardandoCarro = ref(false)

const formReserva = reactive({ id_cajon: null, hora_entrada: '', hora_salida: '', fecha_reservacion: '', observaciones: '', id_carro: null, estado: 'reservado', id_cliente: null,  monto: 0  })
const formReservaValido = ref(false)
const formReservaRef = ref(null)
const guardandoReserva = ref(false)

const clienteCreado = ref(false)
const carroCreado = ref(false)
const ocupacionCreada = ref(null)
const pagado = ref(false)

const mensaje = ref('')
const mensajeTipo = ref<'error'|'info'|'success'|'warning'>('info')

const metodoPago = ref<'efectivo'|'tarjeta'>('efectivo')
const cardNumber = ref('')
const cardPin = ref('')
const cashPin = ref('')
const procesandoPago = ref(false)
const procesandoCancelacion = ref(false)

const cajonesLibres = computed(() => cajonesStore.cajonesDisponibles)

// Establece carga inicial de cajones disponibles
onMounted(async () => {
  await cajonesStore.obtenerCajones()
})

function establecerFechaHoraActualReserva() {
  const ahora = new Date()
  const dosHorasDespues = new Date(ahora.getTime() + 2 * 60 * 60 * 1000)
  const formatoFechaHora = (fecha) => fecha.toISOString().slice(0, 16)
  const formatoFecha = (fecha) => fecha.toISOString().slice(0, 10)

  formReserva.hora_entrada = formatoFechaHora(ahora)
  formReserva.hora_salida = formatoFechaHora(dosHorasDespues)
  formReserva.fecha_reservacion = formatoFecha(ahora)
}

function soloNumerosCliente() {
  formCliente.telefono = formCliente.telefono.replace(/\D/g, '').slice(0, 10)
}

// Computa el precio estimado de la reserva
const precioEstimado = computed(() => {
  const { id_cajon, hora_entrada, hora_salida } = formReserva
  if (!id_cajon || !hora_entrada || !hora_salida) return 0

  const entrada = new Date(hora_entrada)
  const salida  = new Date(hora_salida)
  const diffMs  = salida.getTime() - entrada.getTime()
  if (diffMs <= 0) return 0

  const horas = diffMs / (1000 * 60 * 60)
  const cajon = cajonesLibres.value.find(c => c.id_cajon === id_cajon)
  if (!cajon || !cajon.precio_hora) return 0

  return Number((cajon.precio_hora * horas).toFixed(2))
})

async function crearUsuarioYCliente() {
  if (!(await formClienteRef.value.validate())) return
  guardandoCliente.value = true
  mensaje.value = ''
  try {
    const usuarioRes = await usuarioStore.crearUsuario({ puesto: 'CLIENTE', telefono: formCliente.telefono, contrasena: formCliente.contrasena, correo: formCliente.correo, nombre: formCliente.nombre })
    const id_usuario = usuarioRes.id_usuario
    const { id_cliente } = await clienteStore.crearCliente({ ...formCliente, id_usuario })
    formCarro.id_cliente = id_cliente
    formReserva.id_cliente = id_cliente
    clienteCreado.value = true
    mensaje.value = 'Usuario y Cliente creados con éxito. Ahora registra el carro.'
    mensajeTipo.value = 'success'
  } catch {
    mensaje.value = 'Error al crear usuario o cliente'
    mensajeTipo.value = 'error'
  } finally {
    guardandoCliente.value = false
  }
}

async function guardarCarro() {
  if (!(await formCarroRef.value.validate())) return
  guardandoCarro.value = true
  formCarro.id_cliente = formReserva.id_cliente
  try {
    const res = await carroStore.crearCarro(formCarro)
    formReserva.id_carro = res.id_carro
    carroCreado.value = true
    establecerFechaHoraActualReserva()
    mensaje.value = 'Carro creado con éxito. Ahora reserva un cajón.'
    mensajeTipo.value = 'success'
  } catch {
    mensaje.value = 'Error al crear carro'
    mensajeTipo.value = 'error'
  } finally {
    guardandoCarro.value = false
  }
}

   async function crearReserva() {
     if (!(await formReservaRef.value.validate())) return
     if (formReserva.hora_entrada >= formReserva.hora_salida) {
       mensaje.value = 'Hora de entrada debe ser antes de la salida'
       mensajeTipo.value = 'error'
       return
     }
     guardandoReserva.value = true
     // Guardar el precio estimado al momento de crear la reserva
     formReserva.monto = precioEstimado.value; // Asegúrate de que esto esté calculando correctamente
     console.log("Monto de la reserva:", formReserva.monto); // Agrega este log para verificar
     mensaje.value = ''
     mensajeTipo.value = 'info'
     try {
       const res = await ocupacionStore.crearOcupacion(formReserva)
       const ocup = res.data ?? res
       ocupacionCreada.value = ocup
       if (formReserva.id_cajon != null) {
         await cajonesStore.actualizarCajon(formReserva.id_cajon, { estado: 'reservado' })
       }
       mensaje.value = 'Reserva creada con éxito. Ahora puedes pagar o cancelar.'
       mensajeTipo.value = 'success'
     } catch {
       mensaje.value = 'Error al crear reserva'
       mensajeTipo.value = 'error'
     } finally {
       guardandoReserva.value = false
     }
   }


const puedePagar = computed(() => {
  if (!ocupacionCreada.value) return false
  return metodoPago.value === 'efectivo'
    ? cashPin.value === '123'
    : cardNumber.value.length >= 10 && cardPin.value.length >= 4
})

async function pagarReserva() {
  procesandoPago.value = true
  mensaje.value = ''
  mensajeTipo.value = 'info'
  try {
    const ahora = new Date()
    const referencia = metodoPago.value === 'tarjeta'
      ? cardNumber.value
      : `REF-${ahora.toISOString().replace(/[-:T.]/g, '').slice(0,14)}`
    const ocup = ocupacionCreada.value
       const payload = {
     id_ocupacion: ocup.id_ocupacion,
     metodo: metodoPago.value,
     //monto: precioEstimado.value, // o simplemente precioEstimado si no es ref
     //a

     monto: formReserva.monto, // Asegúrate de que esto esté usando el monto correcto
     descripcion: `Pago por reserva del cajón ${ocup.id_cajon}`,
     referencia,
     fecha_pago: ahora.toISOString(),
     estado: 'pagado',
     tipo: 'reserva',
     id_cliente: formReserva.id_cliente
   }


    const pago = await pagoStore.crearPagoYActualizarOcupacion(payload)
    mensaje.value = `Pago exitoso. Ref: ${pago.referencia}`
    mensajeTipo.value = 'success'
    pagado.value = true
    await cajonesStore.actualizarCajon(ocup.id_cajon, { estado: 'libre' })
  } catch {
    mensaje.value = 'Error al procesar el pago.'
    mensajeTipo.value = 'error'
  } finally {
    procesandoPago.value = false
  }
}

async function cancelarReserva() {
  if (!ocupacionCreada.value?.id_ocupacion) return
  procesandoCancelacion.value = true
  try {
    await ocupacionStore.eliminarOcupacion(ocupacionCreada.value.id_ocupacion)
    if (formReserva.id_cajon != null)
      await cajonesStore.actualizarCajon(formReserva.id_cajon, { estado: 'libre' })
    resetTodo()
    mensaje.value = 'Reserva cancelada'
    mensajeTipo.value = 'info'
  } catch {
    mensaje.value = 'Error al cancelar reserva'
    mensajeTipo.value = 'error'
  } finally {
    procesandoCancelacion.value = false
  }
}

function resetTodo() {
  clienteCreado.value = false
  carroCreado.value = false
  ocupacionCreada.value = null
  pagado.value = false
  metodoPago.value = 'efectivo'
  cardNumber.value = ''
  cardPin.value = ''
  cashPin.value = ''
  mensaje.value = ''
  mensajeTipo.value = 'info'
  Object.assign(formCliente, { nombre:'', correo:'', telefono:'', direccion:'', contrasena:'' })
  Object.assign(formCarro, { placas:'', numero_serie:'', id_cliente:null })
  Object.assign(formReserva, { id_cajon:null, hora_entrada:'', hora_salida:'', fecha_reservacion:'', observaciones:'', id_carro:null, id_cliente:null })
}
</script>


<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px,1fr));
  gap: 10px;
  margin-bottom: 20px;
}
.espacio {
  padding: 10px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  transition: .3s;
  user-select: none;
}
.espacio.libre { background: #00b894; }
.espacio.reservado { background: #f39c12; cursor: not-allowed; }
.espacio.ocupado { background: #d63031; cursor: not-allowed; }
.espacio.seleccionado {
  box-shadow: 0 0 10px 3px #098c56;
  border: 2px solid #fff;
}
.resumen {
  margin-top: 20px;
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}


</style>
