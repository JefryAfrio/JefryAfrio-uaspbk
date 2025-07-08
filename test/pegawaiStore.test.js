import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePegawaiStore } from '../src/stores/pegawai'

describe('Pegawai Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('berhasil mengambil data pegawai dari API', async () => {
    // Simulasi respons dari API
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { id: 1, nama: 'Jefry Afrio' },
            { id: 2, nama: 'Arief Budiman' },
          ]),
      })
    )

    const store = usePegawaiStore()
    await store.fetchPegawai()

    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
    expect(store.daftarPegawai.length).toBe(2)
    expect(store.daftarPegawai[0].nama).toBe('Jefry Afrio')
  })

  it('menangani error saat fetch gagal', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
      })
    )

    const store = usePegawaiStore()
    await store.fetchPegawai()

    expect(store.loading).toBe(false)
    expect(store.error).toBe('Gagal mengambil data pegawai')
    expect(store.daftarPegawai.length).toBe(0)
  })
})
