///ROUTER/INDEX.JS
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/usuarios/registro',
      name: 'usuariosRegistro',
      component: () => import('../views/UsuarioView.vue'),
    },
    {
      path: '/usuariosCliente/registro',
      name: 'usuariosClienteRegistro',
      component: () => import('../views/ClienteView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/cliente',
      name: 'cliente',
      component: () => import('../views/Usuario_cliente.vue'),
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
    },
    {
      path: '/reservas/pendientes',
      name: 'reservasPendientes',
      component: () => import('../views/ReservasPendientes.vue'),
    },
    {
      path: '/pago',
      name: 'pago',
      component: () => import('../views/PagoView.vue'),
    },
    {
      path: '/carro',
      name: 'carro',
      component: () => import('../views/CarroView.vue'),
    },
    {
      path: '/users/reservas',
      name: 'ReservasPendientes',
      component: () => import('@/views/ReservasPendientes.vue'),
      meta: { requiresAuth: true }
    },

    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
