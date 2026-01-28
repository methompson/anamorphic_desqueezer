<template>
  <VContainer>
    <VRow>
      <VCol :cols="12" class="text-center"> Image Input </VCol>

      <!-- File Input -->
      <VCol :cols="columns" :sm="sm" class="pa-1">
        <VFileInput
          v-model="file"
          accept="image/*"
          clearable
          label="Load Image"
          variant="outlined"
          density="compact"
          hide-details
        />

        <div
          v-if="imageDimensions && file"
          class="text-caption text-center text-grey"
        >
          Original Image Dimensions:
          {{ imageDimensions.width }} x {{ imageDimensions.height }}
        </div>
      </VCol>

      <!-- Desqueeze Ratio -->
      <VCol :cols="columns" :sm="sm" class="pa-1">
        <SliderNumber
          v-model="desqueezeRatio"
          label="Desqueeze Ratio"
          :min="1"
          :max="2.5"
          :step="0.01"
        />
      </VCol>

      <!-- Lens Distortion -->
      <VCol :cols="columns" :sm="sm" class="pa-1">
        <SliderNumber
          v-model="lensDistortion"
          label="Lens Distortion"
          :min="-1"
          :max="1"
          :step="0.01"
        />
      </VCol>

      <!-- Zoom -->
      <VCol :cols="columns" :sm="sm" class="pa-1">
        <SliderNumber
          v-model="zoom"
          label="Zoom"
          :min="1"
          :max="2"
          :step="0.01"
        />
      </VCol>

      <!-- Color Picker -->
      <VCol :cols="columns" :sm="sm" class="pa-1">
        <VRow>
          <VCol class="d-flex align-center"> Background Color </VCol>
          <VCol>
            <input type="color" id="bgColor" v-model="color" />
          </VCol>
        </VRow>
      </VCol>

      <!-- Export Image & Reset Buttons -->
      <VCol :cols="columns" :sm="sm" class="buttonContainer">
        <VBtn variant="outlined" @click="resetOptions"> Reset </VBtn>

        <VBtn
          @click="openExportDialog"
          :disabled="exportButtonDisabled"
          variant="outlined"
        >
          <template v-if="savingImage" v-slot:prepend>
            <VProgressCircular indeterminate :size="20" />
          </template>
          Export Image
        </VBtn>

        <VDialog v-model="exportDialog" v-if="exportDialog" max-width="500px">
          <ImageExportModal @cancel="closeExportDialog" @export="exportImage" />
        </VDialog>
      </VCol>

      <VCol :cols="columns" class="pa-1 pb-8 text-center">
        Version: {{ version }}
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  ref,
  toRefs,
  watch,
  type ModelRef,
  type Ref,
} from 'vue';

import { v4 as uuidv4 } from 'uuid';

import type { DesqueezeOptions } from '@/models/desqueeze_options';
import type { ExportOptions } from '@/models/export_options';

import { useAppStore } from '@/stores/app';

import SliderNumber from '@/views/components/slider_number.vue';
import ImageExportModal from '@/views/components/home/image_export_modal.vue';

const version = __APP_VERSION__;

const columns = 12;
const sm = 6;

const props = withDefaults(
  defineProps<{
    savingImage?: boolean;
    imageDimensions?: { width: number; height: number };
  }>(),
  {
    savingImage: false,
  },
);

const { savingImage, imageDimensions } = toRefs(props);

const emit = defineEmits<{
  (e: 'exportImage', options: ExportOptions): void;
}>();

const appStore = useAppStore();

const file: Ref<File | undefined> = ref();

const model: ModelRef<DesqueezeOptions | undefined> = defineModel();

const desqueezeRatio: Ref<number> = ref(1);
const lensDistortion: Ref<number> = ref(0);
const zoom: Ref<number> = ref(1);
const color: Ref<string> = ref('#0923FF');

// Keep desqueeze ratio to 2 decimal places
watch(desqueezeRatio, (newVal) => {
  if (newVal) {
    desqueezeRatio.value = Number.parseFloat(newVal.toFixed(2));
  }
});
watch(lensDistortion, (newVal) => {
  if (newVal) {
    lensDistortion.value = Number.parseFloat(newVal.toFixed(2));
  }
});
watch(zoom, (newVal) => {
  if (newVal) {
    zoom.value = Number.parseFloat(newVal.toFixed(2));
  }
});

const exportButtonDisabled = computed(() => {
  if (savingImage.value || !file.value) {
    return true;
  }

  return false;
});

watch([file, desqueezeRatio, lensDistortion, zoom, color], () => {
  model.value = {
    file: file.value,
    desqueezeRatio: desqueezeRatio.value,
    lensDistortion: lensDistortion.value,
    zoom: zoom.value,
    backgroundColor: color.value,
  };
});

function resetOptions() {
  appStore.addErrorMessage(uuidv4());
  desqueezeRatio.value = 1;
  lensDistortion.value = 0;
  zoom.value = 1;
}

const exportDialog = ref(false);
function openExportDialog() {
  exportDialog.value = true;
}

function closeExportDialog() {
  exportDialog.value = false;
}

function exportImage(options: ExportOptions) {
  emit('exportImage', options);
  exportDialog.value = false;
}

function beforeMountHandler() {
  const opt = model.value;

  if (opt) {
    desqueezeRatio.value = opt.desqueezeRatio;
    lensDistortion.value = opt.lensDistortion;
    zoom.value = opt.zoom;
    color.value = opt.backgroundColor;
    file.value = opt.file;
  }
}

onBeforeMount(beforeMountHandler);
</script>

<style>
.buttonContainer {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
