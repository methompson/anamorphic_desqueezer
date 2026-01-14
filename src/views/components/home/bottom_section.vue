<template>
  <VContainer>
    <VRow>
      <VCol :cols="12" class="text-center"> Image Input </VCol>

      <!-- File Input -->
      <VCol :cols="columns" :sm="sm">
        <VFileInput
          v-model="file"
          accept="image/*"
          clearable
          label="Load Image"
          variant="outlined"
          density="compact"
        />
      </VCol>

      <!-- Desqueeze Ratio -->
      <VCol :cols="columns" :sm="sm">
        <SliderNumber
          v-model="desqueezeRatio"
          label="Desqueeze Ratio"
          :min="1"
          :max="2.5"
          :step="0.01"
        />
      </VCol>

      <!-- Lens Distortion -->
      <VCol :cols="columns" :sm="sm">
        <SliderNumber
          v-model="lensDistortion"
          label="Lens Distortion"
          :min="-1"
          :max="1"
          :step="0.01"
        />
      </VCol>

      <!-- Zoom -->
      <VCol :cols="columns" :sm="sm">
        <SliderNumber
          v-model="zoom"
          label="Zoom"
          :min="1"
          :max="2"
          :step="0.01"
        />
      </VCol>

      <!-- Color Picker -->
      <VCol :cols="columns" :sm="sm">
        <VMenu
          v-model="colorMenu"
          :close-on-content-click="false"
          location="end"
        >
          <template #activator="{ props }">
            <VBtn v-bind="props" variant="outlined">
              Select Background Color
            </VBtn>
          </template>

          <VCard>
            <VCardText>
              <VColorPicker
                v-model="color"
                label="Background Color"
                mode="hexa"
                flat
                variant="outlined"
                density="compact"
              />
            </VCardText>

            <VCardActions>
              <VBtn variant="text" text="OK" @click="colorMenu = false" />
            </VCardActions>
          </VCard>
        </VMenu>
      </VCol>

      <!-- Export Image Button -->
      <VCol :cols="columns" :sm="sm" class="buttonContainer">
        <VBtn @click="openExportDialog" variant="outlined"> Export Image </VBtn>

        <VDialog v-model="exportDialog" v-if="exportDialog" max-width="500px">
          <ImageExportModal @cancel="closeExportDialog" @export="saveImage" />
        </VDialog>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';

import type { DesqueezeOptions } from '@/models/desqueeze_options';

import SliderNumber from '@/views/components/slider_number.vue';
import ImageExportModal from '@/views/components/home/image_export_modal.vue';
import type { ExportOptions } from '@/models/export_options';

const columns = 12;
const sm = 6;

const emit = defineEmits<{
  (e: 'change', options: DesqueezeOptions): void;
}>();

const file: Ref<File | undefined> = ref();

watch(file, () => {
  console.log({
    file: file.value,
  });
});

const desqueezeRatio: Ref<number> = ref(1);
const lensDistortion: Ref<number> = ref(0);
const zoom: Ref<number> = ref(1);
const colorMenu: Ref<boolean> = ref(false);

// Stick with yellow for now
const color: Ref<string> = ref('#FF0');

watch([file, desqueezeRatio, lensDistortion, zoom], () => {
  emit('change', {
    file: file.value,
    desqueezeRatio: desqueezeRatio.value,
    lensDistortion: lensDistortion.value,
    zoom: zoom.value,
    backgroundColor: color.value,
  });
});

const exportDialog = ref(false);
function openExportDialog() {
  exportDialog.value = true;
}

function closeExportDialog() {
  exportDialog.value = false;
}

function saveImage(options: ExportOptions) {
  exportDialog.value = false;
}
</script>

<style>
.buttonContainer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
