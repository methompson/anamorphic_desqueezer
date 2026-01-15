<template>
  <div class="homePageContainer">
    <TopSection @canvasLoaded="canvasLoaded" />
    <div class="bottomContainer">
      <BottomSection
        v-model="desqueezeConfig"
        @exportImage="exportImage"
        :savingImage="savingImage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';

import { WebGLImageViewer } from '@/gl/webgl_image_viewer';

import TopSection from '@/views/components/home/top_section.vue';
import BottomSection from '@/views/components/home/bottom_section.vue';
import type { DesqueezeOptions } from '@/models/desqueeze_options';
import type { ExportOptions } from '@/models/export_options';
import { convertAndExportImage } from '@/utils/image_conversion';

const viewer = ref<WebGLImageViewer | null>(null);

const desqueezeConfig: Ref<DesqueezeOptions | undefined> = ref();

const savingImage = ref(false);

watch(desqueezeConfig, (newOpt, oldOpt) => {
  if (!viewer.value) {
    console.log('No viewer available yet.');
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
});

function canvasLoaded(canvas: HTMLCanvasElement) {
  viewer.value = new WebGLImageViewer(canvas);
}

async function exportImage(options: ExportOptions) {
  if (!viewer.value || !viewer.value.image) {
    console.log('No viewer available yet.');
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
  height: 40%;
  width: 100%;
  overflow: scroll;
}
</style>
