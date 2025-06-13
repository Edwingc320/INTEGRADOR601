<template>
  <div>
    <!-- Topbar para escritorio (md y arriba) -->
    <v-app-bar
      v-if="display.mdAndUp"
      app
      flat
      height="100"
      color="#230075"
      class="topbar"
    >
      <v-container fluid class="pa-0 px-lg-5">
        <v-row align="center" no-gutters class="fill-height">
          <!-- Izquierda: teléfono y email -->
          <v-col cols="12" lg="6" class="d-flex align-center">
            <v-btn text small class="text-body me-4" href="tel:+0123456789">
              <v-icon left small class="me-1">fas fa-phone-alt</v-icon>
              +012 345 6789
            </v-btn>
            <span class="text-body me-4">|</span>
            <v-btn text small class="text-body" href="mailto:info@example.com">
              <v-icon left small class="me-1">fas fa-envelope</v-icon>
              5deMayo@example.com
            </v-btn>
          </v-col>
          <!-- Derecha: redes sociales -->
          <v-col cols="12" lg="6" class="d-flex justify-end">
            <v-btn
              v-for="(item, i) in socialLinks"
              :key="i"
              icon
              class="text-body mx-1"
              :href="item.href"
              target="_blank"
            >
              <i :class="item.icon" />
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- Topbar móvil (menor a md) -->
    <v-app-bar
      v-else
      app
      flat
      height="48"
      color="#230075"
      class="topbar"
    >
      <v-container fluid class="pa-0 px-3">
        <v-row align="center" no-gutters class="fill-height">
          <v-col class="d-flex justify-end" cols="12">
            <v-btn icon @click="drawer = true" aria-label="Abrir redes sociales">
              <v-icon color="white" size="28">mdi-menu</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- Drawer para redes sociales -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      right
      color="#230075"
      dark
      width="240"
    >
      <v-list>
        <v-list-item>
          <v-btn icon @click="drawer = false" aria-label="Cerrar menú" class="ms-auto">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-list-item>
        <v-list-item
          v-for="(item, i) in socialLinks"
          :key="i"
          :href="item.href"
          target="_blank"
          link
          @click="drawer = false"
        >
          <v-list-item-icon>
            <v-icon :class="item.icon" color="white" />
          </v-list-item-icon>
          <v-list-item-title class="white--text">{{ getSocialName(item.icon) }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'

const drawer = ref(false)
const display = useDisplay()

const socialLinks = [
  { icon: 'fab fa-facebook-f', href: 'https://facebook.com' },
  { icon: 'fab fa-twitter', href: 'https://twitter.com' },
  { icon: 'fab fa-linkedin-in', href: 'https://linkedin.com' },
  { icon: 'fab fa-instagram', href: 'https://instagram.com' },
  { icon: 'fab fa-youtube', href: 'https://youtube.com' },
]

const getSocialName = (icon) => {
  if (icon.includes('facebook')) return 'Facebook'
  if (icon.includes('twitter')) return 'Twitter'
  if (icon.includes('linkedin')) return 'LinkedIn'
  if (icon.includes('instagram')) return 'Instagram'
  if (icon.includes('youtube')) return 'YouTube'
  return ''
}
</script>

<style scoped>


.text-body {
  color: rgba(255, 255, 255, 0.87) !important;
  line-height: 1.2;
}

.me-4 {
  margin-right: 2.0rem !important;
}

.mx-1 {
  margin-left: 1rem !important;
  margin-right: 1rem !important;
}
.topbar {
  height: 100px !important;
  padding-top: 0 !important; /* elimina padding extra */
  background-color: #403d30ab !important;
  border-bottom: 2px solid #fff; /* opcional */
}

/* Asegura que el contenido no quede tapado por la barra */
.content {
  margin-top: 70px; /* igual a la altura de la barra */
  position: relative;
  z-index: 1;
}


.ms-auto {
  margin-left: auto !important;
}

.v-icon {
  line-height: 1 !important;
  height: 24px !important;
  width: 24px !important;
  vertical-align: middle;
}

.v-navigation-drawer {
  background-color: #230075 !important;
}
</style>
