<template>
  <DashboardLayout>
    <template v-slot:default>
      <div class="my-6 px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <p class="text-lg text-black dark:text-white text-center">
          {{ $t('welcome') }}, {{ user?.name }}
        </p>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { useStore } from 'vuex';
import DashboardLayout from '@/components/DashboardLayout.vue';

const store = useStore();
const user = store.getters.user;

</script>
