<template>
  <div class="sidebar" v-if="isLoggedIn">
    <div class="sidebar-header">
      <div class="logo-container">
        <img src="@/assets/logo1.png" alt="Logo" class="logo" />
        <div class="logo-pulse"></div>
      </div>
      <div class="brand-container">
        <span class="brand-name">JepTrack</span>
        <span class="brand-subtitle">Admin Dashboard</span>
      </div>
    </div>

    <div class="admin-info">
      <div class="admin-avatar">
        <q-icon name="admin_panel_settings" />
      </div>
      <div class="admin-details">
        <div class="admin-name">Administrator</div>
        <div class="admin-role">System Manager</div>
      </div>
    </div>

    <div class="sidebar-menu">
      <div class="menu-section">
        <div class="section-title">Main Menu</div>
        <q-item
          clickable
          v-for="item in mainMenu"
          :key="item.label"
          :to="item.to"
          active-class="active"
          class="menu-item"
        >
          <q-item-section avatar class="menu-icon-section">
            <div class="icon-wrapper">
              <q-icon :name="item.icon" />
              <div class="icon-bg"></div>
            </div>
          </q-item-section>
          <q-item-section class="menu-text-section">
            <div class="menu-text">{{ item.label }}</div>
            <div class="menu-indicator"></div>
          </q-item-section>
        </q-item>
      </div>

      <div class="menu-section">
        <div class="section-title">Management</div>
        <q-item
          clickable
          v-for="item in managementMenu"
          :key="item.label"
          :to="item.to"
          active-class="active"
          class="menu-item"
        >
          <q-item-section avatar class="menu-icon-section">
            <div class="icon-wrapper">
              <q-icon :name="item.icon" />
              <div class="icon-bg"></div>
            </div>
          </q-item-section>
          <q-item-section class="menu-text-section">
            <div class="menu-text">{{ item.label }}</div>
            <div class="menu-indicator"></div>
          </q-item-section>
        </q-item>
      </div>

      <div class="menu-section">
        <div class="section-title">System</div>
        <q-item
          clickable
          v-for="item in systemMenu"
          :key="item.label"
          :to="item.to"
          active-class="active"
          class="menu-item"
        >
          <q-item-section avatar class="menu-icon-section">
            <div class="icon-wrapper">
              <q-icon :name="item.icon" />
              <div class="icon-bg"></div>
            </div>
          </q-item-section>
          <q-item-section class="menu-text-section">
            <div class="menu-text">{{ item.label }}</div>
            <div class="menu-indicator"></div>
          </q-item-section>
        </q-item>
      </div>
    </div>

    <div class="logout-wrapper">
      <div class="logout-divider"></div>
      <q-item clickable @click="logout" class="menu-item logout-item">
        <q-item-section avatar class="menu-icon-section">
          <div class="icon-wrapper">
            <q-icon name="logout" />
            <div class="icon-bg"></div>
          </div>
        </q-item-section>
        <q-item-section class="menu-text-section">
          <div class="menu-text">Logout</div>
          <div class="menu-indicator"></div>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const isLoggedIn = ref(false)

onMounted(() => {
  isLoggedIn.value = localStorage.getItem('loggedIn') === 'true'
})

const logout = () => {
  localStorage.removeItem('loggedIn')
  router.push('/login')
}

const mainMenu = [
  { label: "Dashboard", icon: "dashboard", to: "/dashboard" },
  { label: "Pegawai", icon: "groups", to: "/pegawai" },
  
]

const managementMenu = [
  { label: "Presensi", icon: "schedule", to: "/presensi" },
  { label: "Manajemen Cuti", icon: "event_available", to: "/manajemencuti" },
  { label: "Laporan", icon: "analytics", to: "/laporan" },
  
]

const systemMenu = [
  { label: "Profil", icon: "person", to: "/profil" },
  { label: "Pengaturan", icon: "settings", to: "/pengaturan" },
]
</script>

<style scoped lang="scss">
.sidebar {
  background: linear-gradient(160deg, #1e293b 0%, #334155 50%, #475569 100%);
  width: 100%;
  max-width: 280px;
  height: 100vh;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  color: #f8fafc;
  box-shadow: 
    12px 0 40px rgba(0, 0, 0, 0.12),
    6px 0 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(ellipse at top left, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
      radial-gradient(ellipse at bottom right, rgba(139, 92, 246, 0.03) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.5);
  }
}

.sidebar-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.04);
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}

.logo-container {
  position: relative;
  margin-right: 16px;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 8px;
  box-shadow: 
    0 4px 16px rgba(99, 102, 241, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 
      0 6px 24px rgba(99, 102, 241, 0.3),
      0 3px 12px rgba(0, 0, 0, 0.15);
  }
}

.logo-pulse {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 16px;
  background: linear-gradient(45deg, #6366f1, #8b5cf6);
  opacity: 0;
  animation: pulse 3s ease-in-out infinite;
  z-index: 1;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.2;
    transform: scale(1.05);
  }
}

.brand-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-name {
  font-weight: 800;
  font-size: 1.5rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.7rem;
  color: rgba(248, 250, 252, 0.6);
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.admin-info {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1.5rem;
  background: rgba(99, 102, 241, 0.08);
  border-radius: 14px;
  border: 1px solid rgba(99, 102, 241, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.12);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);
  }
}

.admin-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  
  .q-icon {
    font-size: 18px;
    color: white;
  }
}

.admin-details {
  flex: 1;
}

.admin-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #f8fafc;
  margin-bottom: 2px;
}

.admin-role {
  font-size: 0.75rem;
  color: rgba(248, 250, 252, 0.6);
  font-weight: 500;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  padding-bottom: 1rem;
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(248, 250, 252, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 0 12px 8px 12px;
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(248, 250, 252, 0.08);
}

.menu-item {
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 0.9rem;
  color: rgba(248, 250, 252, 0.85);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 500;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 1px solid transparent;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateX(4px);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    
    &::before {
      left: 100%;
    }
    
    .icon-wrapper {
      .icon-bg {
        transform: scale(1);
        opacity: 0.15;
      }
      
      .q-icon {
        transform: scale(1.05);
        color: #a5b4fc;
      }
    }
    
    .menu-indicator {
      width: 12px;
      opacity: 0.6;
    }
  }
}

.menu-icon-section {
  min-width: auto;
  margin-right: 8px;
}

.icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  
  .q-icon {
    font-size: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 2;
    color: rgba(248, 250, 252, 0.8);
  }
  
  .icon-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border-radius: 10px;
    transform: scale(0);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
  }
}

.menu-text-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu-text {
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.menu-indicator {
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
}

.menu-item.active {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.12));
  border-color: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  transform: translateX(6px) scale(1.01);
  box-shadow: 
    0 6px 20px rgba(99, 102, 241, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    background: linear-gradient(180deg, #6366f1, #8b5cf6);
    border-radius: 0 2px 2px 0;
    box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
  }
  
  .icon-wrapper {
    .icon-bg {
      transform: scale(1);
      opacity: 0.2;
    }
    
    .q-icon {
      color: #a5b4fc;
      font-size: 16px;
      transform: scale(1.05);
    }
  }
  
  .menu-indicator {
    width: 14px;
    opacity: 1;
  }
}

.logout-wrapper {
  margin-top: auto;
  padding-top: 1rem;
}

.logout-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(248, 250, 252, 0.1), transparent);
  margin-bottom: 1rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    background: rgba(248, 250, 252, 0.15);
    border-radius: 50%;
  }
}

.logout-item {
  color: #f1f5f9;
  border: 1px solid rgba(248, 113, 113, 0.15);
  background: rgba(239, 68, 68, 0.03);
  
  &:hover {
    background: rgba(239, 68, 68, 0.08);
    border-color: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    box-shadow: 
      0 8px 32px rgba(239, 68, 68, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .icon-wrapper {
    .q-icon {
      color: #f1f5f9;
      
      &:hover {
        color: #fca5a5;
      }
    }
    
    .icon-bg {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }
  }
  
  .menu-indicator {
    background: linear-gradient(90deg, #ef4444, #dc2626);
  }
}

// Responsive design
@media (max-width: 768px) {
  .sidebar {
    max-width: 280px;
    padding: 1.5rem;
  }
  
  .sidebar-header {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .logo {
    width: 48px;
    height: 48px;
  }
  
  .brand-name {
    font-size: 1.6rem;
  }
  
  .menu-item {
    padding: 12px 14px;
  }
  
  .admin-info {
    padding: 1rem;
  }
}

// Dark mode enhancements
@media (prefers-color-scheme: dark) {
  .sidebar {
    box-shadow: 
      12px 0 40px rgba(0, 0, 0, 0.25),
      6px 0 20px rgba(0, 0, 0, 0.15);
  }
}
</style>