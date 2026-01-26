import { ref, computed, type Ref } from 'vue';
import { defineStore } from 'pinia';
import {
  isDesqueezeOptions,
  type DesqueezeOptions,
} from '@/models/desqueeze_options';

const localStorageDequeezeConfigKey = 'desqueeze_desqueeze_config';
const localStorageImageExportConfigKey = 'image_export_config';

function getDefaultDesqueezeOptions(): DesqueezeOptions {
  return {
    file: undefined,
    desqueezeRatio: 1.0,
    lensDistortion: 0.0,
    zoom: 1.0,
    backgroundColor: '#0923FF',
  };
}

export const useConfigStore = defineStore('config', () => {
  const currentDesqueezeOptionsRef: Ref<DesqueezeOptions> = ref(
    getDefaultDesqueezeOptions(),
  );

  const currentDesqueezeOptions = computed(
    () => currentDesqueezeOptionsRef.value,
  );

  function updateDesqueezeOptions(options: DesqueezeOptions) {
    currentDesqueezeOptionsRef.value = {
      ...options,
      file: undefined,
    };

    saveDesqueezeOptions();
  }

  function saveDesqueezeOptions() {
    localStorage.setItem(
      localStorageDequeezeConfigKey,
      JSON.stringify(currentDesqueezeOptionsRef.value),
    );
  }

  function clearDesqueezeOptions() {
    currentDesqueezeOptionsRef.value = getDefaultDesqueezeOptions();
    saveDesqueezeOptions();
  }

  function retrieveConfigStoreFromLocalStorage() {
    try {
      const desqueezeConfigRaw = localStorage.getItem(
        localStorageDequeezeConfigKey,
      );

      if (!desqueezeConfigRaw) {
        return;
      }

      const desqueezeConfigObj = JSON.parse(desqueezeConfigRaw);
      if (isDesqueezeOptions(desqueezeConfigObj)) {
        currentDesqueezeOptionsRef.value = {
          ...desqueezeConfigObj,
          file: undefined,
        };
      }
    } catch (e) {
      console.error('Failed to parse desqueeze config from local storage:', e);
    }
  }

  (function init() {
    console.log('Initializing config store');
    retrieveConfigStoreFromLocalStorage();
  })();

  return {
    currentDesqueezeOptions,
    updateDesqueezeOptions,
    clearDesqueezeOptions,
  };
});
