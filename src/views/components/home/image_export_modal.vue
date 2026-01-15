<template>
  <VCard>
    <VCardTitle>
      <span class="text-h5">Export Image</span>
    </VCardTitle>

    <VCardText>
      <VContainer>
        <VRow>
          <!-- Image Format Select -->
          <VCol cols="12">
            <VSelect
              v-model="format"
              :items="formatOptions"
              label="Format"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </VCol>

          <!-- Resolution Mode Select -->
          <VCol cols="12">
            <VRadioGroup
              v-model="resolutionMode"
              label="Resolution"
              hide-details
            >
              <VRadio label="Keep original" value="original" />
              <VRadio label="Longest side" value="longestSide" />
            </VRadioGroup>
          </VCol>

          <!-- Longest Side Input -->
          <VCol v-if="longestSideChosen" cols="12">
            <VTextField
              v-model.number="longestSidePx"
              :min="1"
              :max="16384"
              label="Longest side (px)"
              type="number"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </VCol>

          <!-- Compression Slider -->
          <VCol v-if="showCompression" cols="12">
            <VSlider
              v-model="compression"
              :label="`Compression: ${compression}`"
              :min="compressionMin"
              :max="compressionMax"
              :step="1"
              thumb-label
              hide-details
              color="primary"
            />
            <div class="text-caption text-grey">
              {{ compressionHint }}
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </VCardText>

    <VCardActions>
      <VSpacer />
      <VBtn color="grey" variant="text" @click="handleCancel"> Cancel </VBtn>
      <VBtn color="primary" variant="elevated" @click="handleExport">
        Export
      </VBtn>
    </VCardActions>
  </VCard>
</template>

<script setup lang="ts">
import { ImageFormat, type ExportOptions } from '@/models/export_options';
import { ref, computed, watch } from 'vue';

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'export', options: ExportOptions): void;
  (e: 'cancel'): void;
}>();

const formatOptions = [
  { title: 'JPEG', value: ImageFormat.JPEG },
  { title: 'PNG', value: ImageFormat.PNG },
  { title: 'BMP', value: ImageFormat.BMP },
  { title: 'TGA', value: ImageFormat.TGA },
];

const resolutionMode = ref<'original' | 'longestSide'>('longestSide');

const longestSideChosen = computed(() => {
  return resolutionMode.value === 'longestSide';
});

const format = ref<ImageFormat>(ImageFormat.JPEG);
const longestSidePx = ref<number | null>(1920);
const compression = ref<number>(75);

// Computed properties for compression settings
const showCompression = computed(() => {
  return format.value === 'jpeg' || format.value === 'png';
});

const compressionMin = computed(() => {
  return format.value === 'png' ? 1 : 1;
});

const compressionMax = computed(() => {
  return format.value === 'png' ? 9 : 100;
});

const compressionHint = computed(() => {
  if (format.value === 'jpeg') {
    return '1 = lowest quality, 100 = highest quality';
  } else if (format.value === 'png') {
    return '1 = fastest/largest, 9 = slowest/smallest';
  }
  return '';
});

const outputOptions = computed(() => {
  const options: ExportOptions = {
    format: format.value,
    longestSidePx: null,
    compression: compression.value,
  };

  if (['jpeg', 'png'].includes(format.value) && longestSideChosen.value) {
    options.longestSidePx = longestSidePx.value;
  }

  return options;
});

// Watching format change to update compression settings
watch(format, (newValue, oldValue) => {
  if (newValue === 'jpeg') {
    if (compression.value < 1 || compression.value > 100) {
      compression.value = 75; // default for JPEG
    } else if (oldValue === 'png') {
      // Convert PNG compression (1-9) to JPEG compression (1-100)
      compression.value = Math.round(((compression.value - 1) / 8) * 99 + 1);
    }
  } else if (format.value === 'png') {
    if (oldValue === 'jpeg') {
      // Convert JPEG compression (1-100) to PNG compression (1-9)
      compression.value = Math.round(((compression.value - 1) / 99) * 8 + 1);
    } else if (compression.value < 1 || compression.value > 9) {
      compression.value = 6; // default for PNG
    }
  }
});

const handleExport = () => {
  emit('export', outputOptions.value);
};

const handleCancel = () => {
  emit('cancel');
};
</script>
