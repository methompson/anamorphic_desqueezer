<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <VApp class="appContainer">
    <VMain class="mainContainer">
      <RouterView />
    </VMain>
  </VApp>
</template>

<style scoped>
.appContainer {
  background-color: blue;
}

.mainContainer {
  background-color: green;
}
</style>
