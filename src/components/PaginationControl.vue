<template>
    <div class="flex justify-center my-4">
      <!-- Botón "Anterior" -->
      <button
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
        :class="[
          'px-4 py-2 mx-1 text-sm font-medium leading-5 border rounded-md',
          currentPage === 1
            ? 'text-gray-400 bg-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600 cursor-not-allowed'
            : 'text-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
        ]"
      >
      {{ $t('previous') }}
      </button>
  
      <!-- Mostrar solo la página actual -->
      <span
        class="px-4 py-2 mx-1 text-sm font-medium leading-5 text-white bg-purple-600 border border-gray-300 rounded-md dark:bg-purple-600 dark:text-gray-300 dark:border-gray-600"
      >
        {{ currentPage }}
      </span>
  
      <!-- Botón "Siguiente" -->
      <button
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
        :class="[
          'px-4 py-2 mx-1 text-sm font-medium leading-5 border rounded-md',
          currentPage === totalPages
            ? 'text-gray-400 bg-gray-200 dark:bg-gray-700 dark:text-gray-500 dark:border-gray-600 cursor-not-allowed'
            : 'text-gray-700 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'
        ]"
      >
      {{ $t('next') }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      currentPage: {
        type: Number,
        required: true,
      },
      totalPages: {
        type: Number,
        required: true,
      },
    },
    methods: {
      goToPage(page) {
        this.$emit('go-to-page', page);
      },
    },
  };
  </script>
  