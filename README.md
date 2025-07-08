LAPORAN UAS PRATIKUM
PEMOGRAMAN BERBASIS KOMPONEN

Dosen Pengampu:
M. Rizki Fadhilah, ST., M.Eng
Asisten Laboratorium:
Cici Wela Sari
Ikhsan Ramadhan
Disusun Oleh:
Jefry Afrio
233510847

PRODI TEKNIK INFORMATIKA
FAKULTAS TEKNIK
UNIVERSITAS ISLAM RIAU
2024/2025


# Infinity Cinema - Sistem Manajemen Pegawai
## Deskripsi Studi Kasus
Infinity Cinema adalah perusahaan yang bergerak di bidang hiburan bioskop dan mempekerjakan banyak pegawai dari berbagai jenjang jabatan, seperti Cinema Manager, Manager, Daily Worker, hingga Cleaning Staff. Dalam operasionalnya, proses kepegawaian seperti presensi, cuti, dan pelaporan masih dilakukan secara manual. Hal ini menimbulkan berbagai kendala, seperti keterlambatan pencatatan, potensi kesalahan data, serta proses administrasi yang tidak efisien.

Solusi:
Untuk mengatasi permasalahan tersebut, dikembangkan Sistem Manajemen Pegawai berbasis web menggunakan Vue.js dan Quasar Framework. Sistem ini memfasilitasi digitalisasi proses kepegawaian secara terpusat, termasuk pencatatan presensi, Keterlambatan Pegawai, manajemen data pegawai, cuti, dan pelaporan kehadiran. Dengan dukungan Pinia sebagai state management dan pengujian menggunakan Vitest, sistem ini dirancang agar lebih efisien, akurat, dan stabil dalam penggunaannya.


## Fitur Utama
**Dashboard**: Menampilkan jumlah total pegawai, kehadiran hari ini, dan penilaian tertunda.
**Data Pegawai**: CRUD data pegawai dengan filter berdasarkan jabatan.
**Presensi Pegawai**: Riwayat kehadiran pegawai berdasarkan tanggal, Keterlambatan Pegawai.
**Manajemen Cuti**: Tambah, edit, hapus cuti secara manual oleh admin.
**Laporan**: Rekap data pegawai lengkap dengan jumlah hadir, Kterlambatan dan cuti.
**Profil**: Informasi singkat mengenai admin.
**Pengaturan**: Mengelola konfigurasi sistem seperti notifikasi, batas cuti, dan mode maintenance.


## Teknologi yang Digunakan
* Vue.js 3
* Quasar Framework
* Pinia (State Management)
* Vitest (Unit Testing)
* JSON Server (Mock API saat development)


## Struktur Menu Navigasi
Struktur navigasi sistem ini disusun secara hierarkis dan logis agar memudahkan pengguna dalam menjelajahi fitur:
- MAIN MENU
  -  Dashboard
  -  Pegawai
- MANAGEMENT
  -  Presensi
  -  Manajemen Cuti
  -  Laporan
- SYSTEM
  -  Profil
  -  Pengaturan
  -  Logout
Routing dikelola menggunakan vue-router dan mode createWebHistory, sehingga URL bersih dan konsisten dengan konvensi SPA (Single Page Application)


## Struktur Folder Proyek (Ringkasan)

```
├── public/
│   ├── pegawai.json
│   ├── absensi.json
│   └── cuti.json
├── src/
│   ├── components/
│   ├── router/
│   ├── stores/
│   ├── views/
│   ├── App.vue
│   └── main.js
├── test/
├── vite.config.js
└── README.md
```

##  Endpoint yang Digunakan (JSON Server) 
Sistem awalnya terhubung dengan REST API lokal menggunakan JSON Server. 
Setiap fitur dikaitkan dengan endpoint sebagai berikut: 
A. Data Pegawai (/pegawai) 
• GET - Mengambil semua data pegawai 
• POST - Menambah pegawai baru 
• PUT /:id - Mengedit pegawai berdasarkan ID 
• DELETE /:id - Menghapus pegawai 
B. Data Presensi (/absensi) 
• GET - Mengambil semua data kehadiran pegawai 
C. Data Cuti (/cuti) 
• GET - Mengambil seluruh data cuti 
• POST - Menambah data cuti baru 
• PUT /:id - Edit data cuti 
• DELETE /:id - Hapus cuti 
D. Untuk Deployment 
Karena Netlify tidak mendukung server backend secara langsung, maka seluruh 
data diubah menjadi file statis .json di dalam folder public, yaitu: 
1. /public/pegawai.json 
2. /public/absensi.json 
3. /public/cuti.json 
Dengan pendekatan ini, sistem dapat tetap berfungsi tanpa server aktif dan tetap 
dapat mengambil data melalui fetch berdasarkan kondisi import.meta.env.PROD. 









##  Manajemen State dengan Pinia 
Manajemen state dalam sistem ini dilakukan menggunakan Pinia, untuk 
memastikan data global dapat dikelola secara reaktif dan efisien. Terdapat tiga store 
utama: 
• stores/pegawai.js: Menyimpan data pegawai yang diambil dari API atau file 
json. 
• stores/absensi.js: Mengelola data kehadiran harian. 
• stores/cuti.js: Menyimpan data cuti pegawai. 
Setiap store: 
• Memiliki state seperti daftar data, loading, dan error. 
• Memiliki actions berupa fungsi asynchronous fetchData(). 
• Didesain kompatibel dengan environment development maupun 
production. 
Contoh struktur fetchData(): 
const url = import.meta.env.PROD 'http:/localhost:3002/pegawai' ? '/pegawai.json' : 
Dengan ini, aplikasi tetap berjalan baik saat offline testing maupun saat deploy ke 
Netlify.


##  Unit Testing dengan Vitest  
Untuk memastikan komponen berjalan sesuai harapan, dilakukan pengujian unit 
pada Dashboard.vue menggunakan: 
• vitest 
• @vue/test-utils 
• @pinia/testing 
Pengujian dilakukan pada: 
• Jumlah total pegawai muncul sesuai dari store. 
• Komponen mampu melakukan render dinamis berdasarkan data dari store. 
Contoh assertion: 
expect(wrapper.html()).toContain('25Pegawai') 
Pengujian ini berhasil berjalan, dan menunjukkan bahwa store dan komponen telah 
terhubung dengan benar. 

##  Kesimpulan
Sistem Manajemen Pegawai Infinity Cinema telah berhasil dibangun dengan 
teknologi modern seperti Vue.js, Quasar, Pinia, dan Vitest. Seluruh instruksi tugas 
akhir telah diselesaikan secara lengkap: 
• Studi kasus realistik dan terstruktur 
• 8 fitur aktif dan fungsional (termasuk login & logout) 
• Konsumsi API melalui JSON Server maupun file JSON statis 
• Pinia store dengan state dan actions 
• Unit testing berhasil dijalankan 
• Dokumentasi dan struktur folder rapi dan profesional 
• Dapat dijalankan secara lokal dan juga siap deploy melalui Netlify 
Dengan demikian, aplikasi ini tidak hanya memenuhi semua kriteria penilaian, 
tetapi juga mencerminkan pemahaman yang mendalam terhadap pengembangan 
aplikasi berbasis komponen modern.   

##  Catatan Tambahan 
Untuk keperluan pengujian aplikasi versi deploy, berikut informasi login admin:

Username: admin@jeptrack.com 
Password: admin123 

