<template>
  <div>
    <div style="height: 70px;"></div> <!-- Espacio arriba -->

    <Topbar/>
    <div style="height: 20px;"></div> <!-- Espacio arriba -->

    <NavbarLanding />
    <CarouselLanding />
  </div>
</template>

<script setup>
import Topbar from '@/components/TopbarLanding.vue'
import NavbarLanding from '@/components/NavbarLanding.vue'
import CarouselLanding from '@/components/CarouselLanding.vue'
</script>

<style scoped>
/* No repitas fondo ni z-index aquí */
/* Ajusta margen si ves contenido tapado por el navbar */
</style>
