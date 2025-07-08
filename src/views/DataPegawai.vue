<template>
  <q-page class="pegawai-page">
    <!-- Menampilkan pesan peringatan atau notifikasi penting -->
    <div v-if="message.text" class="alert-container">
      <div :class="`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`">
        <div class="alert-content">
          <q-icon 
            :name="message.type === 'success' ? 'check_circle' : 'error'" 
            class="alert-icon"
          />
          <span class="alert-text">{{ message.text }}</span>
        </div>
        <q-btn 
          flat 
          dense 
          icon="close" 
          class="alert-close"
          @click="message.text = ''"
        />
      </div>
    </div>

    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <q-icon name="people" class="header-icon" />
          <div>
            <h1 class="page-title">Data Pegawai</h1>
            <p class="page-subtitle">Kelola informasi pegawai Infinity Cinema</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-value">{{ filteredPegawai.length }}</div>
            <div class="stat-label">Total Pegawai</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mengatur kontrol dan fitur utama -->
    <div class="control-panel">
      <div class="control-content">
        <div class="filter-section">
          <div class="filter-group">
            <label class="filter-label">Filter Jabatan</label>
            <q-select
              v-model="selectedJabatan"
              :options="jabatanOptions"
              dense
              outlined
              class="filter-select"
              emit-value
              map-options
            >
              <template v-slot:prepend>
                <q-icon name="filter_list" />
              </template>
            </q-select>
          </div>
        </div>
        
        <div class="action-section">
          <q-btn
            class="primary-btn"
            label="Tambah Pegawai"
            icon="person_add"
            @click="tambahPegawai"
            no-caps
          />
        </div>
      </div>
    </div>

    <!-- Menampilkan data dalam bentuk tabel -->
    <div class="table-container">
      <div class="table-header">
        <h3 class="table-title">Daftar Pegawai</h3>
        <div class="table-info">
          <q-icon name="info" />
          <span>{{ filteredPegawai.length }} data ditemukan</span>
        </div>
      </div>
      
      <q-table
        :rows="filteredPegawai"
        :columns="columns"
        row-key="id"
        flat
        class="modern-table"
        :rows-per-page-options="[10, 25, 50]"
        rows-per-page-label="Baris per halaman:"
        no-data-label="Tidak ada data pegawai"
        loading-label="Memuat data..."
      >
        <template v-slot:body-cell-status="props">
          <q-td align="center">
            <div :class="`status-badge status-${props.value.toLowerCase()}`">
              <q-icon 
                :name="getStatusIcon(props.value)" 
                class="status-icon"
              />
              <span>{{ props.value }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-action="props">
          <q-td align="center">
            <div class="action-buttons">
              <q-btn
                dense
                icon="edit"
                size="sm"
                class="action-btn edit-btn"
                @click="editPegawai(props.row)"
                flat
                round
              >
                <q-tooltip>Edit Pegawai</q-tooltip>
              </q-btn>
              <q-btn
                dense
                icon="delete"
                size="sm"
                class="action-btn delete-btn"
                @click="hapusPegawai(props.row.id)"
                flat
                round
              >
                <q-tooltip>Hapus Pegawai</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-jabatan="props">
          <q-td align="left">
            <div :class="`role-badge role-${props.value.toLowerCase().replace(/\s+/g, '-')}`">
              <q-icon 
                :name="getRoleIcon(props.value)" 
                class="role-icon"
              />
              <span>{{ props.value }}</span>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Menambahkan dan mengedit data lewat dialog form -->
    <q-dialog v-model="dialogForm" persistent>
      <q-card class="form-dialog">
        <div class="dialog-header">
          <div class="dialog-title">
            <q-icon 
              :name="isEdit ? 'edit' : 'person_add'" 
              class="dialog-icon"
            />
            <h3>{{ isEdit ? "Edit Pegawai" : "Tambah Pegawai" }}</h3>
          </div>
          <q-btn 
            flat 
            dense 
            icon="close" 
            class="dialog-close"
            v-close-popup
          />
        </div>

        <div class="dialog-content">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Nama Lengkap</label>
              <q-input
                v-model="form.nama"
                outlined
                dense
                class="form-input"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-input>
            </div>

            <div class="form-group">
              <label class="form-label">Jabatan</label>
              <q-select
                v-model="form.jabatan"
                :options="jabatanDropdown"
                outlined
                dense
                class="form-input"
              >
                <template v-slot:prepend>
                  <q-icon name="work" />
                </template>
              </q-select>
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <q-input
                v-model="form.email"
                type="email"
                outlined
                dense
                class="form-input"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>
            </div>

            <div class="form-group">
              <label class="form-label">No. Telepon</label>
              <q-input
                v-model="form.no_telp"
                outlined
                dense
                class="form-input"
              >
                <template v-slot:prepend>
                  <q-icon name="phone" />
                </template>
              </q-input>
            </div>

            <div class="form-group full-width">
              <label class="form-label">Status</label>
              <q-select
                v-model="form.status"
                :options="statusOptions"
                outlined
                dense
                class="form-input"
              >
                <template v-slot:prepend>
                  <q-icon name="flag" />
                </template>
              </q-select>
            </div>
          </div>
        </div>

        <div class="dialog-actions">
          <q-btn 
            flat 
            label="Batal" 
            class="cancel-btn"
            v-close-popup 
          />
          <q-btn
            :label="isEdit ? 'Update Data' : 'Simpan Data'"
            class="save-btn"
            @click="simpanPegawai"
            no-caps
          />
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePegawaiStore } from '../stores/pegawai'

const pegawaiStore = usePegawaiStore()

const selectedJabatan = ref('all')
const dialogForm = ref(false)
const isEdit = ref(false)
const editingId = ref(null)
const message = ref({ text: '', type: '' })

const form = ref({
  nama: '',
  jabatan: '',
  email: '',
  no_telp: '',
  status: '',
})

const jabatanOptions = [
  { label: 'Semua Jabatan', value: 'all' },
  { label: 'Cinema Manager', value: 'Cinema Manager' },
  { label: 'Manager', value: 'Manager' },
  { label: 'Daily Worker', value: 'Daily Worker' },
  { label: 'Cleaning Staff', value: 'Cleaning Staff' },
]

const jabatanDropdown = [
  'Cinema Manager',
  'Manager',
  'Daily Worker',
  'Cleaning Staff',
]

const statusOptions = ['Aktif', 'Cuti', 'Resign']

const columns = [
  { 
    name: 'nama', 
    label: 'Nama', 
    align: 'left', 
    field: 'nama',
    sortable: true
  },
  { 
    name: 'jabatan', 
    label: 'Jabatan', 
    align: 'left', 
    field: 'jabatan',
    sortable: true
  },
  { 
    name: 'email', 
    label: 'Email', 
    align: 'left', 
    field: 'email'
  },
  { 
    name: 'no_telp', 
    label: 'No. Telepon', 
    align: 'left', 
    field: 'no_telp'
  },
  { 
    name: 'status', 
    label: 'Status', 
    align: 'center', 
    field: 'status',
    sortable: true
  },
  { 
    name: 'action', 
    label: 'Aksi', 
    align: 'center'
  },
]

// Computed
const filteredPegawai = computed(() => {
  if (selectedJabatan.value === 'all') return pegawaiStore.daftarPegawai
  return pegawaiStore.daftarPegawai.filter(
    (p) => p.jabatan === selectedJabatan.value
  )
})

// Methods
function getStatusIcon(status) {
  const icons = {
    'Aktif': 'check_circle',
    'Cuti': 'schedule',
    'Resign': 'cancel'
  }
  return icons[status] || 'help'
}

function getRoleIcon(role) {
  const icons = {
    'Cinema Manager': 'local_movies',
    'Manager': 'business_center',
    'Daily Worker': 'work',
    'Cleaning Staff': 'cleaning_services'
  }
  return icons[role] || 'work'
}

onMounted(() => {
  pegawaiStore.fetchPegawai()
})

function setMessage(text, type) {
  message.value = { text, type }
  setTimeout(() => {
    message.value.text = ''
  }, 5000)
}

function tambahPegawai() {
  isEdit.value = false
  editingId.value = null
  form.value = {
    nama: '',
    jabatan: '',
    email: '',
    no_telp: '',
    status: '',
  }
  dialogForm.value = true
}

function editPegawai(data) {
  isEdit.value = true
  editingId.value = data.id
  form.value = {
    nama: data.nama,
    jabatan: data.jabatan,
    email: data.email,
    no_telp: data.no_telp,
    status: data.status,
  }
  dialogForm.value = true
}

const API_URL = 'http://localhost:3002/pegawai'

function simpanPegawai() {
  if (isEdit.value) {
    const updatedData = { id: editingId.value, ...form.value }
    fetch(`${API_URL}/${editingId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then(() => {
        pegawaiStore.fetchPegawai()
        dialogForm.value = false
        setMessage('Data pegawai berhasil diperbarui!', 'success')
      })
      .catch((err) => {
        console.error('Gagal update pegawai:', err.message)
        setMessage('Gagal memperbarui data pegawai', 'error')
      })
  } else {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text())
        return res.json()
      })
      .then(() => {
        pegawaiStore.fetchPegawai()
        dialogForm.value = false
        setMessage('Data pegawai berhasil ditambahkan!', 'success')
      })
      .catch((err) => {
        console.error('Gagal tambah pegawai:', err.message)
        setMessage('Gagal menambahkan data pegawai', 'error')
      })
  }
}

function hapusPegawai(id) {
  if (!confirm('Apakah Anda yakin ingin menghapus data pegawai ini?')) return

  fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      pegawaiStore.fetchPegawai()
      setMessage('Data pegawai berhasil dihapus!', 'success')
    })
    .catch((err) => {
      console.error('Gagal hapus pegawai:', err)
      setMessage('Gagal menghapus data pegawai', 'error')
    })
}
</script>

<style scoped lang="scss">
// Variables
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
$error-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
$card-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
$card-shadow-hover: 0 20px 40px rgba(0, 0, 0, 0.15);
$border-radius: 16px;
$transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

.pegawai-page {
  background: linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%);
  min-height: 100vh;
  padding: 2rem;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    opacity: 0.05;
    z-index: 0;
  }
}

// Notifikasi (Alert)
.alert-container {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
  animation: slideInRight 0.3s ease-out;
}

.alert {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: $border-radius;
  padding: 1rem 1.5rem;
  box-shadow: $card-shadow;
  min-width: 300px;
  max-width: 400px;

  &.alert-success {
    border-left: 4px solid #27ae60;
    
    .alert-icon {
      color: #27ae60;
    }
  }

  &.alert-error {
    border-left: 4px solid #e74c3c;
    
    .alert-icon {
      color: #e74c3c;
    }
  }

  .alert-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .alert-icon {
    font-size: 1.2rem;
  }

  .alert-text {
    flex: 1;
    font-weight: 500;
    color: #2c3e50;
  }

  .alert-close {
    color: #7f8c8d;
    
    &:hover {
      color: #2c3e50;
    }
  }
}

// Header Halaman 
.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: $border-radius;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: $card-shadow;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: $primary-gradient;
    opacity: 0.05;
    transform: rotate(45deg);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    z-index: 2;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .header-icon {
    width: 60px;
    height: 60px;
    background: $primary-gradient;
    color: white;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .page-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    letter-spacing: -0.5px;
  }

  .page-subtitle {
    color: #7f8c8d;
    font-size: 1rem;
    margin: 0.25rem 0 0 0;
  }

  .header-stats {
    text-align: right;
  }

  .stat-item {
    background: rgba(255, 255, 255, 0.8);
    padding: 1rem 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: #2c3e50;
    line-height: 1;
  }

  .stat-label {
    color: #7f8c8d;
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: 0.25rem;
  }
}

// Panel Kontrol
.control-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: $border-radius;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: $card-shadow;

  .control-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 2rem;
  }

  .filter-section {
    flex: 1;
  }

  .filter-group {
    max-width: 300px;
  }

  .filter-label {
    display: block;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }

  .filter-select {
    .q-field__control {
      border-radius: 12px;
    }
  }

  .primary-btn {
    background: $primary-gradient;
    color: white;
    border-radius: 12px;
    padding: 0.75rem 2rem;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    transition: $transition;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
  }
}

// Container Tabel
.table-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: $card-shadow;

  .table-header {
    background: $primary-gradient;
    color: white;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .table-title {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0;
  }

  .table-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    opacity: 0.9;
    font-size: 0.9rem;
  }
}

// Tabel Modern 
.modern-table {
  .q-table__top {
    display: none;
  }

  .q-table__middle {
    border-radius: 0;
  }

  .q-table thead th {
    background: #f8f9fa;
    color: #2c3e50;
    font-weight: 600;
    padding: 1rem;
    border: none;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .q-table tbody td {
    padding: 1rem;
    border-bottom: 1px solid #f1f3f4;
    color: #2c3e50;
    vertical-align: middle;
  }

  .q-table tbody tr {
    transition: $transition;

    &:hover {
      background: rgba(102, 126, 234, 0.05);
    }
  }
}

// Badge Status
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.status-aktif {
    background: rgba(39, 174, 96, 0.15);
    color: #27ae60;
    border: 1px solid rgba(39, 174, 96, 0.3);
  }

  &.status-cuti {
    background: rgba(241, 196, 15, 0.15);
    color: #f1c40f;
    border: 1px solid rgba(241, 196, 15, 0.3);
  }

  &.status-resign {
    background: rgba(231, 76, 60, 0.15);
    color: #e74c3c;
    border: 1px solid rgba(231, 76, 60, 0.3);
  }

  .status-icon {
    font-size: 1rem;
  }
}

// Badge Peran
.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.2);

  .role-icon {
    font-size: 1rem;
  }

  &.role-cinema-manager {
    background: rgba(142, 68, 173, 0.1);
    color: #8e44ad;
    border-color: rgba(142, 68, 173, 0.2);
  }

  &.role-manager {
    background: rgba(39, 174, 96, 0.1);
    color: #27ae60;
    border-color: rgba(39, 174, 96, 0.2);
  }

  &.role-daily-worker {
    background: rgba(230, 126, 34, 0.1);
    color: #e67e22;
    border-color: rgba(230, 126, 34, 0.2);
  }

  &.role-cleaning-staff {
    background: rgba(52, 152, 219, 0.1);
    color: #3498db;
    border-color: rgba(52, 152, 219, 0.2);
  }
}

// Tombol Aksi
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  transition: $transition;

  &.edit-btn {
    background: rgba(52, 152, 219, 0.1);
    color: #3498db;

    &:hover {
      background: rgba(52, 152, 219, 0.2);
      transform: scale(1.1);
    }
  }

  &.delete-btn {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;

    &:hover {
      background: rgba(231, 76, 60, 0.2);
      transform: scale(1.1);
    }
  }
}

// Gaya Dialog
.form-dialog {
  min-width: 600px;
  max-width: 90vw;
  border-radius: $border-radius;
  overflow: hidden;

  .dialog-header {
    background: $primary-gradient;
    color: white;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dialog-title {
    display: flex;
    align-items: center;
    gap: 1rem;

    h3 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 600;
    }
  }

  .dialog-icon {
    font-size: 1.5rem;
  }

  .dialog-close {
    color: rgba(255, 255, 255, 0.8);

    &:hover {
      color: white;
    }
  }

  .dialog-content {
    padding: 2rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &.full-width {
      grid-column: 1 / -1;
    }
  }

  .form-label {
    font-weight: 600;
    color: #2c3e50;
    font-size: 0.9rem;
  }

  .form-input {
    .q-field__control {
      border-radius: 12px;
    }
  }

  .dialog-actions {
    padding: 1.5rem;
    background: #f8f9fa;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  .cancel-btn {
    color: #7f8c8d;
    font-weight: 500;

    &:hover {
      background: rgba(127, 140, 141, 0.1);
    }
  }

  .save-btn {
    background: $success-gradient;
    color: white;
    border-radius: 12px;
    padding: 0.75rem 2rem;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(79, 172, 254, 0.4);
    }
  }
}

// Animasi
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>