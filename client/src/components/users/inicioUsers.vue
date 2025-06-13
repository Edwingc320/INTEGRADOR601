<template>
  <Topbar />
  <NavbarLanding />
  <div class="estacionamiento-container">
    <!-- Background con overlay -->
    <div class="background-overlay">
      <v-container fluid class="py-6">



        <!-- Sección Mis Datos -->
        <v-card class="modern-card mb-6" v-if="clienteActual">
          <div class="card-header">
            <h2 class="section-title">👤 Mis Datos</h2>
          </div>
          <v-card-text class="card-content">
            <div class="cliente-info">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Nombre:</span>
                  <span class="info-value">{{ clienteActual.nombre }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Teléfono:</span>
                  <span class="info-value">{{ clienteActual.telefono }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Correo:</span>
                  <span class="info-value">{{ clienteActual.correo }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Dirección:</span>
                  <span class="info-value">{{ clienteActual.direccion }}</span>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Sección Reservas Pendientes -->
        <v-card class="modern-card mb-6">
          <div class="card-header">
            <h2 class="section-title">⏰ Reservas Pendientes</h2>
          </div>
          <v-card-text class="card-content">
            <ReservasPendientesCliente
              v-if="clienteActual && clienteActual.id_cliente"
              :clienteId="clienteActual.id_cliente"
            />
          </v-card-text>
        </v-card>

        <!-- Sección Selección de Espacio -->
        <v-card class="modern-card mb-6">
          <div class="card-header">
            <h2 class="section-title">🅿️ Selecciona un espacio disponible</h2>
          </div>
          <v-card-text class="card-content">
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

            <div v-if="cajonSeleccionado" class="resumen-seleccion">
              <h3 class="resumen-title">📋 Resumen de selección</h3>
              <div class="resumen-content">
                <p><strong>Espacio:</strong> {{ cajonSeleccionado.numero }}</p>
                <p><strong>Precio por hora:</strong> ${{ cajonSeleccionado.precio_hora }}</p>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Formulario de Carro y Ocupación -->
        <v-card class="modern-card mb-6" v-if="clienteActual && cajonSeleccionado">
          <div class="card-header">
            <h2 class="section-title">🚙 Datos del Vehículo</h2>
          </div>
          <v-card-text class="card-content">
            <FormularioCarro
              v-if="!ocupacionGenerada"
              :id-cliente="clienteActual.id_cliente"
              @carro-creado="manejarCarroCreado"
            />

            <div
              v-if="cajonSeleccionado && formCarroCompletado && !ocupacionGenerada"
              class="form-ocupacion"
            >
              <h3 class="form-subtitle">📅 Detalles de la Reservación</h3>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Hora entrada:</label>
                  <input type="datetime-local" v-model="horaEntrada" class="form-input" />
                </div>

                <div class="form-group">
                  <label class="form-label">Hora salida:</label>
                  <input type="datetime-local" v-model="horaSalida" class="form-input" />
                </div>

                <div class="form-group">
                  <label class="form-label">Fecha reservación:</label>
                  <input type="date" v-model="fechaReservacion" class="form-input" />
                </div>

                <div class="form-group full-width">
                  <label class="form-label">Observaciones:</label>
                  <textarea v-model="observaciones" placeholder="Opcional" class="form-textarea"></textarea>
                </div>
              </div>

              <div v-if="duracionHoras > 0 && parseFloat(costoTotal) > 0" class="resumen-costo">
                <h4 class="costo-title">💰 Resumen de Costos</h4>
                <div class="costo-content">
                  <p><strong>Duración:</strong> {{ duracionHoras.toFixed(2) }} horas</p>
                  <p class="costo-total"><strong>Costo total estimado:</strong> ${{ costoTotal }}</p>
                </div>
              </div>

              <button
                class="btn-primary"
                @click="crearCarroYOcupacion"
                :disabled="!validarFormulario()"
              >
                🎯 Reservar espacio
              </button>
            </div>

            <div v-if="mensajePago" class="mensaje-pago">
              <p>{{ mensajePago }}</p>
            </div>
          </v-card-text>
        </v-card>

        <!-- Sección de Pago -->
        <v-card class="modern-card mb-6" v-if="ocupacionGenerada?.id_ocupacion && !ocupacionGenerada.pagado">
          <div class="card-header">
            <h2 class="section-title">💳 Método de Pago</h2>
          </div>
          <v-card-text class="card-content">
            <div class="pago-opciones">
              <label class="radio-option">
                <input type="radio" value="efectivo" v-model="metodoPago" />
                <span class="radio-label">💵 Efectivo</span>
              </label>
              <label class="radio-option">
                <input type="radio" value="tarjeta" v-model="metodoPago" />
                <span class="radio-label">💳 Tarjeta</span>
              </label>
            </div>

            <!-- Campos para Tarjeta -->
            <div v-if="metodoPago === 'tarjeta'" class="tarjeta-form">
              <div class="form-group">
                <label class="form-label">Número de tarjeta:</label>
                <input
                  type="text"
                  v-model="cardNumber"
                  placeholder="Número de tarjeta"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label class="form-label">PIN de tarjeta:</label>
                <input
                  type="password"
                  v-model="cardPin"
                  placeholder="PIN"
                  class="form-input"
                />
              </div>
            </div>

            <!-- Campo para Efectivo PIN -->
            <div v-if="metodoPago === 'efectivo'" class="efectivo-form">
              <div class="form-group">
                <label class="form-label">PIN ESTACIONAMIENTO:</label>
                <input
                  type="password"
                  v-model="cashPin"
                  placeholder="PIN del estacionamiento"
                  class="form-input"
                />
              </div>
            </div>

            <div class="pago-actions">
              <button
                class="btn-primary"
                @click="pagarOcupacion"
                :disabled="!puedePagar"
              >
                💰 Pagar ahora
              </button>

              <button class="btn-secondary" @click="cancelarOcupacion">
                ❌ Cancelar reservación
              </button>
            </div>
          </v-card-text>
        </v-card>

        <!-- Confirmación y Login -->
        <v-card class="modern-card" v-if="pagoExitoso">
          <div class="card-header success">
            <h2 class="section-title">✅ ¡Pago Exitoso!</h2>
          </div>
          <v-card-text class="card-content text-center">
            <p class="success-message">{{ mensajePago }}</p>
            <button class="btn-primary" @click="irALogin">
              🔐 Ir al login
            </button>
          </v-card-text>
        </v-card>

      </v-container>
    </div>
  </div>
</template>

<style scoped>

.estacionamiento-container {
  min-height: 100vh;
  position: relative;
}

.background-overlay {
  min-height: 100vh;
  background: linear-gradient(135deg,
    #23200cd7 0%,
    rgba(24, 23, 7, 0.77) 50%,
    rgba(36, 30, 5, 0.173) 100%),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="grad" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:rgba(255,255,255,0.1);stop-opacity:1" /><stop offset="100%" style="stop-color:rgba(255,255,255,0);stop-opacity:1" /></radialGradient></defs><circle cx="20" cy="20" r="15" fill="url(%23grad)"/><circle cx="80" cy="60" r="20" fill="url(%23grad)"/><circle cx="40" cy="80" r="10" fill="url(%23grad)"/></svg>');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.main-header {
  text-align: center;
  margin-bottom: 2rem;
}

.header-title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  margin: 0;
}

.modern-card {
  background: rgba(45, 45, 45, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.modern-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.card-header {
  background: #2d260b;
  padding: 1.5rem 2rem;
  position: relative;
  overflow: hidden;
}

.card-header.success {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
}

.card-header::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
  transform: rotate(45deg);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

.section-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.card-content {
  background: #2d2d2d8a;
  color: #fff;
  padding: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.info-label {
  color: #ccc;
  font-weight: 500;
  display: block;
  margin-bottom: 0.5rem;
}

.info-value {
  color: #fff;
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.espacio {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.espacio.libre {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.espacio.libre:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.espacio.reservado {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.espacio.ocupado {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  cursor: not-allowed;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.espacio.seleccionado {
  border: 2px solid #4285f4;
  box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.3);
  transform: scale(1.05);
}

.resumen-seleccion {
  background: rgba(66, 133, 244, 0.1);
  border: 1px solid rgba(66, 133, 244, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.resumen-title {
  color: #4285f4;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.resumen-content p {
  margin: 0.5rem 0;
  color: #fff;
}

.form-subtitle {
  color: #4285f4;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  color: #ccc;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-input, .form-textarea {
  background: #404040;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 0.75rem;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.resumen-costo {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.costo-title {
  color: #4caf50;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.costo-content p {
  margin: 0.5rem 0;
  color: #fff;
}

.costo-total {
  font-size: 1.2rem;
  color: #4caf50 !important;
}

.pago-opciones {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.radio-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.radio-label {
  color: #fff;
  font-weight: 500;
}

.pago-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #4285f4 0%, #1976d2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(66, 133, 244, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(244, 67, 54, 0.4);
}

.success-message {
  color: #4caf50;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.mensaje-pago {
  background: rgba(66, 133, 244, 0.1);
  border: 1px solid rgba(66, 133, 244, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .header-title {
    font-size: 2rem;
  }

  .grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }

  .espacio {
    width: 60px;
    height: 60px;
    font-size: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .pago-opciones {
    flex-direction: column;
    gap: 1rem;
  }

  .pago-actions {
    flex-direction: column;
  }
}
</style>


<script setup lang="ts">

import Topbar from '@/components/TopbarLanding.vue'
import NavbarLanding from '@/components/NavbarLanding.vue'
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
