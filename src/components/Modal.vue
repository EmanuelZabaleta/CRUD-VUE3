<template>
    <div v-if="isOpen" class="fixed inset-0 z-30 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center">
      <div ref="modalRef"
        class="w-full max-h-screen px-6 py-4 overflow-hidden bg-white rounded-t-lg dark:bg-gray-800 sm:rounded-lg sm:m-4 sm:max-w-xl flex flex-col"
        role="dialog">
        <header class="flex justify-end">
          <button @click="cancelAction"
            class="inline-flex items-center justify-center w-6 h-6 text-gray-400 transition-colors duration-150 rounded dark:hover:text-gray-200 hover:text-gray-700"
            aria-label="close">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" role="img" aria-hidden="true">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd" fill-rule="evenodd"></path>
            </svg>
          </button>
        </header>
        <div class="modal-content flex-1 mt-4 mb-6 max-h-96 overflow-auto">
          <p class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300">{{ title }}</p>
          <slot></slot>
        </div>
        <footer class="flex flex-col items-center justify-end px-6 py-3 -mx-6 -mb-4 space-y-4 sm:space-y-0 sm:space-x-6 sm:flex-row bg-gray-50 dark:bg-gray-800">
          <button @click="cancelAction"
            class="w-full px-5 py-3 text-sm font-medium leading-5 text-black border-black transition-colors duration-150 border dark:border-white rounded-lg dark:text-white sm:px-4 sm:py-2 sm:w-auto active:bg-transparent dark:hover:border-white dark:focus:border-white active:text-white focus:outline-none focus:shadow-outline-red">
            {{ cancel }}
          </button>
          <button @click="confirmAction"
          :class="[isDeleteModal ? 'bg-red-600 hover:bg-red-700 active:bg-red-600 focus:shadow-outline-red' : 'bg-green-600 hover:bg-green-700 active:bg-green-600 focus:shadow-outline-green']"
          class="w-full px-5 py-3 text-sm font-medium leading-5 text-white transition-colors duration-150 border border-transparent rounded-lg sm:w-auto sm:px-4 sm:py-2 focus:outline-none">
          {{ accept }}
        </button>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n';
  import { computed } from 'vue';

  const { t } = useI18n();

  const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: ''
  },
  confirmAction: {
    type: Function,
    required: true,
  },
  isDeleteModal: {
    type: Boolean,
    default: false, // Por defecto, el modal no es de eliminación
  },
});

const emit = defineEmits(['close']);

const cancelAction = () => {
  emit('close');
};

const cancel = computed(() => {
  return props.placeholder || t('cancel');
});

const accept = computed(() => {
  return props.placeholder || t('accept');
});
  </script>
  <style scoped>
  .modal-content {
    /* Ajusta el máximo alto según tus necesidades */
    max-height: 80vh; 
    overflow-y: auto;
  }
  </style>