<!-- Картка одного міста: показники якості повітря, колір фону за шкалою AQI. -->
<template>
  <q-card flat bordered :style="{ backgroundColor: level.color, color: level.textColor }">
    <q-card-section class="row items-start no-wrap">
      <div class="col">
        <div class="text-h6">{{ city.name }}</div>
        <div class="text-caption">{{ region }}</div>
      </div>
      <q-btn flat round dense icon="close" aria-label="Видалити" @click="emit('remove')" />
    </q-card-section>

    <!-- v-if / v-else-if / v-else — у DOM потрапляє лише одна з гілок. -->
    <q-card-section v-if="city.loading" class="flex flex-center">
      <q-spinner size="40px" />
    </q-card-section>

    <q-card-section v-else-if="city.error">
      <q-icon name="error_outline" size="sm" class="q-mr-xs" />
      {{ city.error }}
    </q-card-section>

    <q-card-section v-else-if="city.air">
      <div class="text-h3">
        {{ format('european_aqi') }}
      </div>
      <div class="text-subtitle1 q-mb-sm">European AQI: {{ level.label }}</div>

      <div v-for="item in INDICATORS" :key="item.key" class="row justify-between">
        <span>{{ item.label }}</span>
        <span>{{ format(item.key) }}</span>
      </div>

      <div class="text-caption q-mt-sm">Оновлено: {{ city.air.values.time.replace('T', ' ') }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { getAqiLevel } from '@/constants/aqiScale.js'

// props — вхідні дані від батьківського компонента (тільки для читання).
const props = defineProps({
  city: { type: Object, required: true }
})
const emit = defineEmits(['remove'])

// Показники під головним значенням European AQI.
const INDICATORS = [
  { key: 'us_aqi', label: 'US AQI' },
  { key: 'pm2_5', label: 'PM2.5' },
  { key: 'pm10', label: 'PM10' },
  { key: 'ozone', label: 'Озон (O₃)' },
  { key: 'nitrogen_dioxide', label: 'Діоксид азоту (NO₂)' }
]

// computed — значення, що перераховується автоматично при зміні даних, від яких залежить.
// Поки даних немає (завантаження/помилка), getAqiLevel поверне сірий рівень «Немає даних».
const level = computed(() => getAqiLevel(props.city.air?.values.european_aqi))

const region = computed(() =>
  [props.city.admin1, props.city.country].filter(Boolean).join(', '))

// Значення з одиницею виміру з current_units; null (немає даних для точки) — прочерк.
function format (key) {
  const value = props.city.air.values[key]
  if (value === null || value === undefined) {
    return '—'
  }
  return `${value} ${props.city.air.units[key]}`
}
</script>
