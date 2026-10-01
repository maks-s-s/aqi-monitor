<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-icon name="air" size="md" />
        <q-toolbar-title>Моніторинг якості повітря</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- атрибуція за ліцензією CC BY 4.0 -->
    <q-footer class="bg-grey-3 text-grey-8">
      <div class="q-pa-sm text-center text-caption">Дані: Open-Meteo.com (CC BY 4.0)</div>
    </q-footer>
  </q-layout>
</template>
