<template>
      <svg xmlns="http://www.w3.org/2000/svg" :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }"
           class="w-5 h-5" viewBox="0 0 512 512">
        <path fill="currentColor"
              d="M472 168H40a24 24 0 0 1 0-48h432a24 24 0 0 1 0 48m-80 112H120a24 24 0 0 1 0-48h272a24 24 0 0 1 0 48m-96 112h-80a24 24 0 0 1 0-48h80a24 24 0 0 1 0 48" />
      </svg>
  
      <select id="roleFilter" v-model="internalValue" @change="emitChange"
              class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white">
        <option value="">{{ $t('all') }}</option>
        <option v-for="role in roles" :key="role.id" :value="role.id">
          {{ role.name }}
        </option>
      </select>
  </template>
  
  <script>
  export default {
    props: {
      modelValue: {
        type: [String, Number], 
        required: true
      },
      roles: {
        type: Array,
        required: true
      },
      isDarkMode: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue', 'change'],
    computed: {
      internalValue: {
        get() {
          return this.modelValue;
        },
        set(value) {
          this.$emit('update:modelValue', value);
        }
      }
    },
    methods: {
      emitChange() {
        this.$emit('change', this.internalValue);
      }
    }
  }
  </script>
  