import { defineStore } from 'pinia'
import { fetchAirQuality } from '@/services/airQualityApi.js'

const STORAGE_KEY = 'aqi-monitor-cities'

function loadSavedCities () {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
    return saved.map((city) => ({ ...city, air: null, loading: false, error: null }))
  } catch {
    return []
  }
}

export const useCitiesStore = defineStore('cities', {
  state: () => ({
    // id, name, admin1, country, latitude, longitude, air, loading, error
    cities: loadSavedCities()
  }),

  actions: {
    save () {
      const data = this.cities.map(({ id, name, admin1, country, latitude, longitude }) =>
        ({ id, name, admin1, country, latitude, longitude }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    },

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

    async loadAirQuality (id) {
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

    async refreshAll () {
      await Promise.all(this.cities.map((city) => this.loadAirQuality(city.id)))
    }
  }
})
