<template>
  <div class="homePageContainer">
    <ImagePreview @canvasLoaded="canvasLoaded" />
    <div class="bottomContainer">
      <DesqueezeConfig
        v-model="desqueezeConfig"
        @exportImage="exportImage"
        :savingImage="savingImage"
        :imageDimensions="imageDimensions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch, type Ref } from 'vue';
import debounce from 'lodash.debounce';

import { WebGLImageViewer } from '@/gl/webgl_image_viewer';

import type { DesqueezeOptions } from '@/models/desqueeze_options';
import type { ExportOptions } from '@/models/export_options';
import { convertAndExportImage } from '@/utils/image_conversion';
import { useConfigStore } from '@/stores/config';

import ImagePreview from '@/views/components/home/image_preview.vue';
import DesqueezeConfig from '@/views/components/home/desqueeze_config.vue';

const configStore = useConfigStore();

const viewer = ref<WebGLImageViewer | null>(null);

const desqueezeConfig: Ref<DesqueezeOptions | undefined> = ref();

const savingImage = ref(false);

interface ImageDimensions {
  width: number;
  height: number;
}
const imageDimensions: Ref<ImageDimensions | undefined> = ref(undefined);

const saveImageConfig = debounce(saveConfig, 500);

function onBeforeMountHandler() {
  desqueezeConfig.value = configStore.currentDesqueezeOptions;
}
onBeforeMount(onBeforeMountHandler);

watch(desqueezeConfig, async (newOpt, oldOpt) => {
  if (!newOpt?.file) {
    // TODO unload WebGL viewer image
    console.log('No file provided.');
  }

  if (!viewer.value) {
    console.error('No viewer available yet.');
    imageDimensions.value = undefined;
    return;
  }

  if (newOpt) {
    viewer.value.setDesqueeze(newOpt.desqueezeRatio);
    viewer.value.setDistortion(newOpt.lensDistortion);
    viewer.value.setZoom(newOpt.zoom);
    viewer.value.setBackgroundColor(newOpt.backgroundColor);

    if (newOpt.file && newOpt.file !== oldOpt?.file) {
      const dimensions = await viewer.value.loadImage(newOpt.file);
      imageDimensions.value = dimensions;
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
