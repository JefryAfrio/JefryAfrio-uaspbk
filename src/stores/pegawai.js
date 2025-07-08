import { defineStore } from 'pinia'

export const usePegawaiStore = defineStore('pegawai', {
  state: () => ({
    daftarPegawai: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchPegawai() {
      this.loading = true
      this.error = null
      try {
        const url = import.meta.env.PROD
          ? '/pegawai.json'
          : 'http://localhost:3002/pegawai'

        const res = await fetch(url)
        if (!res.ok) throw new Error('Gagal mengambil data pegawai')
        this.daftarPegawai = await res.json()
      } catch (err) {
        this.error = err.message
        console.error('Error fetch pegawai:', err)
      } finally {
        this.loading = false
      }
    }
  }
})
