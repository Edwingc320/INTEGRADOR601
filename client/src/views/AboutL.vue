<template>
  <Topbar />
  <NavbarLanding />

  <div class="estacionamiento-container">
    <!-- Ubicación y mapa -->
    <v-card class="modern-card mb-6">
      <div class="card-header">
        <h2 class="section-title">📍 Ubicación</h2>
      </div>
      <v-card-text class="card-content">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3759.4774350837233!2d-99.76647582590732!3d19.56403613647247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d265b593fc3631%3A0x811a53f1d1a6b8b1!2sEstacionamiento!5e0!3m2!1ses-419!2smx!4v1749778956073!5m2!1ses-419!2smx"
          width="100%"
          height="350"
          style="border:0;"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>

        <h2 class="location-address">
           Av. Gustavo Baz Prada Manzana 002, Centro, 50740 Ixtlahuaca de Rayón, Méx.
        </h2>
        <h2 class="opening-hours"> Abierto ⋅ Cierra a las 10 p.m.</h2>
        <h2 class="location-info"> H67P+JC Ixtlahuaca de Rayón, Estado de México</h2>
      </v-card-text>
    </v-card>

    <!-- Datos de contacto -->
    <v-card class="modern-card mb-6">
      <div class="card-header success">
        <h2 class="section-title">📞 Contacto</h2>
      </div>
      <v-card-text class="card-content contact-content">
        <div>👨‍💼 Administrador: Juan Pérez</div>
        <div>☎️ Teléfono: 55 1234 5678</div>
        <div>✉️ Email: contacto@estacionamiento.com</div>
        <div>🌐 Sitio Web:
          <a href="https://estacionamientocentro.com" target="_blank" class="link">
            estacionamientocentro.com
          </a>
        </div>
      </v-card-text>
    </v-card>

    <!-- Servicios -->
    <v-card class="modern-card mb-6">
      <div class="card-header">
        <h2 class="section-title">🚗 Servicios</h2>
      </div>
      <v-card-text class="card-content">
        <ul class="services-list">
          <li>✔️ Estacionamiento techado</li>
          <li>✔️ Seguridad 24 horas</li>
          <li>✔️ Pago con tarjeta</li>
          <li>✔️ Lavado de autos</li>
          <li>✔️ Carga para vehículos eléctricos</li>
        </ul>
      </v-card-text>
    </v-card>

    <!-- Horarios -->
    <v-card class="modern-card">
      <div class="card-header success">
        <h2 class="section-title">🕒 Horarios</h2>
      </div>
      <v-card-text class="card-content">
        <ul class="hours-list">
          <li>Lunes a Viernes: 7:00 AM - 10:00 PM</li>
          <li>Sábados: 8:00 AM - 8:00 PM</li>
          <li>Domingos: Cerrado</li>
        </ul>
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

/* Reuso de tus estilos modernos */
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

.location-address,
.opening-hours,
.location-info {
  margin-top: 1rem;
  font-weight: 500;
}

.contact-content div {
  margin-bottom: 0.75rem;
}

.link {
  color: #90caf9;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.services-list,
.hours-list {
  list-style: none;
  padding-left: 1rem;
}

.services-list li::before {
  content: '✔️ ';
}

.hours-list li {
  margin-bottom: 0.5rem;
}
</style>
