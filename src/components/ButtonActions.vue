<template>
    <button
      :class="[
        'w-full px-5 py-3 text-sm font-medium leading-5 transition-colors duration-150 border rounded-lg sm:px-4 sm:py-2 sm:w-auto active:bg-transparent focus:outline-none focus:shadow-outline-red',
        buttonClasses,
        { 'dark:text-white': darkMode, 'active:text-white': activeTextWhite }
      ]"
      @click="onClick"
    >
      <slot />
    </button>
  </template>
  
  <script setup>
  import { computed } from 'vue';


  const props = defineProps({
    textColor: {
      type: String,
      default: 'text-blue-500',
    },
    borderColor: {
      type: String,
      default: 'border-blue-500',
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    activeTextWhite: {
      type: Boolean,
      default: true,
    },
  });
  
  const emit = defineEmits(['click']);
  
  const onClick = () => {
    emit('click');
  };
  
  const buttonClasses = computed(() => {
    return `${props.textColor} ${props.borderColor} dark:border-${props.borderColor.replace(
      'text-',
      ''
    )} dark:hover:border-white dark:focus:border-white`;
  });
  </script>

  