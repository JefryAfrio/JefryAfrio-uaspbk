<template>
  <div class="profile-container">
    <div class="profile-header">
      <div class="header-content">
        <div class="profile-avatar">
          <q-avatar size="80px" class="admin-avatar">
            <q-icon name="person" size="40px" />
          </q-avatar>
          <div class="avatar-badge">
            <q-icon name="verified" size="16px" />
          </div>
        </div>
        <div class="profile-info">
          <h1 class="profile-title">Profil Administrator</h1>
          <p class="profile-subtitle">Kelola informasi akun admin sistem</p>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <q-card flat class="modern-card">
        <q-card-section class="card-header">
          <div class="section-title">
            <q-icon name="account_circle" class="title-icon" />
            <span>Informasi Pribadi</span>
          </div>
          <q-btn 
            flat 
            round 
            icon="edit" 
            size="sm" 
            class="edit-btn"
            @click="toggleEdit"
            :color="isEditing ? 'negative' : 'primary'"
          >
            <q-tooltip>{{ isEditing ? 'Batal Edit' : 'Edit Profil' }}</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-card-section class="form-section">
          <q-form @submit.prevent="simpanData" class="modern-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">
                  <q-icon name="person" class="label-icon" />
                  Nama Lengkap
                </label>
                <q-input
                  v-model="admin.nama"
                  outlined
                  dense
                  :readonly="!isEditing"
                  class="modern-input"
                  :rules="[val => !!val || 'Nama wajib diisi']"
                >
                  <template v-slot:prepend>
                    <q-icon name="badge" color="primary" />
                  </template>
                </q-input>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <q-icon name="email" class="label-icon" />
                  Alamat Email
                </label>
                <q-input
                  v-model="admin.email"
                  outlined
                  dense
                  type="email"
                  :readonly="!isEditing"
                  class="modern-input"
                  :rules="[val => !!val || 'Email wajib diisi']"
                >
                  <template v-slot:prepend>
                    <q-icon name="alternate_email" color="primary" />
                  </template>
                </q-input>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <q-icon name="account_box" class="label-icon" />
                  Username
                </label>
                <q-input
                  v-model="admin.username"
                  outlined
                  dense
                  :readonly="!isEditing"
                  class="modern-input"
                  :rules="[val => !!val || 'Username wajib diisi']"
                >
                  <template v-slot:prepend>
                    <q-icon name="alternate_email" color="primary" />
                  </template>
                </q-input>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <q-icon name="admin_panel_settings" class="label-icon" />
                  Role & Akses
                </label>
                <q-input
                  v-model="admin.role"
                  outlined
                  dense
                  :readonly="!isEditing"
                  class="modern-input"
                  :rules="[val => !!val || 'Role wajib diisi']"
                >
                  <template v-slot:prepend>
                    <q-icon name="security" color="primary" />
                  </template>
                  <template v-slot:append>
                    <q-chip 
                      size="sm" 
                      color="positive" 
                      text-color="white"
                      icon="verified_user"
                    >
                      Aktif
                    </q-chip>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="form-actions" v-if="isEditing">
              <q-btn 
                flat
                label="Batal" 
                color="grey-7"
                class="action-btn cancel-btn"
                @click="cancelEdit"
              />
              <q-btn 
                type="submit" 
                label="Simpan Perubahan"
                color="primary"
                icon="save"
                class="action-btn save-btn"
                :loading="isSaving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>

      <!-- Security Section -->
      <q-card flat class="modern-card security-card">
        <q-card-section class="card-header">
          <div class="section-title">
            <q-icon name="security" class="title-icon" />
            <span>Keamanan Akun</span>
          </div>
        </q-card-section>

        <q-card-section class="security-section">
          <div class="security-items">
            <div class="security-item">
              <div class="security-info">
                <q-icon name="key" class="security-icon" />
                <div>
                  <div class="security-title">Password</div>
                  <div class="security-desc">Terakhir diubah 30 hari yang lalu</div>
                </div>
              </div>
              <q-btn 
                flat 
                dense 
                label="Ubah" 
                color="primary"
                size="sm"
                class="security-action-btn"
              />
            </div>

            <div class="security-item">
              <div class="security-info">
                <q-icon name="login" class="security-icon" />
                <div>
                  <div class="security-title">Login Terakhir</div>
                  <div class="security-desc">Hari ini, 09:30 WIB</div>
                </div>
              </div>
              <q-chip size="sm" color="positive" text-color="white" class="status-chip">
                Aktif
              </q-chip>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const admin = ref({
  nama: '',
  email: '',
  username: '',
  role: ''
})

const isEditing = ref(false)
const isSaving = ref(false)
const originalData = ref({})

// Saat halaman dibuka, ambil dari localStorage
onMounted(() => {
  const saved = localStorage.getItem('adminData')
  if (saved) {
    admin.value = JSON.parse(saved)
  } else {
    admin.value = {
      nama: 'Ghina Rohadatul Aisy',
      email: 'admin@jeptrack.com',
      username: 'admin',
      role: 'Administrator'
    }
    localStorage.setItem('adminData', JSON.stringify(admin.value))
  }
  originalData.value = { ...admin.value }
})

function toggleEdit() {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    admin.value = { ...originalData.value }
  }
}

function cancelEdit() {
  admin.value = { ...originalData.value }
  isEditing.value = false
}

// Simpan data ke localStorage
async function simpanData() {
  isSaving.value = true
  
  // Simulasi loading
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  localStorage.setItem('adminData', JSON.stringify(admin.value))
  originalData.value = { ...admin.value }
  isEditing.value = false
  isSaving.value = false
  
  $q.notify({
    type: 'positive',
    message: 'Profil berhasil disimpan!',
    icon: 'check_circle',
    position: 'top'
  })
}
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 24px;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(102,126,234,0.06)"/></svg>');
    background-size: 60px 60px;
    animation: float 30s infinite linear;
    pointer-events: none;
  }
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  100% { transform: translateY(-100vh) rotate(360deg); }
}

.profile-header {
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(25px);
    border-radius: 28px;
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.08),
      0 10px 30px rgba(102, 126, 234, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.3);
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, 
        #667eea 0%, 
        #764ba2 25%, 
        #f093fb 50%, 
        #f5576c 75%, 
        #4facfe 100%
      );
      animation: gradient-shift 8s ease-in-out infinite;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: -100%;
      left: -100%;
      width: 300%;
      height: 300%;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%);
      animation: float-gentle 6s ease-in-out infinite;
      pointer-events: none;
    }
  }
  
  .profile-avatar {
    position: relative;
    transform: scale(1);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
    
    .admin-avatar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      color: white;
      border: 5px solid rgba(255, 255, 255, 0.9);
      box-shadow: 
        0 15px 40px rgba(102, 126, 234, 0.3),
        0 8px 20px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
      
      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, 
          transparent, 
          rgba(255, 255, 255, 0.4), 
          transparent
        );
        animation: shimmer 4s infinite;
      }
      
      &:hover {
        box-shadow: 
          0 20px 50px rgba(102, 126, 234, 0.4),
          0 10px 25px rgba(0, 0, 0, 0.15);
      }
    }
    
    .avatar-badge {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      border: 3px solid rgba(255, 255, 255, 0.95);
      box-shadow: 
        0 6px 15px rgba(16, 185, 129, 0.4),
        0 3px 8px rgba(0, 0, 0, 0.1);
      animation: pulse-badge 3s infinite;
      
      .q-icon {
        font-size: 18px;
      }
    }
  }
  
  .profile-info {
    flex: 1;
    
    .profile-title {
      margin: 0 0 8px 0;
      font-size: 36px;
      font-weight: 900;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      letter-spacing: -0.5px;
      line-height: 1.2;
    }
    
    .profile-subtitle {
      margin: 0;
      color: #64748b;
      font-size: 17px;
      font-weight: 500;
      opacity: 0.8;
      letter-spacing: 0.3px;
    }
  }
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes shimmer {
  0% { transform: translateX(-150%) translateY(-150%) rotate(45deg); }
  100% { transform: translateX(150%) translateY(150%) rotate(45deg); }
}

@keyframes pulse-badge {
  0%, 100% { transform: scale(1); box-shadow: 0 6px 15px rgba(16, 185, 129, 0.4); }
  50% { transform: scale(1.1); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.6); }
}

@keyframes float-gentle {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: relative;
  z-index: 1;
}

.modern-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.08),
    0 8px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 30px 60px rgba(0, 0, 0, 0.12),
      0 15px 30px rgba(102, 126, 234, 0.08);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(102, 126, 234, 0.02) 0%, 
      rgba(118, 75, 162, 0.02) 100%
    );
    pointer-events: none;
  }
  
  .card-header {
    background: rgba(248, 250, 252, 0.95);
    backdrop-filter: blur(15px);
    border-bottom: 1px solid rgba(226, 232, 240, 0.3);
    padding: 24px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, 
        #667eea 0%, 
        #764ba2 50%, 
        #f093fb 100%
      );
      opacity: 0.4;
    }
    
    .section-title {
      display: flex;
      align-items: center;
      gap: 15px;
      font-size: 19px;
      font-weight: 700;
      color: #334155;
      
      .title-icon {
        color: white;
        font-size: 26px;
        padding: 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 14px;
        box-shadow: 0 6px 15px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        
        &:hover {
          transform: rotate(10deg) scale(1.05);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
      }
    }
    
    .edit-btn {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      color: #667eea;
      border-radius: 14px;
      padding: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
      }
    }
  }
  
  .form-section {
    padding: 36px 28px;
    background: transparent;
  }
}

.modern-form {
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 32px;
    margin-bottom: 36px;
  }
  
  .form-group {
    .form-label {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 14px;
      font-weight: 600;
      color: #475569;
      font-size: 15px;
      
      .label-icon {
        color: #667eea;
        font-size: 18px;
      }
    }
    
    .modern-input {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      :deep(.q-field__control) {
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.8);
        border: 2px solid rgba(226, 232, 240, 0.4);
        backdrop-filter: blur(10px);
        transition: all 0.3s ease;
        
        &:hover {
          border-color: rgba(102, 126, 234, 0.4);
          background: rgba(255, 255, 255, 0.95);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
        }
        
        &.q-field--focused {
          border-color: #667eea;
          background: rgba(255, 255, 255, 1);
          box-shadow: 0 0 0 5px rgba(102, 126, 234, 0.12);
          transform: translateY(-3px);
        }
      }
      
      :deep(.q-field__native) {
        color: #334155;
        font-weight: 500;
        font-size: 15px;
      }
      
      :deep(.q-field--readonly .q-field__control) {
        background: rgba(248, 250, 252, 0.9);
        border-color: rgba(226, 232, 240, 0.4);
        opacity: 0.85;
      }
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 18px;
    padding-top: 36px;
    border-top: 1px solid rgba(226, 232, 240, 0.3);
    
    .action-btn {
      padding: 14px 32px;
      border-radius: 18px;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &.cancel-btn {
        background: rgba(248, 250, 252, 0.9);
        color: #64748b;
        border: 1px solid rgba(226, 232, 240, 0.5);
        
        &:hover {
          background: rgba(241, 245, 249, 0.95);
          color: #475569;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }
      }
      
      &.save-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 6px 15px rgba(102, 126, 234, 0.3);
        
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        
        &:active {
          transform: translateY(-1px);
        }
      }
    }
  }
}

.security-card {
  .security-section {
    padding: 28px;
    background: transparent;
  }
  
  .security-items {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .security-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 28px;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(15px);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(102, 126, 234, 0.2);
      transform: translateY(-4px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
    }
    
    .security-info {
      display: flex;
      align-items: center;
      gap: 18px;
      
      .security-icon {
        color: white;
        font-size: 26px;
        padding: 14px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 16px;
        box-shadow: 0 6px 15px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
        
        &:hover {
          transform: rotate(5deg) scale(1.05);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
      }
      
      .security-title {
        font-weight: 600;
        color: #334155;
        margin-bottom: 5px;
        font-size: 17px;
      }
      
      .security-desc {
        color: #64748b;
        font-size: 14px;
        opacity: 0.8;
      }
    }
    
    .security-action-btn {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      color: #667eea;
      border-radius: 12px;
      padding: 8px 16px;
      font-weight: 600;
      transition: all 0.3s ease;
      
      &:hover {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(102, 126, 234, 0.2);
      }
    }
    
    .status-chip {
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(16, 185, 129, 0.4);
      }
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .profile-container {
    padding: 16px;
  }
  
  .profile-header .header-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
    padding: 32px 24px;
  }
  
  .modern-form .form-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .form-actions {
    flex-direction: column;
    
    .action-btn {
      width: 100%;
      justify-content: center;
    }
  }
  
  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
    
    .security-info {
      width: 100%;
    }
  }
}

// Enhanced animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-card {
  animation: fadeInUp 0.8s ease-out;
}

.modern-card:nth-child(2) {
  animation-delay: 0.15s;
}

.modern-card:nth-child(3) {
  animation-delay: 0.3s;
}

// Improved focus states
:deep(.q-field--focused .q-field__control) {
  box-shadow: 0 0 0 5px rgba(102, 126, 234, 0.12) !important;
}

// Custom scrollbar
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(248, 250, 252, 0.5);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 5px;
  transition: all 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}
</style>