<!-- Єдина сторінка застосунку: пошук міста і список відстежуваних міст. -->
<template>
  <q-page padding>
    <div class="page-content">
      <!-- @select — підписка на подію компонента; передаємо місто в store. -->
      <CitySearch @select="store.addCity" />

      <div class="row items-center justify-between q-mt-lg q-mb-md">
        <div class="text-h6">Відстежувані міста</div>
        <q-btn
          flat
          color="primary"
          icon="refresh"
          label="Оновити"
          :disable="store.cities.length === 0"
          @click="store.refreshAll"
        />
      </div>

      <div v-if="store.cities.length === 0" class="text-grey-7">
        Список порожній. Знайдіть місто через поле пошуку.
      </div>

      <!-- v-for з :key — Vue за id відрізняє картки при додаванні/видаленні. -->
      <div class="row q-col-gutter-md">
        <div v-for="city in store.cities" :key="city.id" class="col-12 col-sm-6 col-md-4">
          <CityCard :city="city" @remove="store.removeCity(city.id)" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCitiesStore } from '@/stores/cities.js'
import CitySearch from '@/components/CitySearch.vue'
import CityCard from '@/components/CityCard.vue'

const store = useCitiesStore()

// onMounted — виконується один раз, коли сторінка з'явилась на екрані.
// Список міст уже відновлено з localStorage, тут лише завантажуємо свіжі показники.
onMounted(() => {
  store.refreshAll()
})
</script>

<style scoped lang="scss">
.page-content {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
