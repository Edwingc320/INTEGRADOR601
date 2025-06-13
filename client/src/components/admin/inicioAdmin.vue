<template>
    <Topbar />
    <NavbarLanding />


  <div class="layout">
    <aside class="sidebar">
      <h2>Administrador</h2>
      <nav class="nav">
        <div class="nav-item" @click="activeView = 'register'">
          <span class="icon">📝</span>
          <span>Registrar Usuario</span>
        </div>
        <div class="nav-item" @click="activeView = 'modify'">
          <span class="icon">✏️</span>
          <span>Modificar Usuario</span>
        </div>

        <div class="nav-item" @click="activeView = 'delete'">
          <span class="icon">🗑️</span>
          <span>Eliminar Usuario</span>
        </div>
         <div class="nav-item" @click="activeView = 'reservar'">
          <span class="icon"></span>
          <span>Reservar</span>
        </div>
        <div class="nav-item" @click="activeView = 'price'">
          <span class="icon">💲</span>
          <span>Modificar Precio</span>
        </div>
        <div class="nav-item" @click="activeView = 'report'">
          <span class="icon">📊</span>
          <span>Reportes</span>

        </div>

      </nav>
    </aside>

    <main class="content">
      <h1>Zona Administrativa</h1>
      <component :is="activeView" v-if="activeView" />
      <div v-else>
        <p>Selecciona una opción del menú para comenzar.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import Topbar from '@/components/TopbarLanding.vue'
import NavbarLanding from '@/components/NavbarLanding.vue'
</script>


<script>
import RegistrarUsuario from '@/components/adminAccions/UsuariosFormulario.vue'
import ModificarUsuario from '@/components/adminAccions/ModificarUsuario.vue'
import ModificarPrecio from '@/components/adminAccions/GestionarCajones.vue'
import Reservar from '@/components/adminAccions/ReservaFisica.vue'
import EliminarUsuario from '@/components/adminAccions/EliminarUsuario.vue'
import Reportes from '@/components/adminAccions/ReportesAdmin.vue'

//import Historico from '@/components/adminAccions/Historico.vue'

export default {
  components: {
    register: RegistrarUsuario,
    modify: ModificarUsuario,
    price: ModificarPrecio,
    reservar: Reservar,
    delete: EliminarUsuario,
    report: Reportes,
    //history: Historico
  },
  data() {
    return {
      activeView: null
    }
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  max-height: 100vh;  /* Para evitar que el layout se desborde */
  overflow: hidden;   /* Corta cualquier desbordamiento */
  background: #ffffff5b;
  color: rgb(0, 0, 0);
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 250px;
  background: #a2aec600;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(244, 237, 237, 0.3);
  overflow-y: auto;         /* Habilita scroll vertical */
  max-height: 100vh;        /* Evita que exceda la ventana */
}


.sidebar h2 {
  margin-bottom: 20px;
  text-align: center;
  font-size: 22px;
  color: #ffffff;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav-item {
  background: #00000062;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s;
}
.content {
  flex: 1;
  padding: 40px;
  text-align: center;
  background: #fefefe;
  overflow-y: auto;
  max-height: 100vh;
}

.nav-item:hover {
  background: #ff2516;
}

.icon {
  font-size: 20px;
}

.content {
  flex: 1;
  padding: 40px;
  background: #ffffff00;
}
</style>
