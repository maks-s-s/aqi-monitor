// Pinia-сховище: список відстежуваних міст, збереження в localStorage, завантаження даних.
import { defineStore } from 'pinia'
import { fetchAirQuality } from '@/services/airQualityApi.js'

const STORAGE_KEY = 'aqi-monitor-cities'

// Читає збережений список міст. Якщо даних немає або вони пошкоджені — порожній список.
function loadSavedCities () {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
    // Дані про якість повітря не зберігаємо — вони завантажуються заново при старті.
    return saved.map((city) => ({ ...city, air: null, loading: false, error: null }))
  } catch {
    return []
  }
}

// Options-синтаксис Pinia: state — дані, actions — методи, що їх змінюють
// (аналог полів і методів класу-сервісу в Java). Компоненти, які читають state,
// автоматично перемальовуються після його зміни.
export const useCitiesStore = defineStore('cities', {
  state: () => ({
    // Кожне місто: id, name, admin1, country, latitude, longitude
    // + air ({ values, units } або null), loading, error.
    cities: loadSavedCities()
  }),

  actions: {
    // Зберігає в localStorage лише дані про місто, без показників і службових полів.
    save () {
      const data = this.cities.map(({ id, name, admin1, country, latitude, longitude }) =>
        ({ id, name, admin1, country, latitude, longitude }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    },

    // Додає місто з результатів геокодування. Повторно те саме місто (за id) не додається.
    addCity (geo) {
      if (!this.cities.some((city) => city.id === geo.id)) {
        this.cities.push({
          id: geo.id,
          name: geo.name,
          admin1: geo.admin1,
          country: geo.country,
          latitude: geo.latitude,
          longitude: geo.longitude,
          air: null,
          loading: false,
          error: null
        })
        this.save()
      }
      this.loadAirQuality(geo.id)
    },

    removeCity (id) {
      this.cities = this.cities.filter((city) => city.id !== id)
      this.save()
    },

    // Завантажує показники для одного міста. Помилка зберігається в місті,
    // щоб картка показала її, а решта міст працювала далі.
    async loadAirQuality (id) {
      // Беремо об'єкт саме з this.cities — це реактивна версія, її зміни видно в інтерфейсі.
      const city = this.cities.find((c) => c.id === id)
      city.loading = true
      city.error = null
      try {
        city.air = await fetchAirQuality(city.latitude, city.longitude)
      } catch (error) {
        city.air = null
        city.error = error.message
      } finally {
        city.loading = false
      }
    },

    // Оновлює дані всіх міст паралельно.
    async refreshAll () {
      await Promise.all(this.cities.map((city) => this.loadAirQuality(city.id)))
    }
  }
})
