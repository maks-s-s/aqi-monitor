<!-- Поле пошуку міста з випадаючим списком збігів (геокодування Open-Meteo). -->
<template>
  <!--
    q-select з use-input — поле вводу з випадаючим списком.
    @filter викликається при введенні тексту (із затримкою input-debounce),
    поки пошук триває, Quasar сам показує спінер у полі.
  -->
  <q-select
    :model-value="null"
    :options="options"
    option-value="id"
    option-label="name"
    use-input
    hide-selected
    input-debounce="400"
    outlined
    label="Назва міста"
    @filter="onFilter"
    @update:model-value="onSelect"
  >
    <template #prepend>
      <q-icon name="search" />
    </template>

    <!-- Елемент списку: назва + область і країна, щоб розрізняти міста-тезки. -->
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{ scope.opt.name }}</q-item-label>
          <q-item-label caption>{{ describeCity(scope.opt) }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <!-- Показується, коли список збігів порожній: порожній ввід, не знайдено або помилка. -->
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey-8">{{ message }}</q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref } from 'vue'
import { searchCities } from '@/services/airQualityApi.js'

// Компонент не знає про store: він лише повідомляє батькові про вибір міста подією select.
const emit = defineEmits(['select'])

// ref — реактивна змінна: при зміні .value шаблон перемальовується автоматично.
const options = ref([])
const message = ref('')

// Обробник @filter. update(fn) — колбек Quasar: список оновлюється лише після його виклику.
async function onFilter (text, update) {
  const query = text.trim()

  if (query === '') {
    update(() => {
      options.value = []
      message.value = 'Введіть назву міста'
    })
    return
  }

  try {
    const results = await searchCities(query)
    update(() => {
      options.value = results
      message.value = 'Місто не знайдено. Перевірте назву.'
    })
  } catch (error) {
    update(() => {
      options.value = []
      message.value = error.message
    })
  }
}

function onSelect (city) {
  if (city) {
    emit('select', city)
  }
}

// admin1/admin2 можуть бути відсутні — filter(Boolean) відкидає порожні частини.
function describeCity (city) {
  return [city.admin1, city.admin2, city.country].filter(Boolean).join(', ')
}
</script>
