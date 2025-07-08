<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <q-header
      v-if="$q.screen.lt.md && $route.path !== '/login'"
      class="bg-white text-dark shadow-md q-pa-sm"
    >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="drawer = !drawer"
        />
        <q-toolbar-title class="text-weight-bold text-primary">
          JepTrack
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$route.path !== '/login'"
      v-model="drawer"
      show-if-above
      side="left"
      class="custom-sidebar q-pa-none"
      :width="260"
      bordered
    >

      <Sidebar />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/Sidebar.vue'

const drawer = ref(true)
</script>

<style lang="scss">
:root {
  --primary: #4ade80;
  --primary-alt: #1e3a2f;
  --grey: #94a3b8;
  --dark: #1e293b;
  --dark-alt: #334155;
  --light: white;
  --sidebar-width: 260px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Fira Sans', sans-serif;
}

html, body, #q-app {
  height: 100%;
  background: var(--light);
}

.custom-sidebar {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  .q-drawer__content {
    padding: 0 !important;
    background-color: transparent !important;
  }
}

.q-layout {
  background-color: white !important;
}

.main-content {
  padding: 2rem;
  overflow-y: auto;
  min-height: 100vh;
  background-color: var(--light);
}

@media (max-width: 1024px) {
  .main-content {
    padding: 1rem;
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

button {
  cursor: pointer;
  appearance: none;
  border: none;
  outline: none;
  background: none;
}
</style>
