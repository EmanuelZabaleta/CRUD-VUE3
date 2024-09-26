<template>
  <DashboardLayout>
    <template v-slot:default>
      <h4 class="mb-4 mt-6 text-lg font-semibold text-gray-600 dark:text-gray-300 text-center">
        {{ $t('accountDeleted') }}
      </h4>
      <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <p class="text-sm text-black dark:text-white">
          *{{ $t('note') }}: {{ $t('orderUserNote') }}
        </p>
        <div class="flex flex-col sm:flex-row mt-2 items-center sm:items-center">
          <DangerIcon class="w-8 h-8 mb-2 sm:mb-0" />
          <p class="ml-0 sm:ml-2 text-sm text-black dark:text-white">
            {{ $t('noteDeleteCustomer') }}
          </p>
        </div>
      </div>
      <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="my-3">
          <!-- Contenedor para SearchBar y CreateButton -->
          <div class="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div class="flex w-full md:w-auto items-center space-x-3">
              <SearchBar v-model="searchTerm" @input="onSearch" :isDarkMode="isDarkMode" />
            </div>
          </div>
        </div>
        <DataTable :items="users" :columns="columns" @sortByDate="sortByDate">
          <template #status="{ item }">
            <td class="pl-5 pr-3 whitespace-no-wrap flex items-center">
              <span :class="{
                'bg-green-500': item.status === 'Active',
                'bg-red-500': item.status === 'Inactive',
                'bg-orange-500': item.status === 'Suspended'
              }" class="w-3 h-3 rounded-full mr-2"></span>
              <div class="text-black dark:text-white">{{ item.status }}</div>
            </td>
          </template>
          <template #created_at="{ item }">
            <td class="pl-5 pr-3 whitespace-no-wrap">
              <div class="text-black dark:text-white">{{ new
                Date(item.created_at).toLocaleDateString() }}</div>
              <div class="text-black dark:text-white">{{ new
                Date(item.created_at).toLocaleTimeString() }}</div>
            </td>
          </template>
          <template #actions="{ item }">
            <div class="flex items-center space-x-4 text-sm">
              <ButtonActions :textColor="'text-blue-500'" :borderColor="'border-blue-500'"
                @click="restoreCustomer(item.id)" :darkMode="true">{{ $t('restore') }}</ButtonActions>
              <DeleteButton :item="item" :openDeleteModal="openDeleteModal" />
            </div>
          </template>
        </DataTable>
        <PaginationControl :currentPage="currentPage" :totalPages="totalPages" @go-to-page="goToPage" />
      </div>
      <!-- Confirmar Eliminación -->
      <Modal :isOpen="isDeleteModalOpen" :title="$t('confirmDelete')" :confirmAction="deleteCustomer"
        @close="closeDeleteModal" :isDeleteModal="true">
        <div class="flex flex-col items-center">
          <DangerIcon class="mb-2" /> <!-- O cualquier margen inferior que desees -->
          <p class="text-sm text-black dark:text-white">
            {{ $t('noteDeleteCustomer') }}
          </p>
        </div>
        <p class="text-sm text-black dark:text-white mt-6">
          {{ $t('messageDelete') }} <span class="text-red-500 font-bold">
            {{ selectedCustomer.name }}
          </span> ?
        </p>
      </Modal>
      <!-- Fin del Modal de Confirmación de Eliminación -->

    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import DashboardLayout from '@/components/DashboardLayout.vue';
import Modal from '@/components/Modal.vue';
import axios from '@/plugins/axios';
import DataTable from '@/components/DataTable.vue';
import DeleteButton from '@/components/DeleteButton.vue';
import SearchBar from '@/components/SearchBar.vue';
import { isDarkMode } from '@/utils/theme';
import PaginationControl from '@/components/PaginationControl.vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import DangerIcon from '@/components/icons/DangerIcon.vue';
import ButtonActions from '@/components/ButtonActions.vue';

const { t } = useI18n();

const columns = computed(() => [
  { key: 'account_number', label: t('account_number') },
  { key: 'name', label: t('name') },
  { key: 'lastname', label: t('lastname') },
  { key: 'national_id', label: t('national_id') },
  { key: 'status', label: t('status') },
  { key: 'created_at', label: t('registered') },
  { key: 'actions', label: t('actions') }
]);


const users = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const searchTerm = ref('');
const sortOrder = ref('desc');



const fetchDeletedCustomers = async (page = 1, searchTerm = '',) => {
  try {
    const response = await axios.get(`/customers/trashed`, {
      params: {
        page: page,
        search: searchTerm,
        order: sortOrder.value,
      }
    });
    users.value = response.data.data.data;
    totalPages.value = response.data.data.last_page;
    currentPage.value = page;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchDeletedCustomers(page, searchTerm.value,);
  }
};

const onSearch = () => {
  fetchDeletedCustomers(1, searchTerm.value,);
};

const sortByDate = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  fetchDeletedCustomers(currentPage.value, searchTerm.value,);
};


//////////////////////////Restaurar cliente//////////////////////////
const restoreCustomer = async (customerId) => {
  const toast = useToast();
  try {
    // Enviar solicitud para restaurar el cliente
    await axios.put(`/customers/${customerId}/restore`);
    toast.success(t('userRestored'));
    // Actualizar la lista de clientes eliminados
    fetchDeletedCustomers();
  } catch (error) {
    toast.error(t('errorRestoringUser'));
    console.error('Error al restaurar el cliente:', error);
  }
};

onMounted(() => {
  fetchDeletedCustomers();
});

//////////////////////////eliminacion de cliente//////////////////////////
const isDeleteModalOpen = ref(false);
const selectedCustomer = ref(null);

const openDeleteModal = (customer) => {
  selectedCustomer.value = customer;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedCustomer.value = null;
};

const deleteCustomer = async () => {
  const toast = useToast();
  try {
    await axios.delete(`/customers/${selectedCustomer.value.id}/force`);
    fetchDeletedCustomers();
    closeDeleteModal();
    toast.success(t('deleteCustomer'));
  } catch (error) {
    toast.error(t('errorDeleteUser'));
    console.error('Error al eliminar el usuario:', error);
  }
};

</script>