<template>
    <div v-if="isScannerOpen" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="relative p-4 rounded-lg shadow-lg max-w-md w-full flex flex-col items-center justify-center">
        <!-- Contenedor centrado -->
        <div id="scanner-container" class="flex items-center justify-center w-full h-72 relative">
          <!-- Contenedor del escáner centrado -->
          <video autoplay="true" preload="auto" src="" muted="true" playsinline="true"
            class="absolute inset-0 w-full h-full object-cover"></video>
          <canvas class="drawingBuffer absolute inset-0 w-full h-full"></canvas>
        </div>
        <div class="absolute bottom-4 left-0 right-0 flex justify-between px-4">
          <!-- Contenedor para los botones -->
          <button @click="onDetect" class="px-4 py-2 bg-blue-600 text-white rounded">{{ $t('buttonDetectCode') }}</button>
          <button @click="onClose" class="px-4 py-2 bg-red-600 text-white rounded">{{ $t('close') }}</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isScannerOpen: {
        type: Boolean,
        required: true
      },
      onDetect: {
        type: Function,
        required: true
      },
      onClose: {
        type: Function,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  #scanner-container {
  width: 100vw;
  height: 100vh;
}
  </style>
  