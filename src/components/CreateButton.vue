<template>
    <button
      @click="handleClick"
      class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-purple"
    >
      {{ label }}
    </button>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n';
  import { computed } from 'vue';

  const { t } = useI18n();

  const props = defineProps({
    label: {
      type: String,
      default: '' 
    },
    onClick: {
      type: Function,
      required: true,
    },
  });
  const label = computed(() => {
    return props.label || t('labelButtonCreate');
});
  // Maneja el evento click
  function handleClick() {
    props.onClick();
  }
  </script>
  