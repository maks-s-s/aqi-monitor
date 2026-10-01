<!-- Основний макет: шапка з назвою та підвал з атрибуцією джерела даних. -->
<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-icon name="air" size="md" />
        <q-toolbar-title>Моніторинг якості повітря</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- router-view — місце, куди роутер підставляє поточну сторінку (IndexPage). -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Атрибуція — вимога ліцензії CC BY 4.0 від Open-Meteo. -->
    <q-footer class="bg-grey-3 text-grey-8">
      <div class="q-pa-sm text-center text-caption">Дані: Open-Meteo.com (CC BY 4.0)</div>
    </q-footer>
  </q-layout>
</template>
