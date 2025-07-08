<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Props menerima data array angka dari parent
const props = defineProps({
  attendanceData: {
    type: Array,
    required: true,
  },
});

// Membuat data chart reaktif mengikuti props
const chartData = computed(() => ({
  labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
  datasets: [
    {
      label: 'Jumlah Hadir',
      data: props.attendanceData,
      backgroundColor: '#3498db',
    },
  ],
}));

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Kehadiran 7 Hari Terakhir',
    },
  },
};
</script>
