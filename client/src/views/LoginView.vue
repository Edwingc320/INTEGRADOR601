<template>
  <div class="login-container">
    <Topbar />
    <NavbarLanding />

    <!-- Background con overlay -->
    <div class="background-overlay">
      <v-container class="fill-height" fluid>
        <v-row justify="center" align="center" class="full-height">
          <v-col cols="12" sm="8" md="5" lg="4">

            <!-- Card principal con el estilo de la imagen -->
            <v-card class="login-card elevation-12" rounded="lg">

              <!-- Header azul como en la imagen -->
              <div class="login-header">
                <h2 class="header-title">Iniciar sesión</h2>
              </div>

              <!-- Alertas de respuesta -->
              <v-card-text v-if="mensajeVisible" class="alert-section">
                <v-alert
                  :icon="icono"
                  :text="mensaje"
                  title="Respuesta"
                  :type="tipo"
                  variant="tonal"
                />
              </v-card-text>

              <!-- Formulario -->
              <v-card-text class="form-section">
                <v-form v-model="valid">

                  <!-- Campo Usuario -->
                  <div class="input-group">
                    <v-text-field
                      v-model="usuario"
                      label="Usuario"
                      :rules="[rules.required]"
                      required
                      variant="outlined"
                      prepend-inner-icon="mdi-account"
                      class="custom-input"
                      color="primary"
                    />
                  </div>

                  <!-- Campo Contraseña -->
                  <div class="input-group">
                    <v-text-field
                      v-model="contrasenia"
                      label="Contraseña"
                      type="password"
                      :rules="[rules.required]"
                      required
                      variant="outlined"
                      prepend-inner-icon="mdi-lock"
                      class="custom-input"
                      color="primary"
                    />
                  </div>

                </v-form>
              </v-card-text>

              <!-- Botones de acción -->
              <v-card-actions class="action-section">
                <v-btn
                  color="primary"
                  :disabled="!valid"
                  @click="login"
                  class="login-btn"
                  block
                  size="large"
                  rounded="lg"
                >
                  ENTRAR
                </v-btn>
              </v-card-actions>

              <!-- Link para crear cuenta -->
              <v-card-actions class="create-account-section">
                <router-link to="/usuariosCliente/registro" class="create-account-link">
                  <v-btn
                    variant="text"
                    color="info"
                    class="create-account-btn"
                  >
                    CREAR CUENTA
                  </v-btn>
                </router-link>
              </v-card-actions>

            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsuarioStore } from '@/stores/usuario_store'
import Topbar from '@/components/TopbarLanding.vue'
import NavbarLanding from '@/components/NavbarLanding.vue'

const router = useRouter()
const usuarioStore = useUsuarioStore()

const usuario = ref('')
const contrasenia = ref('')
const valid = ref(false)
const mensaje = ref('')
const tipo = ref('')
const mensajeVisible = ref(false)
const icono = ref('')

const rules = {
  required: (v) => !!v || 'Este campo es obligatorio.',
}

async function login() {
  mensajeVisible.value = false
  if (!valid.value) return

  try {
    const payload = {
      nombre: usuario.value,
      contrasena: contrasenia.value,
    }

    const resp = await usuarioStore.login(payload)

    mensaje.value = resp.message || 'Acceso concedido'
    tipo.value = 'success'
    icono.value = 'mdi-check-circle'

    // ✅ Redirige según el rol del usuario
    const puesto = usuarioStore.usuarioActual?.puesto
    if (puesto === 'ADMINISTRADOR') {
      router.push('/admin')
    } else if (puesto === 'CLIENTE') {
      router.push('/users')
    } else {
      mensaje.value = 'Rol no reconocido'
      tipo.value = 'warning'
      icono.value = 'mdi-alert-circle'
    }

  } catch (err) {
    mensaje.value = err?.message || err || 'Error en login'
    tipo.value = 'error'
    icono.value = 'mdi-alert-circle'
  } finally {
    mensajeVisible.value = true
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  position: relative;
}

.background-overlay {
  min-height: 100vh;
  background: linear-gradient(135deg,
    rgba(99, 87, 21, 0.205) 0%,
    rgba(85, 78, 30, 0.363) 50%,
    rgba(87, 83, 25, 0.9) 100%),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="grad" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:rgba(255,255,255,0.1);stop-opacity:1" /><stop offset="100%" style="stop-color:rgba(255,255,255,0);stop-opacity:1" /></radialGradient></defs><circle cx="20" cy="20" r="15" fill="url(%23grad)"/><circle cx="80" cy="60" r="20" fill="url(%23grad)"/><circle cx="40" cy="80" r="10" fill="url(%23grad)"/></svg>');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

.full-height {
  min-height: calc(100vh - 120px);
}

.login-card {
  background: #2d2d2d;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}

.login-header {
  background: #765c2363;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.login-header::before {
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

.header-title {
  color: white;
  font-weight: 600;
  font-size: 1.8rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 1;
}

.alert-section {
  padding: 1rem 2rem 0;
}

.form-section {
  padding: 2rem;
  padding-bottom: 1rem;
  background: #2d2d2d;
}

.input-group {
  margin-bottom: 1.5rem;
}

.custom-input :deep(.v-field) {
  border-radius: 4px;
  transition: all 0.3s ease;
  background-color: #423a2893;
  border: 1px solid #000000;
}

.custom-input :deep(.v-field-label) {
  color: #ccc !important;
}

.custom-input :deep(.v-field__input) {
  color: #fff !important;
}

.action-section {
  padding: 0 2rem 1.5rem;
  background: #2d2d2d;
}

.login-btn {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  background: #f5bc4379 !important;
  color: rgb(255, 255, 255) !important;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.4);
}

.create-account-section {
  padding: 0 2rem 2rem;
  justify-content: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 1rem;
  padding-top: 1.5rem;
  background: #2d2d2d;
}

.create-account-link {
  text-decoration: none;
}

.create-account-btn {
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  color: #ffffff !important;
}

.create-account-btn:hover {
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .background-overlay {
    padding: 1rem 0;
  }

  .login-header {
    padding: 1.5rem;
  }

  .header-title {
    font-size: 1.5rem;
  }

  .form-section {
    padding: 1.5rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .login-card {
    background: rgba(30, 30, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
