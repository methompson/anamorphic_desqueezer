<template>
  <VApp class="appContainer">
    <VMain class="mainContainer">
      <RouterView />
      <ThemeView />
      <SnackBar />
    </VMain>
  </VApp>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';

import SnackBar from '@/views/components/snackbar.vue';
import ThemeView from './views/components/theme_view.vue';
</script>
