import { defineStore } from 'pinia'

export const useAbsensiStore = defineStore('absensi', {
  state: () => ({
    daftarAbsensi: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchAbsensi() {
      this.loading = true
      this.error = null
      try {
        const url = import.meta.env.PROD
          ? '/absensi.json'
          : 'http://localhost:3002/absensi'

        const res = await fetch(url)
        if (!res.ok) throw new Error('Gagal mengambil data absensi')
        this.daftarAbsensi = await res.json()
      } catch (err) {
        this.error = err.message
        console.error('Error fetch absensi:', err)
      } finally {
        this.loading = false
      }
    }
  }
})
