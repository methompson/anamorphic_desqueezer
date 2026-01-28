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

import { useConfigStore } from '@/stores/config';
import { useAppStore } from '@/stores/app';

import type { DesqueezeOptions } from '@/models/desqueeze_options';
import type { ExportOptions } from '@/models/export_options';

import { convertAndExportImage } from '@/utils/image_conversion';
import { extractExifDataFromImage } from '@/utils/extract_exif';

import ImagePreview from '@/views/components/home/image_preview.vue';
import DesqueezeConfig from '@/views/components/home/desqueeze_config.vue';

const configStore = useConfigStore();
const appStore = useAppStore();

const viewer = ref<WebGLImageViewer | null>(null);

const desqueezeConfig: Ref<DesqueezeOptions | undefined> = ref();

const savingImage = ref(false);

interface ImageDimensions {
  width: number;
  height: number;
}
const imageDimensions: Ref<ImageDimensions | undefined> = ref(undefined);

const saveImageConfig = debounce(saveConfig, 500);

const imageFile: Ref<File | undefined> = ref(undefined);

function onBeforeMountHandler() {
  desqueezeConfig.value = configStore.currentDesqueezeOptions;
}
onBeforeMount(onBeforeMountHandler);

watch(desqueezeConfig, async (newOpt, oldOpt) => {
  try {
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
        imageFile.value = newOpt.file;
        const dimensions = await viewer.value.loadImage(newOpt.file);
        imageDimensions.value = dimensions;
      } else if (!newOpt.file) {
        imageFile.value = undefined;
        viewer.value.unloadImage();
        imageDimensions.value = undefined;
      }
    }

    saveImageConfig();
  } catch (e) {
    console.error('Error applying desqueeze options: ', e);
    appStore.addErrorMessage(`Error applying desqueeze options: ${e}`);
    return;
  }
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
  try {
    const imgFile = imageFile.value;
    if (!viewer.value || !viewer.value.image || !imgFile) {
      console.error('No viewer or file available yet.');
      return;
    }

    const bmp = viewer.value.exportAsBMP();

    savingImage.value = true;

    const exifData = await extractExifDataFromImage(imgFile);
    await convertAndExportImage(bmp, { ...options, exif: exifData });
  } catch (e) {
    console.error('Error exporting image: ', e);
    appStore.addErrorMessage(`Error exporting image: ${e}`);
    return;
  } finally {
    savingImage.value = false;
  }
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
