<template>
  <div class="layout">
    <aside class="sidebar">
      <h2>Usuario</h2>
      <nav class="nav">
        <div class="nav-item" @click="activeView = 'register'">
          <span class="icon">📝</span>
          <span>Registrar Usuario</span>
        </div>

        <router-link to="/users" class="nav-item">
          <span class="icon">📝</span>
          <span>Registrar Usuario</span>
        </router-link>

        <div class="nav-item" @click="activeView = 'ReservasPendientes'">
          <span class="icon">💲</span>
          <span>Modificar Precio</span>
        </div>
        <div class="nav-item" @click="activeView = 'report'">
          <span class="icon">📊</span>
          <span>Reportes</span>

        </div>
        <div class="nav-item" @click="activeView = 'history'">
          <span class="icon">📈</span>
          <span>Histórico</span>
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

<script>

import RegistrarUsuario from '@/components/users/ClienteFormularioADD.vue'

import Reservar from '@/components/users/inicioUsers.vue'


import ReservasPendientes from '@/views/ReservasPendientes.vue'


export default {
  components: {
    register: RegistrarUsuario,
   // modify: ModificarUsuario,
   // ModificarPrecio: ModificarPrecio,
    //price: ModificarPrecio,
    reservar: Reservar,
    reservasPendientes: ReservasPendientes,
    //delete: EliminarUsuario,
    //report: Reportes,
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
  height: 100vh;
  background: #1b1b2a;
  color: white;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 250px;
  background: #2e2e4d;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0,0,0,0.3);
}

.sidebar h2 {
  margin-bottom: 20px;
  font-size: 22px;
  text-align: center;
  color: #ffffff;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav-item {
  background: #4e4e79;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.3s;
}

.nav-item:hover {
  background: #6e6e9f;
}

.icon {
  font-size: 20px;
}

.content {
  flex: 1;
  padding: 40px;
  background: #fafafa;
}
</style>
