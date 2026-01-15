<template>
  <canvas id="glCanvas" ref="glCanvas" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const glCanvas = ref<HTMLCanvasElement | null>(null);

const emit = defineEmits<{
  (e: 'canvasLoaded', canvas: HTMLCanvasElement): void;
}>();

watch(glCanvas, (newCanvas) => {
  if (newCanvas) {
    emit('canvasLoaded', newCanvas);
  }
});

// TODOs
// Make new WebGL Image Viewer
// Create canvas
// Accepts options from parent component
// Renders image according to options
// Make option changes reactive
</script>

<style>
#glCanvas {
  flex: 1;
  width: 100%;
  display: block;
  background-color: #1a1a1a;
  touch-action: none;
  min-height: 0; /* Prevent flex item overflow */
}

@media (prefers-color-scheme: light) {
  #glCanvas {
    background-color: #f0f0f0;
  }
}
</style>
