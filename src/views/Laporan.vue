<template>
  <q-page class="modern-report-page">
    <!-- Bagian Header dengan Statistik -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <div class="page-icon">
            <q-icon name="assessment" size="32px" color="primary" />
          </div>
          <div>
            <h1 class="page-title">Laporan Pegawai</h1>
            <p class="page-subtitle">Ringkasan kehadiran dan status pegawai</p>
          </div>
        </div>
        
        <div class="stats-cards">
          <div class="stat-card primary">
            <div class="stat-icon">
              <q-icon name="people" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ laporan.length }}</div>
              <div class="stat-label">Total Pegawai</div>
            </div>
            <div class="stat-decoration"></div>
          </div>
          
          <div class="stat-card success">
            <div class="stat-icon">
              <q-icon name="check_circle" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ activeEmployees }}</div>
              <div class="stat-label">Pegawai Aktif</div>
            </div>
            <div class="stat-decoration"></div>
          </div>
          
          <div class="stat-card warning">
            <div class="stat-icon">
              <q-icon name="schedule" size="24px" />
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ totalCuti }}</div>
              <div class="stat-label">Total Cuti</div>
            </div>
            <div class="stat-decoration"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabel Data Utama -->
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">
          <q-icon name="table_view" size="20px" class="q-mr-sm" />
          Data Pegawai
        </div>
        <div class="table-actions">
          <q-btn 
            flat 
            round 
            icon="refresh" 
            size="sm" 
            class="action-btn"
            @click="refreshData"
          >
            <q-tooltip>Refresh Data</q-tooltip>
          </q-btn>
          <q-btn 
            flat 
            round 
            icon="download" 
            size="sm" 
            class="action-btn"
          >
            <q-tooltip>Export Data</q-tooltip>
          </q-btn>
        </div>
      </div>
    
      <q-table
        :rows="laporan"
        :columns="columns"
        row-key="nama"
        flat
        class="modern-table"
        :pagination="{ rowsPerPage: 10 }"
        :loading="loading"
      >
        <template v-slot:body-cell-nama="props">
          <q-td :props="props" class="name-cell">
            <div class="employee-info">
              <q-avatar size="36px" class="employee-avatar">
                <q-icon name="person" size="18px" />
              </q-avatar>
              <div class="employee-details">
                <div class="employee-name">{{ props.value }}</div>
                <div class="employee-id">ID: {{ props.rowIndex + 1 }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-jabatan="props">
          <q-td :props="props">
            <q-chip 
              :label="props.value" 
              :color="getJabatanColor(props.value)"
              text-color="white"
              dense
              class="jabatan-chip"
              icon="work"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-hadir="props">
          <q-td :props="props" class="text-center">
            <div class="attendance-badge success">
              <q-icon name="check" size="14px" class="q-mr-xs" />
              <span class="badge-text">{{ props.value }}</span>
              <div class="badge-glow"></div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-cuti="props">
          <q-td :props="props" class="text-center">
            <div class="attendance-badge warning">
              <q-icon name="schedule" size="14px" class="q-mr-xs" />
              <span class="badge-text">{{ props.value }}</span>
              <div class="badge-glow"></div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-keterlambatan="props">
          <q-td :props="props" class="text-center">
            <div
              :class="[
                'late-badge',
                props.value === 0 ? 'no-late' : props.value < 3 ? 'few-late' : 'many-late'
              ]"
            >
              <q-icon name="schedule" size="14px" class="q-mr-xs" />
              <span class="badge-text">{{ props.value }}</span>
              <div class="badge-glow"></div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props" class="text-center">
            <q-chip 
              :label="props.value" 
              :color="props.value === 'Aktif' ? 'positive' : 'negative'"
              text-color="white"
              dense
              class="status-chip"
            >
              <q-icon 
                :name="props.value === 'Aktif' ? 'check_circle' : 'cancel'" 
                size="14px" 
                class="q-ml-xs"
              />
            </q-chip>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="no-data-state">
            <div class="no-data-icon">
              <q-icon name="inbox" size="48px" color="grey-5" />
            </div>
            <div class="text-h6 q-mt-md text-grey-6">Tidak ada data</div>
            <div class="text-body2 text-grey-5">Data pegawai belum tersedia</div>
          </div>
        </template>

        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const laporan = ref([])
const loading = ref(false)

const columns = [
  { name: 'nama', label: 'Nama Pegawai', field: 'nama', align: 'left' },
  { name: 'jabatan', label: 'Jabatan', field: 'jabatan', align: 'left' },
  { name: 'hadir', label: 'Hari Hadir', field: 'hadir', align: 'center' },
  { name: 'cuti', label: 'Hari Cuti', field: 'cuti', align: 'center' },
  { name: 'keterlambatan', label: 'Keterlambatan', field: 'keterlambatan', align: 'center' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' }
];

const activeEmployees = computed(() => {
  return laporan.value.filter(emp => emp.status === 'Aktif').length
})

const totalCuti = computed(() => {
  return laporan.value.reduce((total, emp) => total + emp.cuti, 0)
})

const getJabatanColor = (jabatan) => {
  const colorMap = {
    'Manager': 'purple',
    'Cinema Manager': 'purple',
    'Supervisor': 'blue',
    'Staff': 'teal',
    'Operator': 'orange',
    'Teknisi': 'indigo'
  }
  return colorMap[jabatan] || 'grey'
}

const refreshData = async () => {
  loading.value = true
  await loadData()
  loading.value = false
}

// Fungsi meniru logika isTerlambat dari Presensi.vue
const isTerlambat = (pegawai) => {
  if (pegawai.jabatan === 'Cinema Manager') return false

  const [jam, menit] = (pegawai.jamMasuk || '00:00').split(':').map(Number)
  const totalMenitMasuk = jam * 60 + menit

  let batasPagi = 0
  let batasSore = 0

  switch (pegawai.jabatan) {
    case 'Manager':
      batasPagi = 7 * 60 + 45
      batasSore = 16 * 60 + 15
      break
    case 'Daily Worker':
      batasPagi = 7 * 60 + 15
      batasSore = 15 * 60 + 45
      break
    case 'Cleaning Staff':
      batasPagi = 6 * 60 + 10
      batasSore = 16 * 60 + 10
      break
    default:
      batasPagi = 9 * 60
      batasSore = 16 * 60 + 15
  }

  if (totalMenitMasuk < 12 * 60) {
    return totalMenitMasuk > batasPagi
  } else {
    return totalMenitMasuk > batasSore
  }
}

const loadData = async () => {
  try {
    const [pegawaiRes, absensiRes, cutiRes] = await Promise.all([
      fetch('http://localhost:3002/pegawai'),
      fetch('http://localhost:3002/absensi'),
      fetch('http://localhost:3002/cuti')
    ]);

    const [pegawai, absensi, cuti] = await Promise.all([
      pegawaiRes.json(),
      absensiRes.json(),
      cutiRes.json()
    ]);

    const laporanData = pegawai.map(p => {
      const pegawaiId = p.id;

      const hadirCount = absensi.filter(a => a.pegawaiId === pegawaiId).length;

      const keterlambatanCount = absensi.filter(a => {
        if (a.pegawaiId !== pegawaiId) return false;
        const [jam, menit] = a.jamMasuk.split(':').map(Number);
        const totalMenitMasuk = jam * 60 + menit;

        let batasPagi = 0;
        let batasSore = 0;

        switch (p.jabatan) {
          case 'Manager':
            batasPagi = 7 * 60 + 45;
            batasSore = 16 * 60 + 15;
            break;
          case 'Daily Worker':
            batasPagi = 7 * 60 + 15;
            batasSore = 15 * 60 + 45;
            break;
          case 'Cleaning Staff':
            batasPagi = 6 * 60 + 10;
            batasSore = 16 * 60 + 10;
            break;
          default:
            batasPagi = 9 * 60;
            batasSore = 16 * 60 + 15;
        }

        return totalMenitMasuk < 12 * 60
          ? totalMenitMasuk > batasPagi
          : totalMenitMasuk > batasSore;
      }).length;

      const cutiCount = cuti.filter(c =>
        c.pegawaiId &&
        c.pegawaiId.id === pegawaiId &&
        c.status === 'Disetujui'
      ).length;

      return {
        nama: p.nama,
        jabatan: p.jabatan,
        hadir: hadirCount,
        cuti: cutiCount,
        keterlambatan: keterlambatanCount,
        status: p.status
      };
    });

    laporan.value = laporanData;
  } catch (err) {
    console.error('Gagal memuat data laporan:', err);
  }
};

onMounted(async () => {
  loading.value = true
  await loadData()
  loading.value = false
})
</script>

<style scoped lang="scss">
.modern-report-page {
  background: linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%);
  min-height: 100vh;
  padding: 24px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="25" cy="75" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="25" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
    pointer-events: none;
  }
}

.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    animation: shimmer 3s infinite;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    flex-wrap: wrap;
    position: relative;
    z-index: 1;
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 16px;

    .page-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      padding: 12px;
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
        border-radius: 18px;
        z-index: -1;
        animation: rotate 4s linear infinite;
      }
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: #2c3e50;
      margin: 0;
      background: linear-gradient(135deg, #2c3e50 0%, #4a6fa5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .page-subtitle {
      color: #64748b;
      margin: 4px 0 0 0;
      font-size: 14px;
      font-weight: 500;
      opacity: 0.8;
    }
  }

  .stats-cards {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .stat-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    min-width: 140px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      border-radius: 16px 16px 0 0;
    }

    .stat-decoration {
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      opacity: 0.1;
      transition: all 0.3s ease;
    }

    &.primary {
      &::before {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      }
      
      .stat-decoration {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
    }

    &.success {
      &::before {
        background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
      }
      
      .stat-decoration {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
    }

    &.warning {
      &::before {
        background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
      }
      
      .stat-decoration {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
    }

    &:hover {
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);

      .stat-decoration {
        transform: scale(1.2) rotate(45deg);
        opacity: 0.15;
      }
    }

    .stat-icon {
      background: #f8fafc;
      border-radius: 12px;
      padding: 8px;
      display: inline-flex;
      margin-bottom: 12px;
      color: #64748b;
      position: relative;
      z-index: 1;
    }

    .stat-content {
      position: relative;
      z-index: 1;
    }

    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      line-height: 1;
    }

    .stat-label {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
      margin-top: 4px;
    }
  }
}

.table-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;

  .table-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
      animation: shimmer 3s infinite;
    }

    .table-title {
      color: white;
      font-size: 18px;
      font-weight: 600;
      display: flex;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .table-actions {
      display: flex;
      gap: 8px;
      position: relative;
      z-index: 1;

      .action-btn {
        color: white;
        border-radius: 10px;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          transition: all 0.3s ease;
          transform: translate(-50%, -50%);
        }

        &:hover {
          transform: scale(1.1);
          
          &::before {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

.modern-table {
  background: transparent;

  :deep(.q-table__top) {
    display: none;
  }

  :deep(.q-table__bottom) {
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
  }

  :deep(thead tr th) {
    background: #f8fafc;
    color: #374151;
    font-weight: 600;
    border-bottom: 2px solid #e5e7eb;
    padding: 16px;
    font-size: 14px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    &:hover::after {
      transform: scaleX(1);
    }
  }

  :deep(tbody tr) {
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      background: #f8fafc;
      transform: translateX(4px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
    }
  }

  .name-cell {
    .employee-info {
      display: flex;
      align-items: center;
      gap: 12px;

      .employee-avatar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-size: 14px;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
          border-radius: 50%;
          z-index: -1;
          animation: rotate 4s linear infinite;
        }
      }

      .employee-details {
        .employee-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 2px;
        }

        .employee-id {
          font-size: 11px;
          color: #64748b;
          opacity: 0.8;
        }
      }
    }
  }

  .jabatan-chip {
    font-weight: 500;
    border-radius: 8px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    &:hover::before {
      left: 100%;
    }
  }

  .attendance-badge, .late-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;

    .badge-glow {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    &:hover {
      transform: scale(1.05);
      
      .badge-glow {
        left: 100%;
      }
    }

    .badge-text {
      position: relative;
      z-index: 1;
    }

    &.success {
      background: #dcfce7;
      color: #166534;
      box-shadow: 0 2px 8px rgba(22, 101, 52, 0.2);
    }

    &.warning {
      background: #fef3c7;
      color: #92400e;
      box-shadow: 0 2px 8px rgba(146, 64, 14, 0.2);
    }

    &.no-late {
      background: #e0f2f1;
      color: #00695c;
      box-shadow: 0 2px 8px rgba(0, 105, 92, 0.2);
    }

    &.few-late {
      background: #fff3cd;
      color: #856404;
      box-shadow: 0 2px 8px rgba(133, 100, 4, 0.2);
    }

    &.many-late {
      background: #fdecea;
      color: #b71c1c;
      box-shadow: 0 2px 8px rgba(183, 28, 28, 0.2);
    }
  }

  .status-chip {
    font-weight: 500;
    border-radius: 8px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s ease;
    }

    &:hover::before {
      left: 100%;
    }
  }

  .no-data-state {
    text-align: center;
    padding: 48px 24px;

    .no-data-icon {
      animation: float 3s ease-in-out infinite;
    }
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

// Tampilan Responsif di Berbagai Ukuran Layar
@media (max-width: 768px) {
  .modern-report-page {
    padding: 16px;
  }

  .page-header {
    padding: 20px;

    .header-content {
      flex-direction: column;
      align-items: stretch;
    }

    .title-section {
      margin-bottom: 16px;

      .page-title {
        font-size: 24px;
      }
    }

    .stats-cards {
      justify-content: center;

      .stat-card {
        flex: 1;
        min-width: 120px;
      }
    }
  }

  .table-container .table-header {
    padding: 16px;

    .table-title {
      font-size: 16px;
    }
  }

  .modern-table :deep(thead tr th),
  .modern-table :deep(tbody tr td) {
    padding: 12px 8px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    flex-direction: column;

    .stat-card {
      min-width: unset;
    }
  }

  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch !important;

    .table-actions {
      justify-content: center;
    }
  }
}
</style>