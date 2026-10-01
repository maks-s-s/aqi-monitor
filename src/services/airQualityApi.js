const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

const AIR_QUALITY_FIELDS = 'european_aqi,us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide'

// fetch не кидає виняток на 4xx/5xx, тому перевіряємо response.ok
async function getJson (url) {
  let response
  try {
    response = await fetch(url)
  } catch {
    throw new Error('Помилка мережі. Перевірте підключення до інтернету.')
  }
  if (!response.ok) {
    throw new Error(`Сервер повернув помилку (код ${response.status}).`)
  }
  return response.json()
}

export async function searchCities (name) {
  const params = new URLSearchParams({
    name,
    count: 5,
    language: 'uk',
    format: 'json'
  })
  const data = await getJson(`${GEOCODING_URL}?${params}`)

  // якщо нічого не знайдено, ключа results у відповіді немає
  return data.results ?? []
}

export async function fetchAirQuality (latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: AIR_QUALITY_FIELDS,
    timezone: 'auto'
  })
  const data = await getJson(`${AIR_QUALITY_URL}?${params}`)

  return {
    values: data.current,
    units: data.current_units
  }
}
