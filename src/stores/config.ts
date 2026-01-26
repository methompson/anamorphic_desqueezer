import { ref, computed, type Ref } from 'vue';
import { defineStore } from 'pinia';
import {
  isDesqueezeOptions,
  type DesqueezeOptions,
} from '@/models/desqueeze_options';
import {
  ImageFormat,
  isExportOptions,
  type ExportOptions,
} from '@/models/export_options';

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

function getDefaultImageExportOptions(): ExportOptions {
  return {
    format: ImageFormat.JPEG,
    compression: 75,
    longestSidePx: 1920,
  };
}

export const useConfigStore = defineStore('config', () => {
  // #region Desqueeze Config Options
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

  // #endregion

  // #region Image Export Config Options

  const imageExportConfigOptionsRef: Ref<ExportOptions> = ref(
    getDefaultImageExportOptions(),
  );

  const imageExportConfigOptions = computed(
    () => imageExportConfigOptionsRef.value,
  );

  function updateImageExportOptiosn(options: ExportOptions) {
    imageExportConfigOptionsRef.value = { ...options };
    saveImageExportOptions();
  }

  function saveImageExportOptions() {
    localStorage.setItem(
      localStorageImageExportConfigKey,
      JSON.stringify(imageExportConfigOptionsRef.value),
    );
  }

  function retrieveImageExportOptionsFromLocalStorage() {
    try {
      const imageExportConfigRaw = localStorage.getItem(
        localStorageImageExportConfigKey,
      );

      if (!imageExportConfigRaw) {
        return;
      }

      const imageExportConfigObj = JSON.parse(imageExportConfigRaw);
      if (isExportOptions(imageExportConfigObj)) {
        imageExportConfigOptionsRef.value = { ...imageExportConfigObj };
      }
    } catch (e) {
      console.error(
        'Failed to parse image export config from local storage:',
        e,
      );
    }
  }

  // #endregion

  (function init() {
    console.log('Initializing config store');
    retrieveConfigStoreFromLocalStorage();
    retrieveImageExportOptionsFromLocalStorage();
  })();

  return {
    currentDesqueezeOptions,
    updateDesqueezeOptions,
    clearDesqueezeOptions,
    imageExportConfigOptions,
    updateImageExportOptiosn,
    retrieveImageExportOptionsFromLocalStorage,
  };
});
