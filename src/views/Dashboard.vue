<template>
  <q-page class="dashboard-page">
    <!-- Bagian Header dengan Efek Gelembung -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">Dashboard</h1>
        <div class="header-subtitle">Admin Panel - Employee Management System</div>
      </div>
      <div class="header-decoration"></div>
      <!-- Gelembung Dekoratif di Header -->
      <div class="header-bubbles">
        <div class="bubble bubble-1"></div>
        <div class="bubble bubble-2"></div>
        <div class="bubble bubble-3"></div>
      </div>
    </div>

    <!-- Banner Sambutan dengan Gelembung yang Ditingkatkan -->
    <div class="welcome-banner">
      <div class="banner-content">
        <div class="banner-icon">
          <q-icon name="dashboard" />
          <div class="icon-pulse"></div>
        </div>
        <div class="banner-text">
          <div class="banner-greeting">Selamat datang di <span class="brand-name">JepTrack</span></div>
          <div class="banner-description">Berikut ringkasan data pegawai <span class="company-name">Infinity Cinema</span> hari ini</div>
        </div>
      </div>
      <!--  Gelembung pada Banner -->
      <div class="banner-bubbles">
        <div class="bubble-small bubble-s-1"></div>
        <div class="bubble-small bubble-s-2"></div>
        <div class="bubble-small bubble-s-3"></div>
        <div class="bubble-small bubble-s-4"></div>
      </div>
    </div>

    <!--  Kartu Statistik dengan Wadah Gelembung -->
    <div class="stats-grid">
      <div class="stats-card" v-for="(card, index) in cards" :key="index" :class="`card-${index + 1}`">
        <!-- Gelembung Mengambang untuk Kartu Tertentu -->
        <div class="card-bubble-container">
          <div class="card-bubble card-bubble-1" :style="{ backgroundColor: card.color }"></div>
          <div class="card-bubble card-bubble-2" :style="{ backgroundColor: card.color }"></div>
          <div class="card-bubble card-bubble-3" :style="{ backgroundColor: card.color }"></div>
        </div>
        
        <div class="card-background" :style="{ backgroundColor: card.color }"></div>
        <div class="card-content">
          <div class="card-header">
            <div class="card-icon" :style="{ backgroundColor: card.color }">
              <q-icon :name="card.icon" />
              <div class="icon-ripple" :style="{ backgroundColor: card.color }"></div>
            </div>
            <div class="card-trend" v-if="card.diff !== 0">
              <q-icon
                :name="card.diff > 0 ? 'trending_up' : 'trending_down'"
                :class="card.diff > 0 ? 'trend-up' : 'trend-down'"
              />
              <span :class="card.diff > 0 ? 'trend-up' : 'trend-down'">
                {{ Math.abs(card.diff) }}
              </span>
            </div>
          </div>
          <div class="card-body">
            <div class="card-value">{{ card.value }}</div>
            <div class="card-title">{{ card.title }}</div>
          </div>
        </div>
        <div class="card-glow" :style="{ backgroundColor: card.color }"></div>
        
        <!-- Bagian Grafik dengan Efek Gelembung yang Lebih Menonjol -->
        <div v-if="index === 1" class="floating-bubbles">
          <div class="floating-bubble fb-1"></div>
          <div class="floating-bubble fb-2"></div>
          <div class="floating-bubble fb-3"></div>
        </div>
        <div v-if="index === 2" class="floating-bubbles">
          <div class="floating-bubble fb-orange-1"></div>
          <div class="floating-bubble fb-orange-2"></div>
        </div>
      </div>
    </div>

   
    <div class="chart-container">
      <div class="chart-header">
        <div class="chart-title">
          <q-icon name="analytics" class="chart-icon" />
          Kehadiran 7 Hari Terakhir
        </div>
        <div class="chart-subtitle">Monitoring kehadiran pegawai minggu ini</div>
        <!-- Chart Header Bubbles -->
        <div class="chart-bubbles">
          <div class="chart-bubble cb-1"></div>
          <div class="chart-bubble cb-2"></div>
          <div class="chart-bubble cb-3"></div>
          <div class="chart-bubble cb-4"></div>
        </div>
      </div>
      <div class="chart-content">
        <attendance-chart :attendance-data="attendanceLast7Days" />
      </div>
    </div>

    <!-- Dekorasi Bubble Bacground -->
    <div class="background-bubbles">
      <div class="bg-bubble bg-bubble-1"></div>
      <div class="bg-bubble bg-bubble-2"></div>
      <div class="bg-bubble bg-bubble-3"></div>
      <div class="bg-bubble bg-bubble-4"></div>
      <div class="bg-bubble bg-bubble-5"></div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { usePegawaiStore } from '../stores/pegawai';
import AttendanceChart from '../components/AttendanceChart.vue';

const pegawaiStore = usePegawaiStore();

const hadirHariIni = ref(0);
const penilaianTertunda = 18;
const penilaianKemarin = 20;
const attendanceLast7Days = ref([]);

const cards = ref([
  {
    title: 'Total Pegawai',
    value: 'Loading...',
    icon: 'people',
    color: '#1abc9c',
    diff: 0,
  },
  {
    title: 'Hadir Hari Ini',
    value: 'Loading...',
    icon: 'event_available',
    color: '#3498db',
    diff: 0,
  },
  {
    title: 'Penilaian Tertunda',
    value: `${penilaianTertunda} Penilaian`,
    icon: 'assignment_late',
    color: '#e67e22',
    diff: penilaianTertunda - penilaianKemarin,
  },
]);

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

onMounted(async () => {
  // Fetch data pegawai dari store
  await pegawaiStore.fetchPegawai();

  // Fetch data absensi langsung dari API
  const resAbsensi = await fetch('http://localhost:3002/absensi');
  const dataAbsensi = await resAbsensi.json();

  const today = new Date();
  const todayStr = formatDate(today);

  // Hadir hari ini
  const hadirHariIniCount = dataAbsensi.filter(item => item.tanggal === todayStr).length;
  hadirHariIni.value = hadirHariIniCount;

  // Kehadiran 7 hari terakhir
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dStr = formatDate(d);
    const count = dataAbsensi.filter(item => item.tanggal === dStr).length;
    last7Days.push(count);
  }
  attendanceLast7Days.value = last7Days;

  // Update cards
  cards.value = [
    {
      ...cards.value[0],
      value: `${pegawaiStore.daftarPegawai.length} Pegawai`,
    },
    {
      ...cards.value[1],
      value: `${hadirHariIni.value} Pegawai`,
      diff: hadirHariIni.value - (attendanceLast7Days.value[5] || 0),
    },
    cards.value[2],
  ];
});
</script>

<style scoped lang="scss">
// Variabel
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$card-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
$card-shadow-hover: 0 6px 20px rgba(0, 0, 0, 0.12);
$border-radius: 12px;
$transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

.dashboard-page {
  background: linear-gradient(135deg, #f8fafc 0%, #e3f2fd 100%);
  min-height: 100vh;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(180deg, rgba(102, 126, 234, 0.05) 0%, transparent 100%);
    z-index: 0;
  }
}

// Bagian Header dengan Efek Gelembung
.dashboard-header {
  position: relative;
  margin-bottom: 1.5rem;
  z-index: 1;

  .header-content {
    position: relative;
    z-index: 2;
  }

  .dashboard-title {
    font-size: 2.2rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    letter-spacing: -0.5px;
    background: $primary-gradient;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header-subtitle {
    color: #7f8c8d;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .header-decoration {
    position: absolute;
    top: -10px;
    right: 0;
    width: 60px;
    height: 60px;
    background: $primary-gradient;
    border-radius: 50%;
    opacity: 0.1;
    z-index: 1;
  }

  // Gelembung Dekoratif di Header
  .header-bubbles {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    .bubble {
      position: absolute;
      border-radius: 50%;
      background: rgba(102, 126, 234, 0.1);
      animation: float 6s ease-in-out infinite;

      &.bubble-1 {
        width: 20px;
        height: 20px;
        top: 10px;
        right: 80px;
        animation-delay: -1s;
      }

      &.bubble-2 {
        width: 12px;
        height: 12px;
        top: 30px;
        right: 120px;
        animation-delay: -3s;
      }

      &.bubble-3 {
        width: 8px;
        height: 8px;
        top: 50px;
        right: 60px;
        animation-delay: -2s;
      }
    }
  }
}

// Banner Sambutan dengan Gelembung yang Ditingkatkan
.welcome-banner {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: $border-radius;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: $card-shadow;
  transition: $transition;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $card-shadow-hover;

    .banner-bubbles .bubble-small {
      transform: scale(1.1);
    }
  }

  .banner-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    position: relative;
    z-index: 2;
  }

  .banner-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: $primary-gradient;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.4rem;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;

    .icon-pulse {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.3);
      animation: pulse 2s ease-in-out infinite;
    }
  }

  .banner-text {
    flex: 1;
  }

  .banner-greeting {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.125rem;

    .brand-name {
      background: $primary-gradient;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
    }
  }

  .banner-description {
    color: #7f8c8d;
    font-size: 0.85rem;

    .company-name {
      color: #3498db;
      font-weight: 600;
    }
  }

  // Gelembung pada Banner
  .banner-bubbles {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;

    .bubble-small {
      position: absolute;
      border-radius: 50%;
      background: rgba(102, 126, 234, 0.08);
      transition: transform 0.3s ease;

      &.bubble-s-1 {
        width: 16px;
        height: 16px;
        top: 15px;
        right: 20px;
        animation: float 4s ease-in-out infinite;
      }

      &.bubble-s-2 {
        width: 10px;
        height: 10px;
        top: 40px;
        right: 50px;
        animation: float 5s ease-in-out infinite;
        animation-delay: -1s;
      }

      &.bubble-s-3 {
        width: 6px;
        height: 6px;
        top: 25px;
        right: 80px;
        animation: float 3s ease-in-out infinite;
        animation-delay: -2s;
      }

      &.bubble-s-4 {
        width: 12px;
        height: 12px;
        bottom: 20px;
        right: 25px;
        animation: float 4.5s ease-in-out infinite;
        animation-delay: -0.5s;
      }
    }
  }
}

// Kartu Statistik dengan Wadah Gelembung
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stats-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: $border-radius;
  padding: 1.25rem;
  overflow: hidden;
  transition: $transition;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: $card-shadow-hover;

    .card-glow {
      opacity: 0.15;
    }

    .card-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .card-bubble-container .card-bubble {
      transform: scale(1.2);
    }

    .floating-bubbles .floating-bubble {
      animation-play-state: running;
    }
  }

  .card-bubble-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;

    .card-bubble {
      position: absolute;
      border-radius: 50%;
      opacity: 0.05;
      transition: transform 0.3s ease;

      &.card-bubble-1 {
        width: 40px;
        height: 40px;
        top: -10px;
        right: -10px;
      }

      &.card-bubble-2 {
        width: 24px;
        height: 24px;
        top: 20px;
        right: 30px;
      }

      &.card-bubble-3 {
        width: 16px;
        height: 16px;
        bottom: 30px;
        right: 15px;
      }
    }
  }

  .card-background {
    position: absolute;
    top: 0;
    right: 0;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    opacity: 0.03;
    transform: translate(30px, -30px);
  }

  .card-content {
    position: relative;
    z-index: 2;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.875rem;
  }

  .card-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    transition: $transition;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;

    .icon-ripple {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 14px;
      opacity: 0.3;
      animation: ripple 3s ease-in-out infinite;
    }
  }

  .card-trend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.3rem 0.5rem;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .trend-up {
      color: #27ae60;
    }

    .trend-down {
      color: #e74c3c;
    }
  }

  .card-body {
    text-align: left;
  }

  .card-value {
    font-size: 1.6rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.25rem;
    line-height: 1;
  }

  .card-title {
    color: #7f8c8d;
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .card-glow {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    opacity: 0.8;
    transition: $transition;
  }

  // Gelembung Mengambang untuk Kartu Tertentu
  .floating-bubbles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;

    .floating-bubble {
      position: absolute;
      border-radius: 50%;
      animation: floatBubble 8s ease-in-out infinite;
      animation-play-state: paused;

      &.fb-1 {
        width: 8px;
        height: 8px;
        background: rgba(52, 152, 219, 0.3);
        top: 20px;
        left: 20px;
        animation-delay: -2s;
      }

      &.fb-2 {
        width: 6px;
        height: 6px;
        background: rgba(52, 152, 219, 0.25);
        top: 50px;
        left: 40px;
        animation-delay: -4s;
      }

      &.fb-3 {
        width: 4px;
        height: 4px;
        background: rgba(52, 152, 219, 0.2);
        bottom: 30px;
        left: 60px;
        animation-delay: -1s;
      }

      &.fb-orange-1 {
        width: 10px;
        height: 10px;
        background: rgba(230, 126, 34, 0.3);
        top: 25px;
        left: 25px;
        animation-delay: -3s;
      }

      &.fb-orange-2 {
        width: 6px;
        height: 6px;
        background: rgba(230, 126, 34, 0.25);
        bottom: 40px;
        left: 50px;
        animation-delay: -1.5s;
      }
    }
  }

  &.card-1 {
    .card-glow {
      background: linear-gradient(90deg, #1abc9c, #16a085);
    }
  }

  &.card-2 {
    .card-glow {
      background: linear-gradient(90deg, #3498db, #2980b9);
    }
  }

  &.card-3 {
    .card-glow {
      background: linear-gradient(90deg, #e67e22, #d35400);
    }
  }
}

// Bagian Grafik dengan Efek Gelembung yang Lebih Menonjol
.chart-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: $card-shadow;
  transition: $transition;

  &:hover {
    box-shadow: $card-shadow-hover;
    transform: translateY(-1px);

    .chart-bubbles .chart-bubble {
      transform: scale(1.1);
    }
  }

  .chart-header {
    background: $primary-gradient;
    color: white;
    padding: 1.25rem;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      animation: shimmer 3s ease-in-out infinite;
    }

    .chart-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
      position: relative;
      z-index: 2;
    }

    .chart-icon {
      font-size: 1.3rem;
    }

    .chart-subtitle {
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.8rem;
      position: relative;
      z-index: 2;
    }

    .chart-bubbles {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;

      .chart-bubble {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        transition: transform 0.3s ease;

        &.cb-1 {
          width: 20px;
          height: 20px;
          top: 10px;
          right: 30px;
          animation: float 5s ease-in-out infinite;
        }

        &.cb-2 {
          width: 14px;
          height: 14px;
          top: 35px;
          right: 60px;
          animation: float 4s ease-in-out infinite;
          animation-delay: -1s;
        }

        &.cb-3 {
          width: 8px;
          height: 8px;
          top: 20px;
          right: 90px;
          animation: float 6s ease-in-out infinite;
          animation-delay: -2s;
        }

        &.cb-4 {
          width: 12px;
          height: 12px;
          bottom: 15px;
          right: 40px;
          animation: float 4.5s ease-in-out infinite;
          animation-delay: -0.5s;
        }
      }
    }
  }

  .chart-content {
    padding: 1.25rem;
  }
}

.background-bubbles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;

  .bg-bubble {
    position: absolute;
    border-radius: 50%;
    background: rgba(102, 126, 234, 0.03);
    animation: floatBackground 20s ease-in-out infinite;

    &.bg-bubble-1 {
      width: 100px;
      height: 100px;
      top: 10%;
      left: 10%;
      animation-delay: -5s;
    }

    &.bg-bubble-2 {
      width: 60px;
      height: 60px;
      top: 30%;
      right: 15%;
      animation-delay: -10s;
    }

    &.bg-bubble-3 {
      width: 80px;
      height: 80px;
      bottom: 20%;
      left: 20%;
      animation-delay: -15s;
    }

    &.bg-bubble-4 {
      width: 40px;
      height: 40px;
      bottom: 40%;
      right: 30%;
      animation-delay: -8s;
    }

    &.bg-bubble-5 {
      width: 120px;
      height: 120px;
      top: 50%;
      left: 50%;
      animation-delay: -12s;
    }
  }
}

// Animati
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes floatBubble {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-5px) translateX(2px);
  }
  50% {
    transform: translateY(-8px) translateX(-2px);
  }
  75% {
    transform: translateY(-3px) translateX(1px);
  }
}

@keyframes floatBackground {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-40px) translateX(-10px);
  }
  75% {
    transform: translateY(-20px) translateX(5px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.1;
    transform: scale(1.05);
  }
}

@keyframes ripple {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0%, 100% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  50% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

// Responsiv
@media (max-width: 768px) {
  .dashboard-page {
    padding: 1rem;
  }

  .dashboard-title {
    font-size: 1.875rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stats-card {
    padding: 1rem;

    .card-value {
      font-size: 1.4rem;
    }

    .card-icon {
      width: 42px;
      height: 42px;
      font-size: 1.3rem;
    }
  }

  .chart-container {
    .chart-header {
      padding: 1rem;

      .chart-title {
        font-size: 1rem;
      }

      .chart-subtitle {
        font-size: 0.75rem;
      }
    }

    .chart-content {
      padding: 1rem;
    }
  } 
}
</style>