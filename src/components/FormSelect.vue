<template>
    <div class="mb-4">
      <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</label>
      <select v-model="selectedValue" :id="id"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
              :required="required">
        <option v-for="option in options" :key="option.id" :value="option.id">
          {{ option.name }}
        </option>
      </select>
      <div v-if="errors && errors.length" class="mt-1 text-red-600 text-sm">
        {{ errors[0] }}
    </div>
    </div>
  </template>
  
  <script setup>
  import {computed } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: [String, Number,null],
      required: true,
    },
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    errors: {
    type: Array,
    default: () => [],
  },
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const selectedValue = computed({
    get() {
      return props.modelValue;
    },
    set(value) {
      emit('update:modelValue', value);
    },
  });
  </script>
  