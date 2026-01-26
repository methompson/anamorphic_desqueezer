<template>
  <div class="homePageContainer">
    <ImagePreview @canvasLoaded="canvasLoaded" />
    <div class="bottomContainer">
      <DesqueezeConfig
        v-model="desqueezeConfig"
        @exportImage="exportImage"
        :savingImage="savingImage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch, type Ref } from 'vue';

import { WebGLImageViewer } from '@/gl/webgl_image_viewer';

import type { DesqueezeOptions } from '@/models/desqueeze_options';
import type { ExportOptions } from '@/models/export_options';
import { convertAndExportImage } from '@/utils/image_conversion';

import ImagePreview from '@/views/components/home/image_preview.vue';
import DesqueezeConfig from '@/views/components/home/desqueeze_config.vue';
import { useConfigStore } from '@/stores/config';
import debounce from 'lodash.debounce';

const configStore = useConfigStore();

const viewer = ref<WebGLImageViewer | null>(null);

const desqueezeConfig: Ref<DesqueezeOptions | undefined> = ref();

const savingImage = ref(false);

const saveImageConfig = debounce(saveConfig, 500);

function onBeforeMountHandler() {
  desqueezeConfig.value = configStore.currentDesqueezeOptions;
}
onBeforeMount(onBeforeMountHandler);

watch(desqueezeConfig, (newOpt, oldOpt) => {
  if (!viewer.value) {
    console.error('No viewer available yet.');
    return;
  }

  if (newOpt) {
    viewer.value.setDesqueeze(newOpt.desqueezeRatio);
    viewer.value.setDistortion(newOpt.lensDistortion);
    viewer.value.setZoom(newOpt.zoom);
    viewer.value.setBackgroundColor(newOpt.backgroundColor);

    if (newOpt.file && newOpt.file !== oldOpt?.file) {
      viewer.value.loadImage(newOpt.file);
    }
  }

  saveImageConfig();
});

function saveConfig() {
  if (desqueezeConfig.value) {
    configStore.updateDesqueezeOptions(desqueezeConfig.value);
  } else {
    configStore.clearDesqueezeOptions();
  }

  console.log('saved');
}

function canvasLoaded(canvas: HTMLCanvasElement) {
  viewer.value = new WebGLImageViewer(canvas);
}

async function exportImage(options: ExportOptions) {
  if (!viewer.value || !viewer.value.image) {
    console.error('No viewer available yet.');
    return;
  }

  const bmp = viewer.value.exportAsBMP();

  savingImage.value = true;

  await convertAndExportImage(bmp, options);

  savingImage.value = false;
}
</script>

<style scoped>
.homePageContainer {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

@media (min-width: 1200px) {
  .homePageContainer {
    width: auto;
  }
}

/* .topContainer {
  background-color: teal;
  height: 60%;
  width: 100%;
} */

.bottomContainer {
  /* height: 40%; */
  width: 100%;
  overflow: scroll;
}
</style>
