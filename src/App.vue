<template>
  <VApp class="appContainer">
    <VMain class="mainContainer">
      <RouterView />
      <ThemeView />
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import ThemeView from './views/components/theme_view.vue';
</script>
