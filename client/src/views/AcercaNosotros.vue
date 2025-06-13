<template>
  <Topbar />
  <NavbarLanding />

  <div class="estacionamiento-container">
    <!-- Acerca de Nosotros -->
    <v-card class="modern-card mb-6">
      <div class="card-header">
        <h2 class="section-title">🏢 Acerca de Nosotros</h2>
      </div>
      <v-card-text class="card-content">
        <p>
          Fundado en 2010, nuestro estacionamiento se ha comprometido a brindar
          un servicio seguro, cómodo y accesible para todos nuestros clientes.
          Contamos con vigilancia 24/7 y tecnología avanzada para proteger tu
          vehículo mientras disfrutas de tus actividades.
        </p>
        <p>
          Nuestro equipo está dedicado a ofrecer la mejor atención y mantener
          instalaciones limpias y bien iluminadas. ¡Gracias por confiar en
          nosotros!
        </p>
      </v-card-text>
    </v-card>

    <!-- Reseñas -->
    <v-card class="modern-card">
      <div class="card-header success">
        <h2 class="section-title">⭐ Reseñas</h2>
      </div>
      <v-card-text class="card-content reviews-content">
        <div class="review">
          <strong>María G.</strong> <em>– 5 estrellas</em>
          <p>“Excelente servicio y muy seguro. Siempre encuentro lugar y el personal es amable.”</p>
        </div>

        <div class="review">
          <strong>Carlos M.</strong> <em>– 4 estrellas</em>
          <p>“Buen lugar, limpio y bien ubicado. Podrían mejorar un poco los precios.”</p>
        </div>

        <div class="review">
          <strong>Laura T.</strong> <em>– 5 estrellas</em>
          <p>“Me encanta que tengan carga para autos eléctricos. Muy recomendable.”</p>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import Topbar from '@/components/TopbarLanding.vue'
import NavbarLanding from '@/components/NavbarLanding.vue'
</script>

<style scoped>
.estacionamiento-container {
  min-height: 100vh;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

/* Usamos estilos ya definidos */
.modern-card {
  background: rgba(45, 45, 45, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
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
  color: #90caf9;
  margin-left: 0.5rem;
  font-style: normal;
}

.reviews-content p {
  margin: 0.25rem 0 0 0;
  line-height: 1.3;
}
</style>
