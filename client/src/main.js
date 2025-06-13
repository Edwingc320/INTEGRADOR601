//import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

//
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'
// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Font Awesome CSS
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.css'


//
const vuetify = createVuetify({
  components,
  directives,
})


const app = createApp(App)

app.use(vuetify)//
app.use(createPinia())
app.use(router)

app.mount('#app')
