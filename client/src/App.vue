<script setup></script>

<template>
  <v-app>
    <!-- App barra superior -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>ESTACIONAMIENTO</v-toolbar-title>
    </v-app-bar>

    <!--Contenido principal-->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped></style>
