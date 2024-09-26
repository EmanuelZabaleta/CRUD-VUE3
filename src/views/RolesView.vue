<template>
  <DashboardLayout>
    <template v-slot:default>
      <div class="my-6">
        <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Roles
        </h2>
        <DataTable :items="roles" :columns="columns">
        </DataTable>
      </div>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import DashboardLayout from '@/components/DashboardLayout.vue';
import axios from '@/plugins/axios';
import DataTable from '@/components/DataTable.vue';
import { useI18n } from 'vue-i18n';


const { t } = useI18n();

const columns = computed(() => [
  { key: 'name', label: t('name') },
  { key: 'description', label: t('description') },
]);

const roles = ref([]);

const fetchRoles = async () => {
  try {
    const response = await axios.get('/roles');
    roles.value = response.data.data;
  } catch (error) {
    console.error('Error al obtener los roles:', error);
  }
};

onMounted(() => {
  fetchRoles();
});
</script>