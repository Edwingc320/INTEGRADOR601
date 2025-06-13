<template>
  <v-app>

    <v-main class="background">
      <div class="content">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.background {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.background::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("@/assets/img/car3.jfif");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  filter: blur(3px);
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
}
</style>
