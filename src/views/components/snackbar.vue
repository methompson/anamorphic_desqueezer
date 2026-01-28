<template>
  <VSnackbarQueue v-model="messagesRef" :closable="true">
    <template #actions="{ props }">
      <VBtn @click="popMessage" v-bind="props"> Close </VBtn>
    </template>
  </VSnackbarQueue>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { storeToRefs } from 'pinia';

const appStore = useAppStore();

const { messagesRef } = storeToRefs(appStore);

function popMessage() {
  messagesRef.value = messagesRef.value.slice(1);
}
</script>
