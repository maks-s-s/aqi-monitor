// Шкала European AQI (Європейське агентство з довкілля): межі, оцінки, кольори.

// Кожен рівень: верхня межа (включно), оцінка українською, колір фону і колір тексту.
// Колір тексту задано явно: на темних фонах (#960032, #7D2181) — білий, на світлих — темний.
export const AQI_LEVELS = [
  { max: 20, label: 'Добра', color: '#50F0E6', textColor: '#1D1D1D' },
  { max: 40, label: 'Задовільна', color: '#50CCAA', textColor: '#1D1D1D' },
  { max: 60, label: 'Помірна', color: '#F0E641', textColor: '#1D1D1D' },
  { max: 80, label: 'Погана', color: '#FF5050', textColor: '#1D1D1D' },
  { max: 100, label: 'Дуже погана', color: '#960032', textColor: '#FFFFFF' },
  { max: Infinity, label: 'Надзвичайно погана', color: '#7D2181', textColor: '#FFFFFF' }
]

// Рівень для випадку, коли API не повернуло значення AQI (null).
const NO_DATA_LEVEL = { label: 'Немає даних', color: '#E0E0E0', textColor: '#1D1D1D' }

// Повертає { label, color, textColor } для числового значення AQI.
// Значення на межі (наприклад, 20) належить нижчому рівню.
export function getAqiLevel (value) {
  if (value === null || value === undefined) {
    return NO_DATA_LEVEL
  }
  return AQI_LEVELS.find((level) => value <= level.max)
}
