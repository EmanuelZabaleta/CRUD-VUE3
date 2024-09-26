<template>
  <DashboardLayout>
    <template v-slot:default>
      <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200 mt-6 text-center">
        {{ $t('warehouses') }}
      </h2>
      <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <p class="text-sm text-black dark:text-white">
          *{{ $t('note') }}: {{ $t('noteWarehouse') }}
        </p>
      </div>
      <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="my-3 flex justify-between">
          <SearchBar v-model="searchTerm" @input="onSearch" :isDarkMode="isDarkMode" />
          <CreateButton :onClick="openModal" label="Crear" />
        </div>
        <div class="w-full overflow-x-auto">
          <DataTable :items="warehouses" :columns="columns" @sortByDate="sortByDate">
            <template #actions="{ item }">
              <div class="flex items-center space-x-4 text-sm">
                <EditButton  :item="item" :openEditModal="openEditModal" />
                <DeleteButton  :item="item" :openDeleteModal="openDeleteModal" />
              </div>
            </template>
            <template #created_at="{ item }">
              <td class="pl-5 pr-3 whitespace-no-wrap">
                <div class="text-black dark:text-white">{{ new
                  Date(item.created_at).toLocaleDateString() }}</div>
                <div class="text-black dark:text-white">{{ new
                  Date(item.created_at).toLocaleTimeString() }}</div>
              </td>
            </template>
          </DataTable>
          <PaginationControl :currentPage="currentPage" :totalPages="totalPages" @go-to-page="goToPage" />
        </div>
      </div>
      <!-- Crear Almacen -->
      <Modal :isOpen="isModalOpen" :title="$t('newWarehouse')" :confirmAction="createWarehouse" @close="closeModal">
        <form @submit.prevent="createWarehouse">
          <FormInput v-model="newWarehouse.name" :label="$t('name')" id="name" @input="generateSlug" required
            :errors="errors.name" :capitalize="true"/>
          <FormInput v-model="newWarehouse.address" :label="$t('address')" id="address" required :errors="errors.address" />
          <FormInput v-model="newWarehouse.city" :label="$t('city')" id="city" required :errors="errors.city" />
          <FormInput v-model="newWarehouse.state_province" :label="$t('stateProvince')" id="state_province" required
            :errors="errors.state_province" />
          <FormInput v-model="newWarehouse.postal_code" :label="$t('postalCode')" id="postal_code" required
            :errors="errors.postal_code" />
          <FormInput v-model="newWarehouse.country" :label="$t('country')" id="country" required :errors="errors.country" />
        </form>
      </Modal>
      <!-- End of modal backdrop -->
      <!-- Confirmar Eliminación -->
      <Modal :isOpen="isDeleteModalOpen" :title="$t('confirmDelete')" :confirmAction="deleteWarehouse"
        @close="closeDeleteModal" :isDeleteModal="true">
        <p class="text-sm text-black dark:text-white">
          {{ $t('messageDelete') }}
          <span class="text-red-500 font-bold">
            {{ selectedWarehouse.name }}
          </span> ? {{ $t('messagePosDelete') }}
        </p>
      </Modal>
      <!-- Fin del Modal de Confirmación de Eliminación -->
      <!-- Editar almacen -->
      <Modal :isOpen="isEditModalOpen" :title="modalTitle" :confirmAction="updateWarehouse" @close="closeEditModal">
        <form @submit.prevent="updateWarehouse">
          <FormInput v-model="selectedWarehouseEdit.name" :label="$t('name')" id="edit-name" required
            :errors="errors.name" />
          <FormInput v-model="selectedWarehouseEdit.address" :label="$t('address')" id="address" required
            :errors="errors.address" />
          <FormInput v-model="selectedWarehouseEdit.city" :label="$t('city')" id="city" required :errors="errors.city" />
          <FormInput v-model="selectedWarehouseEdit.state_province" :label="$t('stateProvince')" id="state_province"
            required :errors="errors.state_province" />
          <FormInput v-model="selectedWarehouseEdit.postal_code" :label="$t('postalCode')" id="postal_code" required
            :errors="errors.postal_code" />
          <FormInput v-model="selectedWarehouseEdit.country" :label="$t('country')" id="country" required
            :errors="errors.country" />
        </form>
      </Modal>
      <!-- End of Edit Modal -->

    </template>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/components/DashboardLayout.vue';
import axios from '@/plugins/axios';
import { onMounted, ref, computed } from 'vue';
import Cookies from 'js-cookie';
import Modal from '@/components/Modal.vue';
import FormInput from '@/components/FormInput.vue';
import DataTable from '@/components/DataTable.vue';
import EditButton from '@/components/EditButton.vue';
import DeleteButton from '@/components/DeleteButton.vue';
import CreateButton from '@/components/CreateButton.vue';
import SearchBar from '@/components/SearchBar.vue';
import { isDarkMode } from '@/utils/theme';
import PaginationControl from '@/components/PaginationControl.vue';
import { useToast } from 'vue-toastification';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const columns = computed(() => [
  { key: 'name', label: t('name') }, 
  { key: 'country', label: t('country') },
  { key: 'city', label: t('city') },
  { key: 'address', label: t('address') },           // Traducir 'Rol'
  { key: 'created_at', label: t('registered') }, // Traducir 'Registrado'
  { key: 'actions', label: t('actions') }      // Traducir 'Acciones'
]);

const warehouses = ref([]);
const errors = ref({});
const currentPage = ref(1);
const totalPages = ref(1);
const searchTerm = ref('');
const sortOrder = ref('desc');

const fetchWarehouses = async (page = 1, searchTerm = '') => {
  try {
    const response = await axios.get(`/warehouse`, {
      params: {
        page: page,
        search: searchTerm,
        order: sortOrder.value,
      }
    });
    warehouses.value = response.data.data.data;
    totalPages.value = response.data.data.last_page;
    currentPage.value = page;
  } catch (error) {
    console.error('Error al obtener el almacen:', error);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchWarehouses(page, searchTerm.value);
  }
};

const onSearch = () => {
  fetchWarehouses(1, searchTerm.value); // Reiniciar a la primera página en cada búsqueda
};

const sortByDate = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  fetchWarehouses(currentPage.value, searchTerm.value);
};

onMounted(() => {
  fetchWarehouses();
});

//Crear alamcen
const companyId = Cookies.get('company_id');
const isModalOpen = ref(false);
const newWarehouse = ref({ name: '', slug: '', address: '', city: '', state_province: '', postal_code: '', country: '', company_id: companyId });
const modalRef = ref(null);
const store = useStore();

const openModal = () => {
  isModalOpen.value = true;

  // Añadir event listener para clics fuera del modal
  document.addEventListener('mousedown', handleClickOutside);
};

const closeModal = () => {
  isModalOpen.value = false;
  newWarehouse.value = {
    name: '',
    slug: '',
    address: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: '',
    company_id: companyId, // Mantén el company_id en el formulario
  };
  errors.value = {};
  // Eliminar event listener para evitar fugas de memoria
  document.removeEventListener('mousedown', handleClickOutside);
};

const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    closeModal();
  }
};

const generateSlug = () => {
  const name = newWarehouse.value.name;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  newWarehouse.value.slug = slug;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const createWarehouse = async () => {
  const toast = useToast();
  try {
    newWarehouse.value.name = capitalizeFirstLetter(newWarehouse.value.name.trim());
    await store.dispatch('warehouses/createWarehouse', newWarehouse.value); 
    errors.value = {};   
    fetchWarehouses(); // Actualizar la lista de usuarios
    closeModal(); // Cerrar el modal
    toast.success(t('createWarehouse')); 
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      toast.error(t('errorCreateWarehouse')); 
      console.error('Error al crear el almacen:', error);
    }
  }
};

//eliminacion del almacen
const isDeleteModalOpen = ref(false);
const selectedWarehouse = ref(null);

const openDeleteModal = (user) => {
  selectedWarehouse.value = user;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedWarehouse.value = null;
};

const deleteWarehouse = async () => {
  const toast = useToast();
  try {
    await store.dispatch('warehouses/deleteWarehouse', selectedWarehouse.value.id);
    fetchWarehouses();
    closeDeleteModal();
    toast.success(t('deleteWarehouse')); 
  } catch (error) {
    toast.error(t('errorDeleteWarehouse')); 
    console.error('Error al eliminar el almacen:', error);
  }
};

//Edicion
const isEditModalOpen = ref(false);
const selectedWarehouseEdit = ref({ id: null, name: '', slug: '', email: '', password: '', rol_id: null });

const modalTitle = computed(() => {
  return t('editingWarehouse', { warehouseName: selectedWarehouseEdit.value.name });
});

const openEditModal = (warehouse) => {
  // Inicializa selectedUserEdit con los datos del usuario a editar
  selectedWarehouseEdit.value = { ...warehouse };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedWarehouseEdit.value = {
    name: '',
    slug: '',
    address: '',
    city: '',
    state_province: '',
    postal_code: '',
    country: '',
    company_id: companyId,
  }; // Reinicia datos
  errors.value = {};
};

const updateWarehouse = async () => {
  const toast = useToast();
  if (selectedWarehouseEdit.value.id == null) {
    console.error('ID del almacen no está definido');
    return;
  }
  try {
    const slug = selectedWarehouseEdit.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    // Asegúrate de que la URL incluye el ID del usuario
    await store.dispatch('warehouses/updateWarehouse', {
          id: selectedWarehouseEdit.value.id,
          name: selectedWarehouseEdit.value.name,
          address: selectedWarehouseEdit.value.address,
          city: selectedWarehouseEdit.value.city,
          state_province: selectedWarehouseEdit.value.state_province,
          postal_code: selectedWarehouseEdit.value.postal_code,
          country: selectedWarehouseEdit.value.country,
          slug: slug,
        });
    errors.value = {};
    closeEditModal();
    await fetchWarehouses();
    toast.success(t('editWarehouse'));
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors; // Actualizar los errores
    } else {
      toast.error(t('errorEditWarehouse'));
      console.error('Error al actualizar el almacen:', error);
    }
  }
};
</script>