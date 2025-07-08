<template>
  <div class="presensi-container">
    <q-banner 
      v-if="manualNotif.show"
      class="q-my-md q-pa-sm"
      :class="{
        'bg-green-3 text-black': manualNotif.type === 'positive',
        'bg-orange-3 text-black': manualNotif.type === 'warning',
        'bg-red-4 text-white': manualNotif.type === 'negative'
      }"
      rounded
      dense
    >
      <q-icon 
        :name="manualNotif.type === 'positive' 
                ? 'check_circle' 
                : manualNotif.type === 'warning' 
                ? 'warning' 
                : 'error'" 
        size="20px" 
        class="q-mr-sm" 
      />
      {{ manualNotif.message }}
    </q-banner>

    <!-- Header Utama -->
    <div class="header-section">
      <div class="header-content">
        <div class="header-title">
          <q-icon 
            :name="showRiwayat ? 'history' : 'access_time'" 
            size="32px" 
            class="header-icon"
          />
          <div>
            <h4 class="title-main">{{ showRiwayat ? 'Riwayat Presensi' : 'Presensi Hari ini' }}</h4>
            <p class="title-sub">{{ getCurrentDateString() }}</p>
          </div>
        </div>
        
        <!-- Tombol Aksi -->
        <div class="action-buttons" v-if="!showRiwayat">
          <q-btn 
            class="action-btn manual-btn"
            icon="add_circle_outline" 
            label="Input Manual"
            @click="bukaInputManual"
            no-caps
            unelevated
          />
          <q-btn 
            class="action-btn history-btn"
            icon="timeline" 
            label="Lihat Riwayat"
            @click="tampilkanRiwayat"
            no-caps
            unelevated
          />
        </div>

        <!-- Tombol Tutup Riwayat -->
        <div v-if="showRiwayat" class="close-section">
          <q-btn 
            class="close-btn"
            icon="arrow_back" 
            label="Kembali"
            @click="tutupRiwayat"
            no-caps
            flat
          />
        </div>
      </div>
    </div>

    <!-- Kartu Statistik (hari ini)) -->
    <div v-if="!showRiwayat" class="stats-section">
      <div class="stats-grid">
        <div class="stat-card present-card">
          <div class="stat-icon">
            <q-icon name="check_circle" size="24px" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ presensiHariIni.length }}</div>
            <div class="stat-label">Hadir Hari Ini</div>
          </div>
        </div>
        
        <div class="stat-card late-card">
          <div class="stat-icon">
            <q-icon name="schedule" size="24px" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ getLateCount() }}</div>
            <div class="stat-label">Terlambat</div>
          </div>
        </div>
        
        <div class="stat-card total-card">
          <div class="stat-icon">
            <q-icon name="people" size="24px" />
          </div>
          <div class="stat-content">
            <div class="stat-number">{{ pegawai.length }}</div>
            <div class="stat-label">Total Pegawai</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Konten Utama -->
    <div class="main-content">
      <!-- Tabel Absensi Hari Ini -->
      <div v-if="!showRiwayat" class="table-container">
        <div class="table-header">
          <h6>Daftar Presensi Hari Ini</h6>
          <div class="table-actions">
            <q-btn 
              icon="refresh" 
              flat 
              dense 
              @click="fetchPresensiHariIni"
              class="refresh-btn"
            >
              <q-tooltip>Refresh Data</q-tooltip>
            </q-btn>
          </div>
        </div>
        
        <q-table
          :rows="presensiHariIni"
          :columns="columns"
          row-key="id"
          flat
          class="modern-table"
          :pagination="{ rowsPerPage: 10 }"
          :rows-per-page-options="[5, 10, 20]"
        >
        <template v-slot:body-cell-nama="props">
          <q-td :props="props" :class="['name-cell', isTerlambat(props.row) ? 'terlambat-row' : '']">
            <div class="employee-info">
              <q-avatar size="32px" class="employee-avatar" :color="isTerlambat(props.row) ? 'red' : 'primary'">
                {{ props.value.charAt(0).toUpperCase() }}
              </q-avatar>
              <span class="employee-name">
                {{ props.value }}
                <q-icon 
                  v-if="isTerlambat(props.row)" 
                  name="warning" 
                  color="red" 
                  size="16px" 
                  class="q-ml-sm"
                />
              </span>
            </div>
          </q-td>
        </template>

          
          <template v-slot:body-cell-jabatan="props">
            <q-td :props="props">
              <q-chip 
                :class="getJobChipClass(props.value)"
                size="sm"
                dense
              >
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>
          
          <template v-slot:body-cell-jamMasuk="props">
            <q-td :props="props" class="time-cell">
              <div class="time-display">
                <q-icon name="login" size="16px" />
                <span>{{ props.value }}</span>
              </div>
            </q-td>
          </template>
          
          <template v-slot:body-cell-jamKeluar="props">
            <q-td :props="props" class="time-cell">
              <div class="time-display">
                <q-icon name="logout" size="16px" />
                <span>{{ props.value || '-' }}</span>
              </div>
            </q-td>
          </template>
          
          <template v-slot:body-cell-durasi="props">
            <q-td :props="props">
              <q-chip 
                :class="getDurationChipClass(props.value)"
                size="sm"
                dense
              >
                <q-icon name="timer" size="14px" class="q-mr-xs" />
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Bagian Riwayat -->
      <div v-if="showRiwayat" class="history-section">
        <div class="history-controls">
          <div class="calendar-container">
            <q-date
              v-model="selectedDate"
              mask="YYYY-MM-DD"
              :default-year-month="defaultYearMonth"
              class="modern-calendar"
              color="primary"
              today-btn
              @update:model-value="fetchPresensiByDate"
            />
          </div>
          
          <div class="history-content">
            <div class="history-header">
              <h6>Presensi Tanggal {{ formatDate(selectedDate) }}</h6>
              <q-chip 
                v-if="presensiByDate.length"
                color="primary" 
                text-color="white"
                icon="people"
                size="sm"
              >
                {{ presensiByDate.length }} Orang
              </q-chip>
            </div>
            
            <q-table
              v-if="presensiByDate.length"
              :rows="presensiByDate"
              :columns="columns"
              row-key="id"
              flat
              class="modern-table history-table"
              :pagination="{ rowsPerPage: 10 }"
            >
              <template v-slot:body-cell-nama="props">
                <q-td :props="props" class="name-cell">
                  <div class="employee-info">
                    <q-avatar size="28px" class="employee-avatar">
                      {{ props.value.charAt(0).toUpperCase() }}
                    </q-avatar>
                    <span class="employee-name">{{ props.value }}</span>
                  </div>
                </q-td>
              </template>
              
              <template v-slot:body-cell-jabatan="props">
                <q-td :props="props">
                  <q-chip 
                    :class="getJobChipClass(props.value)"
                    size="sm"
                    dense
                  >
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>
              
              <template v-slot:body-cell-jamMasuk="props">
                <q-td :props="props" class="time-cell">
                  <div class="time-display">
                    <q-icon name="login" size="14px" />
                    <span>{{ props.value }}</span>
                  </div>
                </q-td>
              </template>
              
              <template v-slot:body-cell-jamKeluar="props">
                <q-td :props="props" class="time-cell">
                  <div class="time-display">
                    <q-icon name="logout" size="14px" />
                    <span>{{ props.value || '-' }}</span>
                  </div>
                </q-td>
              </template>
              
              <template v-slot:body-cell-durasi="props">
                <q-td :props="props">
                  <q-chip 
                    :class="getDurationChipClass(props.value)"
                    size="sm"
                    dense
                  >
                    <q-icon name="timer" size="12px" class="q-mr-xs" />
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>
            </q-table>
            
            <div v-else class="empty-state">
              <q-icon name="event_busy" size="64px" />
              <h6>Tidak Ada Data</h6>
              <p>Tidak ada data presensi untuk tanggal {{ formatDate(selectedDate) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog Input Manual -->
    <q-dialog v-model="dialogManual" class="manual-dialog">
      <q-card class="manual-card">
        <q-card-section class="dialog-header">
          <div class="dialog-title">
            <q-icon name="edit_calendar" size="24px" />
            <span>Input Manual Presensi</span>
          </div>
          <q-btn 
            icon="close" 
            flat 
            dense 
            v-close-popup
            class="close-dialog-btn"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-content">
          <div class="input-grid">
            <q-input 
              v-model="manualTanggal" 
              type="date" 
              label="Tanggal Presensi"
              outlined
              class="modern-input"
              :rules="[val => !!val || 'Tanggal wajib diisi']"
            />

            <q-select
              v-model="manualJabatan"
              :options="jabatanOptions"
              label="Pilih Jabatan"
              outlined
              class="modern-input"
              @update:model-value="filterPegawaiByJabatan"
              :rules="[val => !!val || 'Jabatan wajib dipilih']"
            />

            <q-select
              v-model="manualPegawaiId"
              :options="filteredPegawai.map(p => ({ label: p.nama, value: p.id }))"
              label="Pilih Pegawai"
              outlined
              class="modern-input"
              emit-value
              map-options
              :disable="!manualJabatan"
              :rules="[val => !!val || 'Pegawai wajib dipilih']"
            />

            <div class="time-inputs">
              <q-input 
                v-model="manualJamMasuk" 
                label="Jam Masuk"
                mask="##:##"
                outlined
                class="modern-input time-input"
                :rules="[val => !!val || 'Jam masuk wajib diisi']"
              >
                <template v-slot:append>
                  <q-icon name="access_time" />
                </template>
              </q-input>

              <q-input 
                v-model="manualJamKeluar" 
                label="Jam Keluar"
                mask="##:##"
                outlined
                class="modern-input time-input"
                :rules="[val => !!val || 'Jam keluar wajib diisi']"
              >
                <template v-slot:append>
                  <q-icon name="access_time" />
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="dialog-actions">
          <q-btn 
            label="Batal" 
            flat
            class="cancel-btn"
            v-close-popup
            no-caps
          />
          <q-btn 
            label="Simpan Presensi"
            color="primary"
            class="save-btn"
            @click="simpanManual"
            no-caps
            unelevated
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'Presensi',
 data() {
  return {
    pegawai: [],
    filteredPegawai: [],
    presensiHariIni: [],
    riwayat: [],
    dialogManual: false,

    manualTanggal: '',
    manualJabatan: '',
    manualPegawaiId: null,
    manualJamMasuk: '',
    manualJamKeluar: '',

    manualNotif: {
      show: false,
      type: '',
      message: ''
    },

    columns: [
      { name: 'nama', label: 'Nama Pegawai', field: 'nama', align: 'left', sortable: true },
      { name: 'jabatan', label: 'Jabatan', field: 'jabatan', align: 'left', sortable: true },
      { name: 'jamMasuk', label: 'Jam Masuk', field: 'jamMasuk', align: 'center', sortable: true },
      { name: 'jamKeluar', label: 'Jam Keluar', field: 'jamKeluar', align: 'center', sortable: true },
      { name: 'durasi', label: 'Durasi Kerja', field: 'durasi', align: 'center', sortable: true },
    ],

    showRiwayat: false,
    selectedDate: null,
    presensiByDate: [],
  };
},
  watch: {
    selectedDate(newDate) {
      this.fetchPresensiByDate(newDate);
    }
  },
  computed: {
    jabatanOptions() {
      const jabatanSet = new Set(this.pegawai.map(p => p.jabatan));
      return Array.from(jabatanSet);
    },
    defaultYearMonth() {
      const today = new Date();
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    },
  },
  methods: {
  showNotif(type, message) {
    this.manualNotif.show = true;
    this.manualNotif.type = type;
    this.manualNotif.message = message;

    setTimeout(() => {
      this.manualNotif.show = false;
    }, 3000);
  },
     isTerlambat(pegawai) {
        if (pegawai.jabatan === 'Cinema Manager') return false;

        const [jam, menit] = pegawai.jamMasuk.split(':').map(Number);
        const totalMenitMasuk = jam * 60 + menit;

        let batasPagi = 0;
        let batasSore = 0;

        // Tetapkan batas keterlambatan berdasarkan jabatan
        switch (pegawai.jabatan) {
          case 'Manager':
            batasPagi = 7 * 60 + 45; // 07:45
            batasSore = 16 * 60 + 15; // 16:15
            break;
          case 'Daily Worker':
            batasPagi = 7 * 60 + 15; // 07:15
            batasSore = 15 * 60 + 45; // 15:45
            break;
          case 'Cleaning Staff':
            batasPagi = 6 * 60 + 10; // 06:10
            batasSore = 16 * 60 + 10; // 16:10
            break;
          default:
            batasPagi = 9 * 60; // fallback (jika jabatan tidak dikenali)
            batasSore = 16 * 60 + 15;
        }

        // Deteksi shift
        if (totalMenitMasuk < 12 * 60) {
          // Shift Pagi
          return totalMenitMasuk > batasPagi;
        } else {
          // Shift Sore
          return totalMenitMasuk > batasSore;
        }
      },
    getCurrentDateString() {
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date().toLocaleDateString('id-ID', options);
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    },

    getLateCount() {
      return this.presensiHariIni.filter(p => this.isTerlambat(p)).length;
    },

    getJobChipClass(jabatan) {
      const jabatanClasses = {
        'Manager': 'job-chip-manager',
        'Cinema Manager': 'job-chip-cinema-manager',
        'Staff': 'job-chip-staff',
        'Kasir': 'job-chip-kasir',
      };
      return jabatanClasses[jabatan] || 'job-chip-default';
    },

    getDurationChipClass(durasi) {
      if (!durasi) return 'duration-chip-none';
      
      const hours = parseInt(durasi.split('j')[0]) || 0;
      if (hours >= 8) return 'duration-chip-full';
      if (hours >= 6) return 'duration-chip-partial';
      return 'duration-chip-short';
    },

    async fetchPegawai() {
      try {
        const res = await fetch('http://localhost:3002/pegawai');
        this.pegawai = await res.json();
      } catch (error) {
        console.error('Error fetching pegawai:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Gagal memuat data pegawai'
        });
      }
    },

    async simpanManual() {
  if (!this.manualTanggal || !this.manualPegawaiId || !this.manualJamMasuk || !this.manualJamKeluar) {
    this.showNotif('warning', 'Harap isi semua data terlebih dahulu');
    return;
  }

  const pegawai = this.pegawai.find(p => p.id === this.manualPegawaiId);

  if (!pegawai) {
    this.showNotif('negative', 'Data pegawai tidak ditemukan');
    return;
  }

  const durasi = this.hitungDurasi(this.manualJamMasuk, this.manualJamKeluar);

  const dataPresensi = {
    id: Date.now(),
    tanggal: this.manualTanggal,
    pegawaiId: pegawai.id,
    nama: pegawai.nama,
    jabatan: pegawai.jabatan,
    jamMasuk: this.manualJamMasuk,
    jamKeluar: this.manualJamKeluar,
    durasi
  };

  try {
    const res = await fetch('http://localhost:3002/absensi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataPresensi)
    });

    if (!res.ok) throw new Error('Gagal menyimpan presensi.');

    this.showNotif('positive', 'Presensi berhasil disimpan!');
    this.dialogManual = false;
    this.fetchPresensiHariIni();
    this.resetManualForm();
  } catch (error) {
    console.error('Gagal menyimpan data:', error);
    this.showNotif('negative', 'Terjadi kesalahan saat menyimpan presensi');
  }
},


    resetManualForm() {
      this.manualTanggal = '';
      this.manualJabatan = '';
      this.manualPegawaiId = null;
      this.manualJamMasuk = '';
      this.manualJamKeluar = '';
      this.filteredPegawai = [];
    },

    filterPegawaiByJabatan(jabatan) {
      this.filteredPegawai = this.pegawai.filter(p => p.jabatan === jabatan);
      this.manualPegawaiId = null;
    },

    async fetchPresensiHariIni() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await fetch('http://localhost:3002/absensi');
        const data = await res.json();
        this.presensiHariIni = data.filter(p => p.tanggal === today);
      } catch (error) {
        console.error('Error fetching presensi:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Gagal memuat data presensi'
        });
      }
    },

    async fetchPresensiByDate(date) {
      if (!date) return;
      try {
        const res = await fetch('http://localhost:3002/absensi');
        const data = await res.json();
        this.presensiByDate = data.filter(p => p.tanggal === date);
      } catch (error) {
        console.error('Error fetching presensi by date:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Gagal memuat data presensi'
        });
      }
    },

    bukaInputManual() {
      this.resetManualForm();
      this.dialogManual = true;
    },

    hitungDurasi(masuk, keluar) {
      const [jam1, menit1] = masuk.split(':').map(Number);
      const [jam2, menit2] = keluar.split(':').map(Number);

      if (isNaN(jam1) || isNaN(jam2)) return '0j 0m';

      const totalMenit = (jam2 * 60 + menit2) - (jam1 * 60 + menit1);
      const jam = Math.floor(totalMenit / 60);
      const menit = totalMenit % 60;
      return `${jam}j ${menit}m`;
    },

    tampilkanRiwayat() {
      this.showRiwayat = true;
      const today = new Date().toISOString().split('T')[0];
      this.selectedDate = today;
      this.fetchPresensiByDate(today);
    },

    tutupRiwayat() {
      this.showRiwayat = false;
      this.selectedDate = null;
      this.presensiByDate = [];
    }
  },
  mounted() {
    this.fetchPegawai();
    this.fetchPresensiHariIni();
  }
};
</script>

<style lang="scss" scoped>
.presensi-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%);
  padding: 24px;
}

// Header Utama
.header-section {
  margin-bottom: 24px;
  
  .header-content {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .header-title {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      
      .header-icon {
        background: #6c5ce7;
        color: white;
        padding: 12px;
        border-radius: 12px;
      }
      
      .title-main {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #2d3436;
      }
      
      .title-sub {
        margin: 4px 0 0 0;
        color: #636e72;
        font-size: 14px;
        font-weight: 400;
      }
    }
    
    .action-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      
      .action-btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 500;
        font-size: 14px;
        min-width: 140px;
        
        &.manual-btn {
          background: #6c5ce7;
          color: white;
          
          &:hover {
            background: #5f4fcf;
          }
        }
        
        &.history-btn {
          background: #00b894;
          color: white;
          
          &:hover {
            background: #00a085;
          }
        }
      }
    }
    
    .close-section {
      .close-btn {
        color: #6c5ce7;
        font-weight: 500;
        padding: 8px 16px;
        border-radius: 8px;
        
        &:hover {
          background: rgba(108, 92, 231, 0.1);
        }
      }
    }
  }
}


// Bagian Statistik
.stats-section {
  margin-bottom: 24px;
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      .stat-icon {
        padding: 12px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .stat-content {
        .stat-number {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #636e72;
          font-weight: 400;
        }
      }
      
      &.present-card {
        .stat-icon {
          background: #00b894;
          color: white;
        }
        
        .stat-number {
          color: #00b894;
        }
      }
      
      &.late-card {
        .stat-icon {
          background: #fdcb6e;
          color: white;
        }
        
        .stat-number {
          color: #fdcb6e;
        }
      }
      
      &.total-card {
        .stat-icon {
          background: #6c5ce7;
          color: white;
        }
        
        .stat-number {
          color: #6c5ce7;
        }
      }
    }
  }
}

// Konten Utama
.main-content {
  .table-container {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h6 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #2d3436;
      }
      
      .refresh-btn {
        color: #6c5ce7;
        
        &:hover {
          background: rgba(108, 92, 231, 0.1);
        }
      }
    }
  }
  
  .history-section {
    .history-controls {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 24px;
      
      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
      
      .calendar-container {
        background: white;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        height: fit-content;
      }
      
      .history-content {
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        
        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          
          h6 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #2d3436;
          }
        }
        
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #636e72;
          
          .q-icon {
            color: #b2bec3;
            margin-bottom: 16px;
          }
          
          h6 {
            font-size: 16px;
            font-weight: 500;
            margin: 0 0 8px 0;
            color: #636e72;
          }
          
          p {
            margin: 0;
            font-size: 14px;
          }
        }
      }
    }
  }
}

// Gaya Tabel Modern
.modern-table {
  border-radius: 8px;
  overflow: hidden;
  
  :deep(.q-table__top) {
    padding: 0;
  }
  
  :deep(.q-table__middle) {
    border-radius: 8px;
    overflow: hidden;
  }
  
  :deep(thead tr th) {
    background: #6c5ce7;
    color: white;
    font-weight: 600;
    font-size: 14px;
    padding: 16px 12px;
    text-transform: none;
    
    &:first-child {
      border-top-left-radius: 8px;
    }
    
    &:last-child {
      border-top-right-radius: 8px;
    }
  }
  
  :deep(tbody tr) {
    &:nth-child(even) {
      background: #f8f9fa;
    }
    
    &:hover {
      background: #e3f2fd !important;
    }
    
    &:not(:last-child) {
      border-bottom: 1px solid #e9ecef;
    }
  }
  
  :deep(tbody tr td) {
    padding: 14px 12px;
    font-size: 14px;
    color: #2d3436;
    
    &.name-cell {
      .employee-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    }
  }
}
</style>