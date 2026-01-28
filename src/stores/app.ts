import { computed, ref, type Ref } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  text: string;
  timeout: number;
  color: string;
}

export const useAppStore = defineStore('appStore', () => {
  const messagesRef: Ref<Message[]> = ref([]);

  const messages = computed(() => messagesRef);

  function addMessage(message: Omit<Message, 'id'>) {
    console.log('Adding message: ', message);
    const id = uuidv4();

    messagesRef.value.push({
      id,
      ...message,
    });
  }

  function addInfoMessage(text: string, timeout = 5000) {
    return addMessage({ text, timeout, color: 'primary' });
  }
  function addErrorMessage(text: string, timeout = 60000) {
    return addMessage({ text, timeout, color: 'error' });
  }
  function addSuccessMessage(text: string, timeout = 5000) {
    return addMessage({ text, timeout, color: 'success' });
  }

  return {
    messages,
    messagesRef,
    addInfoMessage,
    addErrorMessage,
    addSuccessMessage,
  };
});
