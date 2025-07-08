import { createRouter, createWebHistory } from "vue-router"


import Login from '../views/Login.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login',
    name: 'Login',
    component: Login 
  },
  { path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue') 
  },
  { path: '/pegawai',
    name: 'DataPegawai',
    component: () => import('../views/DataPegawai.vue') 
  },
  { path: '/presensi',
    name: 'Presensi', component: () => import('../views/Presensi.vue') 
  },
  { path: '/manajemencuti',
    name: 'ManajemenCuti',
    component: () => import('../views/ManajemenCuti.vue') 
  },
  { path: '/profil',
    name: 'Profil',
    component: () => import('../views/Profil.vue') 
  },
  { path: '/laporan',
    name: 'Laporan',
    component: () => import('../views/Laporan.vue') 
  },
  { path: '/pengaturan',
    name: 'Pengaturan',
    component: () => import('../views/Pengaturan.vue') 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Proteksi rute: jika belum login, redirect ke /login
router.beforeEach((to, from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('loggedIn')

  if (authRequired && !loggedIn) {
    return next('/login')
  }

  // Jika sudah login dan buka /login, arahkan ke dashboard
  if (to.path === '/login' && loggedIn) {
    return next('/dashboard')
  }

  next()
})

export default router
