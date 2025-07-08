import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { Quasar } from 'quasar'
import 'quasar/dist/quasar.sass'
import '@quasar/extras/material-icons/material-icons.css'

import { createPinia } from 'pinia'

const app = createApp(App)

app.use(Quasar, { plugins: {} })

app.use(router)

const pinia = createPinia()
app.use(pinia)

app.mount('#app')
