<template>
  <div class="settings-container">
    <!-- Header Section -->
    <div class="settings-header">
      <div class="header-icon">
        <q-icon name="settings" size="28px" />
      </div>
      <div class="header-content">
        <h1 class="settings-title">Pengaturan Sistem</h1>
        <p class="settings-subtitle">Kelola konfigurasi sistem sesuai kebutuhan Anda</p>
      </div>
    </div>

    <!-- Main Settings Card -->
    <div class="settings-card">
      <div class="card-header">
        <q-icon name="tune" class="card-icon" />
        <span class="card-title">Konfigurasi Sistem</span>
      </div>

      <div class="card-content">
        <form @submit.prevent="submitSettings" class="settings-form">
          <!-- Working Hours -->
          <div class="form-group">
            <div class="form-row">
              <div class="input-icon">
                <q-icon name="schedule" />
              </div>
              <div class="input-wrapper">
                <label class="form-label">Jam Kerja</label>
                <q-input
                  v-model="jamKerja"
                  outlined
                  dense
                  placeholder="Contoh: 08:00 - 17:00"
                  class="custom-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="access_time" color="grey-6" />
                  </template>
                </q-input>
              </div>
            </div>
          </div>

          <!-- Email Notifications -->
          <div class="form-group">
            <div class="form-row">
              <div class="input-icon">
                <q-icon name="email" />
              </div>
              <div class="input-wrapper">
                <label class="form-label">Notifikasi Email</label>
                <q-select
                  v-model="notifikasi"
                  outlined
                  dense
                  :options="notifikasiOptions"
                  class="custom-select"
                >
                  <template v-slot:prepend>
                    <q-icon name="notifications" color="grey-6" />
                  </template>
                </q-select>
              </div>
            </div>
          </div>

          <!-- Leave Limit -->
          <div class="form-group">
            <div class="form-row">
              <div class="input-icon">
                <q-icon name="calendar_today" />
              </div>
              <div class="input-wrapper">
                <label class="form-label">Batas Maksimal Cuti / Tahun</label>
                <q-input
                  v-model.number="batasCuti"
                  outlined
                  dense
                  type="number"
                  min="0"
                  placeholder="Contoh: 12"
                  class="custom-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="event_available" color="grey-6" />
                  </template>
                  <template v-slot:append>
                    <span class="input-suffix">hari</span>
                  </template>
                </q-input>
              </div>
            </div>
          </div>

          <!-- Auto Logout -->
          <div class="form-group">
            <div class="form-row">
              <div class="input-icon">
                <q-icon name="timer" />
              </div>
              <div class="input-wrapper">
                <label class="form-label">Auto Logout (menit)</label>
                <q-input
                  v-model.number="autoLogout"
                  outlined
                  dense
                  type="number"
                  min="1"
                  placeholder="Contoh: 15"
                  class="custom-input"
                >
                  <template v-slot:prepend>
                    <q-icon name="logout" color="grey-6" />
                  </template>
                  <template v-slot:append>
                    <span class="input-suffix">menit</span>
                  </template>
                </q-input>
              </div>
            </div>
          </div>

          <!-- Maintenance Mode -->
          <div class="form-group">
            <div class="form-row">
              <div class="input-icon">
                <q-icon name="build" />
              </div>
              <div class="input-wrapper">
                <label class="form-label">Mode Maintenance</label>
                <q-select
                  v-model="maintenance"
                  outlined
                  dense
                  :options="maintenanceOptions"
                  class="custom-select"
                >
                  <template v-slot:prepend>
                    <q-icon name="construction" color="grey-6" />
                  </template>
                </q-select>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="form-actions">
            <q-btn
              type="submit"
              color="primary"
              size="md"
              class="action-btn save-btn"
              no-caps
              unelevated
            >
              <q-icon name="save" class="btn-icon" />
              Simpan Pengaturan
            </q-btn>
            
            <q-btn
              type="button"
              color="grey-7"
              size="md"
              class="action-btn reset-btn"
              no-caps
              outline
              @click="resetDefaults"
            >
              <q-icon name="refresh" class="btn-icon" />
              Reset Default
            </q-btn>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const jamKerja = ref("08:00 - 17:00")
const notifikasi = ref("aktif")
const batasCuti = ref(12)
const autoLogout = ref(15)
const maintenance = ref("nonaktif")

const notifikasiOptions = [
  { label: 'Aktif', value: 'aktif' },
  { label: 'Nonaktif', value: 'nonaktif' }
]

const maintenanceOptions = [
  { label: 'Nonaktif', value: 'nonaktif' },
  { label: 'Aktif', value: 'aktif' }
]

function submitSettings() {
  // Using Quasar's Notify instead of alert for better UX
  $q.notify({
    type: 'positive',
    message: 'Pengaturan berhasil disimpan!',
    caption: `Jam Kerja: ${jamKerja.value} | Notifikasi: ${notifikasi.value} | Batas Cuti: ${batasCuti.value} hari`,
    position: 'top-right',
    timeout: 3000
  })
}

function resetDefaults() {
  jamKerja.value = "08:00 - 17:00"
  notifikasi.value = "aktif"
  batasCuti.value = 12
  autoLogout.value = 15
  maintenance.value = "nonaktif"
  
  $q.notify({
    type: 'info',
    message: 'Pengaturan telah direset ke default',
    position: 'top-right',
    timeout: 2000
  })
}
</script>

<style lang="scss" scoped>
.settings-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%);
  min-height: 100vh;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;

  .header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    color: white;
    flex-shrink: 0;
  }

  .header-content {
    flex: 1;
  }

  .settings-title {
    font-size: 24px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
  }

  .settings-subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 0;
    font-weight: 400;
  }
}

.settings-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
  overflow: hidden;

  .card-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 12px;

    .card-icon {
      font-size: 20px;
      color: white;
    }

    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: white;
    }
  }

  .card-content {
    padding: 0;
  }
}

.settings-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 0;
  }
}

.form-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 6px;
  color: #667eea;
  flex-shrink: 0;
  margin-top: 28px;

  .q-icon {
    font-size: 18px;
  }
}

.input-wrapper {
  flex: 1;
  min-width: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.custom-input, .custom-select {
  width: 100%;

  :deep(.q-field__control) {
    border-radius: 8px;
    background: #ffffff;
    border: 1px solid #d1d5db;
    transition: all 0.2s ease;
    height: 42px;

    &:hover {
      border-color: #9ca3af;
    }
  }

  :deep(.q-field--focused .q-field__control) {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  :deep(.q-field__native) {
    font-size: 14px;
    font-weight: 400;
    color: #1f2937;
  }

  :deep(.q-field__prepend) {
    padding-right: 8px;
  }

  .input-suffix {
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
    padding-left: 8px;
  }
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;

  .action-btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s ease;
    height: 40px;

    .btn-icon {
      margin-right: 6px;
      font-size: 16px;
    }

    &.save-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      }
    }

    &.reset-btn {
      border: 1px solid #d1d5db;
      color: #6b7280;
      background: white;

      &:hover {
        border-color: #9ca3af;
        background: #f9fafb;
      }
    }
  }
}

// Responsive Design
@media (max-width: 768px) {
  .settings-container {
    padding: 16px;
  }

  .settings-header {
    padding: 20px;
  }

  .settings-form {
    padding: 20px;
  }

  .form-row {
    flex-direction: column;
    gap: 12px;
  }

  .input-icon {
    margin-top: 0;
    align-self: flex-start;
  }

  .form-actions {
    flex-direction: column;

    .action-btn {
      width: 100%;
      justify-content: center;
    }
  }
}

@media (max-width: 480px) {
  .settings-container {
    padding: 12px;
  }

  .settings-header {
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .settings-form {
    padding: 16px;
  }
}
</style>