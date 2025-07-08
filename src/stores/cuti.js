import { defineStore } from 'pinia'

export const useCutiStore = defineStore('cuti', {
  state: () => ({
    daftarCuti: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchCuti() {
      this.loading = true
      this.error = null
      try {
        const url = import.meta.env.PROD
          ? '/cuti.json'
          : 'http://localhost:3002/cuti'

        const res = await fetch(url)
        if (!res.ok) throw new Error('Gagal mengambil data cuti')
        this.daftarCuti = await res.json()
      } catch (err) {
        this.error = err.message
        console.error('Error fetch cuti:', err)
      } finally {
        this.loading = false
      }
    }
  }
})