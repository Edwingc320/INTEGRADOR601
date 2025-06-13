<template>
  <div>
    <!-- App Bar -->
    <v-app-bar app color="dark" dark elevate-on-scroll>
      <v-container fluid class="px-lg-5">
        <v-row align="center" no-gutters class="fill-height">
          <!-- Logo -->
          <v-col cols="auto" class="d-flex align-center">
            <RouterLink to="/" class="text-decoration-none">
              <span class="brand-text">ESTACIONAMIENTO 5 DE MAYO</span>
            </RouterLink>
          </v-col>

          <v-spacer />

          <!-- Menú horizontal (md en adelante) -->
          <v-col class="d-none d-md-flex" cols="auto">
            <v-btn text class="nav-link" to="/">Home</v-btn>
            <v-btn text class="nav-link" to="/about">Acerca de nosotros</v-btn>
            <v-btn text class="nav-link" to="/service">Service</v-btn>
            <v-btn text class="nav-link" to="/login">Login</v-btn>
          </v-col>

          <!-- Botón hamburguesa (visible solo en sm) -->
          <v-col class="d-flex d-md-none" cols="auto">
            <v-tooltip bottom>
              <template #activator="{ props }">
                <v-btn
                  icon
                  v-bind="props"
                  @click="drawer = true"
                  aria-label="Abrir menú"
                  class="hamburger-btn"
                >
                  <img
                    src="@/assets/img/configuracion.png"
                    alt="Menú"
                    style="width: 28px; height: 28px; object-fit: contain;"
                  />
                </v-btn>
              </template>
              <span>Abrir menú</span>
            </v-tooltip>
          </v-col>


        </v-row>
      </v-container>
    </v-app-bar>

    <!-- Drawer fuera del app-bar -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      right
      dark
      color="primary"
    >
      <v-list>
        <v-list-item link to="/" @click="drawer = false">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/about" @click="drawer = false">
          <v-list-item-title>Acerca de nosotros</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/service" @click="drawer = false">
          <v-list-item-title>Service</v-list-item-title>
        </v-list-item>
        <v-list-item link to="/login" @click="drawer = false">
          <v-list-item-title>Login</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenido principal -->
    <v-main>
      <slot />
    </v-main>

  </div>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(false)
</script>

<style scoped>
.brand-text {
  font-weight: bold;
  color: orange;
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: clamp(1rem, 4vw, 1.5rem);
}

.nav-link {
  text-transform: none;
  font-weight: 500;
  color: white !important;
  padding: 10px 15px;
  white-space: nowrap;
}

.v-navigation-drawer {
  background-color: hsla(0, 0%, 33%, 0.811) !important;
}


.hamburger-btn:hover {
  background-color: rgba(57, 57, 57, 0.636);
}

/* Fondo semitransparente para el app-bar */
.v-application .v-app-bar {
  background-color: hsla(0, 0%, 24%, 0.777) !important;
}
</style>
