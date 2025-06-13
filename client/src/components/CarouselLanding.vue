<template>
  <v-container fluid class="pa-0 carousel-container">
    <v-carousel
      cycle
      :hide-delimiters="false"
      show-arrows-on-hover
      class="full-height-carousel"
    >
      <v-carousel-item :key="1">
        <v-img :src="carousel1" class="fill-height">
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate />
            </v-row>
          </template>
          <template #default>
            <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div class="p-3" style="max-width: 900px;">
                <h4 class="text-white text-uppercase mb-md-3">Protege tu auto</h4>
                <h1 class="display-1 text-white mb-md-4">
                  La mejor opcion para dejar tu auto
                </h1>
                <v-btn color="primary" large class="mt-2" @click="onReserve">
                  Reserve ahora
                </v-btn>
              </div>
            </div>
          </template>
        </v-img>
      </v-carousel-item>

      <v-carousel-item :key="2">
        <v-img :src="carousel2" class="fill-height">
          <template #placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate />
            </v-row>
          </template>
          <template #default>
            <div class="carousel-caption d-flex flex-column align-items-center justify-content-center">
              <div class="p-3" style="max-width: 900px;">
                <h4 class="text-white text-uppercase mb-md-3">Protege tu auto!</h4>
                <h1 class="display-1 text-white mb-md-4">
                  El mejor lugar para estacionar tu auto
                </h1>
                <v-btn color="primary" large class="mt-2" @click="onReserve">
                  Reserve ahora
                </v-btn>
              </div>
            </div>
          </template>
        </v-img>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import carousel1 from '@/assets/img/carousel-1.jpg'
import carousel2 from '@/assets/img/carousel-2.jpg'

const router = useRouter()
function onReserve() {
  router.push('/login')
}
</script>

<style scoped>
/* Ajusta este valor a la altura real de tu navbar (en px) */
:root {
  --navbar-height: 100px; /* Cambia esto si tu navbar es más pequeño o grande */
}

.carousel-container {
  margin-top: var(--navbar-height);
  margin-bottom: 0;
}

.full-height-carousel {
  height: calc(100vh - var(--navbar-height));
}

.v-img.fill-height img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-caption {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  background: rgba(0, 0, 0, 0.4);
}

.text-white {
  color: white;
}

@media (max-width: 600px) {
  .carousel-caption h1 {
    font-size: 2rem;
  }
}
</style>
