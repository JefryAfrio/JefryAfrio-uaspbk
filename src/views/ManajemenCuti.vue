<template>
  <q-page class="q-pa-md bg-page">
    <!-- Header Section -->
    <div class="page-header q-mb-lg">
      <div class="header-content">
        <div class="header-icon">
          <q-icon name="star" size="28px" color="white" />
        </div>
        <div class="header-text">
          <h4 class="page-title q-ma-none">Manajemen Cuti</h4>
          <p class="page-subtitle q-ma-none">Kelola pengajuan cuti Infinity Cinema</p>
        </div>
        <div class="header-stats">
          <span class="total-count">{{ cuti.length }}</span>
          <span class="total-label">Total Pengajuan Cuti</span>
        </div>
      </div>
      <q-btn
        label="Tambah Pengajuan Cuti"
        color="primary"
        icon="add"
        unelevated
        rounded
        @click="bukaDialogTambah"
        class="add-btn"
      />
    </div>

    <!-- Filter Section -->
    <div class="filter-section q-mb-lg">
      <div class="filter-label">Filter Status</div>
      <q-select
        v-model="filterStatus"
        :options="statusOptions"
        label="Semua Status"
        outlined
        rounded
        class="filter-select"
        @update:model-value="applyFilter"
      >
        <template v-slot:prepend>
          <q-icon name="filter_list" />
        </template>
      </q-select>
    </div>

    <!-- Table Card -->
    <q-card class="table-card">
      <q-card-section class="card-header">
        <div class="card-header-content">
          <div class="card-title">
            <h6 class="q-ma-none">Daftar Pengajuan Cuti</h6>
            <div class="data-info">
              <q-icon name="info" size="16px" class="q-mr-xs" />
              {{ filteredCuti.length }} data ditemukan
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="table-section q-pa-none">
        <q-table
          :rows="filteredCuti"
          :columns="columns"
          row-key="id"
          :rows-per-page-options="[10, 25, 50]"
          flat
          class="modern-table"
          hide-header
        >
          <!-- Custom Header -->
          <template v-slot:top>
            <div class="table-header">
              <div class="header-cell name-header">Nama</div>
              <div class="header-cell">Periode</div>
              <div class="header-cell">Durasi</div>
              <div class="header-cell">Alasan</div>
              <div class="header-cell">Status</div>
              <div class="header-cell action-header">Aksi</div>
            </div>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" class="table-row">
              <!-- Nama Pegawai -->
              <q-td key="pegawai" :props="props" class="employee-cell">
                <div class="employee-info">
                  <div class="employee-name">{{ getNamaPegawai(props.row.pegawaiId) }}</div>
                  <div class="employee-badge">
                    <q-chip 
                      :label="getJabatanPegawai(props.row.pegawaiId)"
                      size="sm"
                      :color="getJabatanColor(getJabatanPegawai(props.row.pegawaiId))"
                      :text-color="getJabatanTextColor(getJabatanPegawai(props.row.pegawaiId))"
                    />
                  </div>
                </div>
              </q-td>

              <!-- Periode -->
              <q-td key="tanggal" :props="props" class="date-cell">
                <div class="date-range">
                  <div class="date-item">{{ formatDate(props.row.tanggalMulai) }}</div>
                  <div class="date-separator">-</div>
                  <div class="date-item">{{ formatDate(props.row.tanggalSelesai) }}</div>
                </div>
              </q-td>

              <!-- Durasi -->
              <q-td key="durasi" :props="props" class="duration-cell">
                <span class="duration-text">{{ calculateDuration(props.row.tanggalMulai, props.row.tanggalSelesai) }} hari</span>
              </q-td>

              <!-- Alasan -->
              <q-td key="alasan" :props="props" class="reason-cell">
                <div class="reason-text">{{ props.row.alasan }}</div>
              </q-td>

              <!-- Status -->
              <q-td key="status" :props="props" class="status-cell">
                <div class="status-wrapper">
                  <q-icon 
                    :name="getStatusIcon(props.row.status)" 
                    :color="getStatusIconColor(props.row.status)"
                    size="16px"
                    class="q-mr-xs"
                  />
                  <span class="status-text">{{ props.row.status }}</span>
                </div>
              </q-td>

              <!-- Aksi -->
              <q-td key="aksi" :props="props" class="action-cell">
                <div class="action-buttons">
                  <q-btn
                    dense
                    flat
                    round
                    icon="edit"
                    color="primary"
                    @click="bukaDialogEdit(props.row)"
                    class="action-btn"
                  >
                    <q-tooltip>Edit</q-tooltip>
                  </q-btn>
                  <q-btn
                    dense
                    flat
                    round
                    icon="delete"
                    color="negative"
                    @click="hapusCuti(props.row.id)"
                    class="action-btn"
                  >
                    <q-tooltip>Hapus</q-tooltip>
                  </q-btn>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialog Tambah/Edit -->
    <q-dialog v-model="dialogTerbuka" persistent>
      <q-card class="dialog-card">
        <q-card-section class="dialog-header">
          <div class="dialog-title">
            <q-icon 
              :name="modeEdit ? 'edit' : 'add'" 
              size="24px" 
              color="primary" 
              class="q-mr-sm"
            />
            <span class="text-h6">{{ modeEdit ? "Edit" : "Tambah" }} Pengajuan Cuti</span>
          </div>
          <q-btn
            flat
            round
            dense
            icon="close"
            color="grey-6"
            @click="dialogTerbuka = false"
          />
        </q-card-section>

        <q-separator />

        <q-card-section class="dialog-content">
          <div class="form-section">
            <h6 class="section-title">Informasi Pegawai</h6>
            <div class="form-row">
              <q-select
                v-model="form.jabatan"
                :options="jabatanList"
                label="Jabatan"
                outlined
                rounded
                class="form-field"
                @update:model-value="filterPegawaiByJabatan"
              >
                <template v-slot:prepend>
                  <q-icon name="work" />
                </template>
              </q-select>

              <q-select
                v-model="form.pegawaiId"
                :options="filteredPegawai"
                option-label="nama"
                option-value="id"
                label="Nama Pegawai"
                outlined
                rounded
                class="form-field"
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-select>
            </div>
          </div>

          <div class="form-section">
            <h6 class="section-title">Periode Cuti</h6>
            <div class="form-row">
              <q-input
                v-model="form.tanggalMulai"
                type="date"
                label="Tanggal Mulai"
                outlined
                rounded
                class="form-field"
              >
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
              </q-input>

              <q-input
                v-model="form.tanggalSelesai"
                type="date"
                label="Tanggal Selesai"
                outlined
                rounded
                class="form-field"
              >
                <template v-slot:prepend>
                  <q-icon name="event" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="form-section">
            <h6 class="section-title">Detail Pengajuan</h6>
            <q-input
              v-model="form.alasan"
              label="Alasan Cuti"
              outlined
              rounded
              type="textarea"
              rows="3"
              class="form-field full-width"
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>

            <q-select
              v-if="modeEdit"
              v-model="form.status"
              :options="['Menunggu Persetujuan', 'Disetujui', 'Ditolak']"
              label="Status"
              outlined
              rounded
              class="form-field full-width"
            >
              <template v-slot:prepend>
                <q-icon name="flag" />
              </template>
            </q-select>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions class="dialog-actions">
          <q-btn 
            flat 
            label="Batal" 
            color="grey-6" 
            @click="dialogTerbuka = false"
            class="cancel-btn"
          />
          <q-btn 
            unelevated
            rounded
            label="Simpan" 
            color="primary" 
            @click="simpanCuti"
            class="save-btn"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
// fetch(`${API_BASE}/cuti`)
const cuti = ref([]);
const pegawai = ref([]);
const filteredPegawai = ref([]);
const filteredCuti = ref([]);
const filterStatus = ref("");
const dialogTerbuka = ref(false);
const modeEdit = ref(false);
const editId = ref(null);
const jabatanList = ref([]);

const statusOptions = ref([
  "Semua Status",
  "Menunggu Persetujuan", 
  "Disetujui", 
  "Ditolak"
]);

const form = ref({
  jabatan: "",
  pegawaiId: "",
  tanggalMulai: "",
  tanggalSelesai: "",
  alasan: "",
  status: "Menunggu Persetujuan",
});

const pendingCount = computed(() => 
  cuti.value.filter(c => c.status === 'Menunggu Persetujuan').length
);
const approvedCount = computed(() => 
  cuti.value.filter(c => c.status === 'Disetujui').length
);
const rejectedCount = computed(() => 
  cuti.value.filter(c => c.status === 'Ditolak').length
);

const columns = [
  {
    name: "pegawai",
    label: "Pegawai",
    align: "left",
    field: (row) => getNamaPegawai(row.pegawaiId),
    sortable: true,
  },
  {
    name: "tanggal",
    label: "Periode Cuti",
    align: "left",
    sortable: true,
  },
  {
    name: "durasi",
    label: "Durasi",
    align: "center",
    sortable: true,
  },
  { name: "alasan", label: "Alasan", field: "alasan", align: "left" },
  { name: "status", label: "Status", field: "status", align: "center" },
  { name: "aksi", label: "Aksi", align: "center" },
];

const getInitials = (name) => {
  if (!name || name.includes('❗')) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
};

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Menunggu Persetujuan': return 'orange-1';
    case 'Disetujui': return 'green-1';
    case 'Ditolak': return 'red-1';
    default: return 'grey-1';
  }
};

const getStatusTextColor = (status) => {
  switch (status) {
    case 'Menunggu Persetujuan': return 'orange-8';
    case 'Disetujui': return 'green-8';
    case 'Ditolak': return 'red-8';
    default: return 'grey-8';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Menunggu Persetujuan': return 'schedule';
    case 'Disetujui': return 'check_circle';
    case 'Ditolak': return 'cancel';
    default: return 'help';
  }
};

const getStatusIconColor = (status) => {
  switch (status) {
    case 'Menunggu Persetujuan': return 'orange';
    case 'Disetujui': return 'green';
    case 'Ditolak': return 'red';
    default: return 'grey';
  }
};

const getJabatanColor = (jabatan) => {
  switch (jabatan) {
    case 'Cinema Manager': return 'purple-1';
    case 'Manager': return 'green-1';
    default: return 'blue-1';
  }
};

const getJabatanTextColor = (jabatan) => {
  switch (jabatan) {
    case 'Cinema Manager': return 'purple-8';
    case 'Manager': return 'green-8';
    default: return 'blue-8';
  }
};

const getNamaPegawai = (idObj) => {
  const id = typeof idObj === "object" && idObj !== null ? idObj.id : idObj;
  const found = pegawai.value.find((p) => p.id === id);
  return found ? found.nama : `❗ Pegawai tidak ditemukan untuk ID: ${JSON.stringify(idObj)}`;
};

const getJabatanPegawai = (idObj) => {
  const id = typeof idObj === "object" && idObj !== null ? idObj.id : idObj;
  const found = pegawai.value.find((p) => p.id === id);
  return found ? found.jabatan : "-";
};

const applyFilter = () => {
  if (!filterStatus.value || filterStatus.value === "Semua Status") {
    filteredCuti.value = [...cuti.value];
  } else {
    filteredCuti.value = cuti.value.filter(c => c.status === filterStatus.value);
  }
};

const fetchData = async () => {
  try {
    const [resPegawai, resCuti] = await Promise.all([
      fetch(import.meta.env.PROD ? '/pegawai.json' : 'http://localhost:3002/pegawai'),
      fetch(import.meta.env.PROD ? '/cuti.json' : 'http://localhost:3002/cuti')

    ]);
    pegawai.value = await resPegawai.json();
    cuti.value = await resCuti.json();
    filteredCuti.value = [...cuti.value];
    jabatanList.value = [...new Set(pegawai.value.map((p) => p.jabatan))];
  } catch (err) {
    console.error("Gagal fetch:", err);
  }
};

const filterPegawaiByJabatan = () => {
  if (form.value.jabatan) {
    filteredPegawai.value = pegawai.value.filter(
      (p) => p.jabatan === form.value.jabatan
    );
  } else {
    filteredPegawai.value = pegawai.value;
  }
};

const bukaDialogTambah = () => {
  form.value = {
    jabatan: "",
    pegawaiId: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    alasan: "",
    status: "Menunggu Persetujuan",
  };
  filteredPegawai.value = [];
  modeEdit.value = false;
  dialogTerbuka.value = true;
};

const bukaDialogEdit = (row) => {
  const pegawaiData = pegawai.value.find((p) => p.id === row.pegawaiId);
  form.value = {
    jabatan: pegawaiData?.jabatan || "",
    pegawaiId: row.pegawaiId,
    tanggalMulai: row.tanggalMulai,
    tanggalSelesai: row.tanggalSelesai,
    alasan: row.alasan,
    status: row.status,
  };
  filterPegawaiByJabatan();
  editId.value = row.id;
  modeEdit.value = true;
  dialogTerbuka.value = true;
};

const simpanCuti = async () => {
  const url = modeEdit.value
    ? `${API_BASE}/cuti/${editId.value}`
    : `${API_BASE}/cuti`;

  const method = modeEdit.value ? "PUT" : "POST";

  if (
    !form.value.pegawaiId ||
    !form.value.tanggalMulai ||
    !form.value.tanggalSelesai ||
    !form.value.alasan
  ) {
    alert("Harap lengkapi semua kolom.");
    return;
  }

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });

    if (!res.ok) throw new Error("Gagal menyimpan");
    dialogTerbuka.value = false;
    await fetchData();
    alert("Data berhasil disimpan.");
  } catch (err) {
    console.error(err);
    alert("Gagal menyimpan data.");
  }
};

const hapusCuti = async (id) => {
  const konfirmasi = confirm("Yakin ingin menghapus pengajuan cuti ini?");
  if (!konfirmasi) return;

  try {
    const res = await fetch(`${API_BASE}/cuti/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Gagal menghapus");
    await fetchData();
    alert("Data berhasil dihapus.");
  } catch (err) {
    alert("Gagal menghapus data.");
  }
};

onMounted(fetchData);
</script>


<style scoped lang="scss">
.bg-page {
  background: linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%);
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: #f8fafc;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;

  .header-content {
    display: flex;
    align-items: center;
    gap: 24px;
    flex: 1;

    .header-icon {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
    }

    .header-text {
      flex: 1;

    .page-title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 4px;
    background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent; /* Fallback untuk beberapa browser */
  }


      .page-subtitle {
        color: #64748b;
        font-size: 15px;
        font-weight: 500;
      }
    }

    .header-stats {
      text-align: right;
      padding: 16px 20px;
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      border-radius: 16px;
      border: 1px solid #e2e8f0;

      .total-count {
        display: block;
        font-size: 36px;
        font-weight: 800;
        color: #6366f1;
        line-height: 1;
      }

      .total-label {
        color: #64748b;
        font-size: 13px;
        font-weight: 500;
        margin-top: 4px;
      }
    }
  }

  .add-btn {
    padding: 14px 28px;
    font-weight: 600;
    font-size: 14px;
    text-transform: none;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
    }
  }
}

.filter-section {
  background: white;
  padding: 20px 28px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 20px;

  .filter-label {
    font-weight: 600;
    color: #374151;
    font-size: 15px;
    min-width: 120px;
  }

  .filter-select {
    max-width: 320px;
    
    .q-field__control {
      border-radius: 12px;
      border: 2px solid #e2e8f0;
      transition: all 0.3s ease;

      &:hover {
        border-color: #6366f1;
      }
    }
  }
}

.table-card {
  border-radius: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  background: white;

  .card-header {
    background: white;
    padding: 24px 28px;
    border-bottom: 1px solid #e2e8f0;

    .card-header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-title {
        h6 {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 6px;
        }

        .data-info {
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .table-section {
    background: white;
  }
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 0.8fr 2fr 1fr 0.8fr;
  gap: 16px;
  padding: 20px 28px;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
  font-size: 14px;

  .header-cell {
    display: flex;
    align-items: center;

    &.name-header {
      color: #6366f1;
    }

    &.action-header {
      justify-content: center;
    }
  }
}

.modern-table {
  .q-table__top {
    padding: 0;
  }

  .table-row {
    border-bottom: 1px solid #f1f5f9;
    transition: all 0.3s ease;

    &:hover {
      background: #f8fafc;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .q-td {
      padding: 20px 28px;
      border: none;
    }
  }

  .employee-cell {
    .employee-info {
      .employee-name {
        font-weight: 600;
        color: #1e293b;
        font-size: 15px;
        margin-bottom: 8px;
      }

      .employee-badge {
        .q-chip {
          font-size: 12px;
          font-weight: 500;
          border-radius: 8px;
          padding: 4px 12px;
        }
      }
    }
  }

  .date-cell {
    .date-range {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: #475569;
      gap: 8px;

      .date-item {
        font-weight: 500;
      }

      .date-separator {
        color: #9ca3af;
        font-weight: 600;
      }
    }
  }

  .duration-cell {
    .duration-text {
      font-weight: 700;
      color: #6366f1;
      font-size: 14px;
      background: #eef2ff;
      padding: 6px 12px;
      border-radius: 8px;
      display: inline-block;
    }
  }

  .reason-cell {
    .reason-text {
      font-size: 14px;
      color: #475569;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
    }
  }

  .status-cell {
    .status-wrapper {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;

      .status-text {
        font-size: 14px;
        font-weight: 600;
        color: #475569;
      }
    }
  }

  .action-cell {
    .action-buttons {
      display: flex;
      gap: 8px;

      .action-btn {
        min-width: 32px;
        min-height: 32px;
        padding: 0;
        border-radius: 50%;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(99, 102, 241, 0.1);
          transform: scale(1.05);
        }
      }
    }
  } 
}
</style>