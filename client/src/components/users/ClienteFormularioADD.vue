<!-- components/FormularioCREARCLIENTE/USUARIO.vue -->
<template>
  <Topbar />
  <NavbarLanding />
  <v-card  width="500" class="pa-4">
    <v-card-title>Registrate</v-card-title>

    <v-card-text>
      <v-form @submit.prevent="guardarCliente" ref="formRef" v-model="formValido">
        <v-text-field
          v-model="form.nombre"
          label="Nombre"
          :rules="[
            v => !!v || 'El nombre es requerido',
            v => v.length >= 3 || 'Mínimo 3 caracteres'
          ]"
          required
        />
        <v-text-field
          v-model="form.correo"
          label="Correo electrónico"
          type="email"
          :rules="[
            v => !!v || 'El correo es requerido',
            v => /.+@.+\..+/.test(v) || 'Correo no válido'
          ]"
          required
        />
        <v-text-field
          v-model="form.telefono"
          label="Teléfono"
          type="tel"
          maxlength="10"
          :rules="[
            v => !!v || 'El teléfono es requerido',
            v => /^\d{10}$/.test(v) || 'Debe tener exactamente 10 dígitos'
          ]"
          @input="soloNumeros"
          required
        />
        <v-text-field
          v-model="form.direccion"
          label="Dirección"
          :rules="[v => !!v || 'La dirección es requerida']"
          required
        />
        <v-text-field
          v-model="form.contrasena"
          label="Contraseña"
          type="password"
          :rules="[
            v => !!v || 'La contraseña es requerida',
            v => v.length >= 8 || 'Mínimo 8 caracteres'
          ]"
          required
        />

        <v-btn type="submit" color=#ffff class="mt-4">
          Crear Cliente
        </v-btn>
      </v-form>
    </v-card-text>

    <v-card-actions class="justify-center">
      <router-link to="/login">
        <v-btn text color="secondary">
          Volver a Login
        </v-btn>
      </router-link>
    </v-card-actions>
  </v-card>
</template>


<script setup>
//asynchronousaa
import Topbar from '@/components/TopbarLanding.vue'
import NavbarLanding from '@/components/NavbarLanding.vue'
import { reactive, ref } from 'vue'
import { useUsuarioStore } from '@/stores/usuario_store'
import { useClienteStore } from '@/stores/cliente_store'

const usuarioStore = useUsuarioStore()
const clienteStore = useClienteStore()

const formValido = ref(false)
const formRef = ref(null)

const form = reactive({
  nombre: '',
  correo: '',
  telefono: '',
  direccion: '',
  contrasena: ''
})

const soloNumeros = () => {
  form.telefono = form.telefono.replace(/\D/g, '').slice(0, 10)
}

const guardarCliente = async () => {
  const validado = await formRef.value.validate()
  if (!validado) return

  try {
    // Crear el usuario
    const usuarioPayload = {
      nombre: form.nombre,
      correo: form.correo,
      telefono: form.telefono,
      contrasena: form.contrasena,
      puesto: 'CLIENTE'
    }

    const usuarioCreado = await usuarioStore.crearUsuario(usuarioPayload)


    if (!usuarioCreado || !usuarioCreado.id_usuario) {
      throw new Error('No se pudo obtener el ID del usuario creado')
    }

    // Crear el cliente con el ID del usuario
    const clientePayload = {
      nombre: form.nombre,
      correo: form.correo,
      telefono: form.telefono,
      direccion: form.direccion,
      contrasena: form.contrasena,
      id_usuario: usuarioCreado.id_usuario

    }

    await clienteStore.crearCliente(clientePayload)

    alert('Cliente y usuario creados correctamente')
    // Limpiar formulario
    form.nombre = ''
    form.correo = ''
    form.telefono = ''
    form.direccion = ''
    form.contrasena = ''
    formRef.value.resetValidation()

  } catch (error) {
    alert('Error al crear cliente/usuario: ' + (error.message || error))
    console.error(error)
  }
}

</script>

<style scoped>
.router-link.btn {
  text-decoration: none; /* quita subrayado */
  color: white;           /* fuerza color del texto */
}



/* Usamos estilos ya definidos */
.p-4 {
  background: rgba(45, 45, 45, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.p-a-card:hover {
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
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) rotate(45deg);
  }
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
  padding: 1.5rem 2rem;
}

.reviews-content .review {
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.reviews-content strong {
  font-weight: 700;
}

.reviews-content em {
  color: #85919a;
  margin-left: 0.5rem;
  font-style: normal;
}

.reviews-content p {
  margin: 0.25rem 0 0 0;
  line-height: 1.3;
}
.estacionamiento-container {
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(to right, #3e2f0b, #2c1f06);
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-card {
  background: rgba(59, 44, 16, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  color: #fff;
}

.v-card-title {
  background-color: #65491c82;
  color: #fff;
  font-weight: bold;
  padding: 1rem;
  border-radius: 12px 12px 0 0;
  font-size: 1.4rem;
}

.v-card-text {
  padding: 1.5rem;
}
.mt-4{
  align-items: center;
}

.v-btn {
  font-weight: bold;
  border-radius: 8px;
}

.v-btn[color="primary"] {
  background-color: #795548 !important; /* café */
  color: white;
}

.v-btn[color="secondary"] {
  background-color: #f6490b !important; /* café claro */
  color: rgb(255, 0, 0);
}

</style>
