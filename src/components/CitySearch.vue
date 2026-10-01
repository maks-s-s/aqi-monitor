<template>
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

    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-item-label>{{ scope.opt.name }}</q-item-label>
          <q-item-label caption>{{ describeCity(scope.opt) }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

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

const emit = defineEmits(['select'])

const options = ref([])
const message = ref('')

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

function describeCity (city) {
  return [city.admin1, city.admin2, city.country].filter(Boolean).join(', ')
}
</script>
