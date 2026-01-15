<template><span class="themeWatcher"></span></template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

/**
 * Checks if the browser/system is currently in dark mode.
 * Uses the Web API's matchMedia() with the 'prefers-color-scheme: dark' media query
 * @returns {boolean} true if dark mode is active, false otherwise
 */
function isDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function themeChangeWatcher(event: MediaQueryListEvent) {
  if (event.matches) {
    setDarkMode();
  } else {
    setLightMode();
  }
}

function setDarkMode() {
  theme.change('dark');
}

function setLightMode() {
  theme.change('light');
}

function beforeMountHandler() {
  if (isDarkMode()) {
    setDarkMode();
  } else {
    setLightMode();
  }

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', themeChangeWatcher);
}

function beforeUnmountHandler() {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .removeEventListener('change', themeChangeWatcher);
}

onBeforeMount(beforeMountHandler);

onBeforeUnmount(beforeUnmountHandler);
</script>

<style lang="css" scoped>
.themeWatcher {
  display: none;
}
</style>
