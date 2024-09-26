<template>
    <div class="relative text-white mb-2">
      <input
        type="search"
        :value="modelValue"
        @input="updateValue"
        :placeholder="placeholderText"
        class="bg-white dark:bg-gray-700 dark:text-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-dashed outline outline-1 text-black"
      />
      <button type="button" class="absolute right-0 top-0 mt-3 mr-4" @click="handleClick">
        <svg
        v-if="svg"
        class="h-4 w-4 fill-current"
        :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }"
        :xmlns="svg.xmlns"
        :viewBox="svg.viewBox"
      >
        <path
          :fill="svg.currentColor"
          :stroke="svg.stroke"
          :stroke-linecap="svg.strokeLinecap"
          :stroke-linejoin="svg.strokeLinejoin"
          :stroke-width="svg.strokeWidth"
          :d="svg.d"
        />
      </svg>
      <svg
        v-else
        class="h-4 w-4 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        viewBox="0 0 56.966 56.966"
        xml:space="preserve"
        width="512px"
        height="512px"
      >
        <path
          fill="currentColor"
          d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"
        />
      </svg>
      </button>
    </div>
  </template>
  
  <script setup>
  import { useI18n } from 'vue-i18n';
  import { computed } from 'vue';

  const { t } = useI18n();
  const props = defineProps({
    modelValue: String,
    placeholder: {
      type: String,
      default: '' 
    },
    isDarkMode: {
      type: Boolean,
      default: false
    },
    clickHandler: {
    type: Function,
    default: () => {}
  },
  svg: {
    type: Object,
    default: null
  }
  });
  // Emit event
const emit = defineEmits(['update:modelValue']);

// Establecer placeholder con traducción
const placeholderText = computed(() => {
  return props.placeholder || t('search');
});

// Update the modelValue
function updateValue(event) {
  emit('update:modelValue', event.target.value);
}
function handleClick(event) {
  props.clickHandler(event);
}
  </script>
  