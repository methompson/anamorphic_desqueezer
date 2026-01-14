<template>
  <div>
    <span>{{ labelDat }}</span>
    <span class="sliderNumberContainer">
      <VSlider
        v-model="number"
        :min="minDat"
        :max="maxDat"
        :hideDetails="true"
        variant="outlined"
        density="compact"
        class="sliderNumberSlider"
      />

      <VNumberInput
        v-model="number"
        :precision="2"
        :min="minDat"
        :max="maxDat"
        :step="stepDat"
        :hideDetails="true"
        control-variant="stacked"
        variant="outlined"
        density="compact"
        class="sliderNumberInput"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    min?: number;
    max?: number;
    step?: number;
  }>(),
  {
    label: '',
    min: 0,
    max: 100,
    step: 1,
  },
);

const { label, min, max, step } = props;

const emit = defineEmits<{
  (e: 'change', value: number): void;
}>();

const number = defineModel<number>({
  type: Number,
  required: false,
  default: 0,
});

watch(number, (newVal) => {
  emit('change', newVal);
});

const labelDat = ref('');
const minDat = ref(1);
const maxDat = ref(100);
const stepDat = ref(1);

function onMount() {
  if (label) {
    labelDat.value = label;
  }
  if (min) {
    minDat.value = min;
  }
  if (max) {
    maxDat.value = max;
  }
  if (step) {
    stepDat.value = step;
  }

  if (number.value === undefined) {
    number.value = minDat.value;
  }
}

onBeforeMount(onMount);
</script>

<style lang="scss">
.sliderNumberContainer {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.sliderNumberInput {
  max-width: 7em;
}
</style>
