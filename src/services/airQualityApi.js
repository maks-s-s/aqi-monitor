// Сервісний шар: усі HTTP-запити до Open-Meteo (геокодування та якість повітря).
// Використовується вбудований fetch — без axios: зайва залежність не потрібна,
// а fetch однаково працює в браузері, Electron і WebView Android.

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'

// Показники, які запитуємо в Air Quality API.
const AIR_QUALITY_FIELDS = 'european_aqi,us_aqi,pm10,pm2_5,ozone,nitrogen_dioxide'

// Спільна функція GET-запиту. fetch кидає виняток лише при збої мережі,
// а HTTP-помилки (4xx/5xx) треба перевіряти вручну через response.ok.
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

// Пошук міст за назвою. Повертає масив збігів (може бути порожнім).
export async function searchCities (name) {
  // URLSearchParams коректно кодує кирилицю та пробіли в назві міста.
  const params = new URLSearchParams({
    name,
    count: 5,
    language: 'uk',
    format: 'json'
  })
  const data = await getJson(`${GEOCODING_URL}?${params}`)

  // Якщо нічого не знайдено, ключ results у відповіді відсутній зовсім
  // (а не порожній масив), тому повертаємо [] самі.
  return data.results ?? []
}

// Поточні показники якості повітря за координатами.
// Повертає { values, units }: values — значення (окремі можуть бути null),
// units — одиниці виміру з current_units.
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
