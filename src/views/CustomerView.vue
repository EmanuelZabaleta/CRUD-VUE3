<template>
  <DashboardLayout>
    <template v-slot:default>
      <h4 class="mb-4 mt-6 text-lg font-semibold text-gray-600 dark:text-gray-300 text-center">
        {{ $t('client') }}
      </h4>
      <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <p class="text-sm text-black dark:text-white">
          *{{ $t('note') }}: {{ $t('orderUserNote') }}
        </p>
      </div>
      <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="my-3">
          <!-- Contenedor para SearchBar y CreateButton -->
          <div class="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div class="flex w-full md:w-auto items-center space-x-3">
              <SearchBar v-model="searchTerm" @input="onSearch" :isDarkMode="isDarkMode" />
              <CreateButton :onClick="openModal" label="Crear" class="-mt-1.5 md:-mt-1.5" />
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
              <EditButton :item="item" :openEditModal="openEditModal" />
              <DeleteButton :item="item" :openDeleteModal="openDeleteModal" />
            </div>
          </template>
        </DataTable>
        <PaginationControl :currentPage="currentPage" :totalPages="totalPages" @go-to-page="goToPage" />
      </div>
      <!-- Crear Cliente -->
      <Modal :isOpen="isModalOpen" :title="$t('createCustomer')" :confirmAction="createCustomer" @close="closeModal">
        <form @submit.prevent="createCustomer">
          <FormInput v-model="newCustomer.name" :label="$t('name')" id="name" required :errors="errors.name" />
          <FormInput v-model="newCustomer.lastname" :label="$t('lastname')" id="lastname" required
            :errors="errors.lastname" />
          <FormInput v-model="newCustomer.address" :label="$t('address')" id="address" required
            :errors="errors.address" />
          <FormInput v-model="newCustomer.phone_number" :label="$t('numberphone')" id="phone_number" required
            :errors="errors.phone_number" />
          <FormInput v-model="newCustomer.birthdate" :label="$t('birthdate')" id="birthdate" required
            :errors="errors.birthdate" type="date" />
          <FormInput v-model="newCustomer.national_id" :label="$t('national_id')" id="national_id" required
            :errors="errors.national_id" />
          <FormSelect v-model="newCustomer.gender" :label="$t('selectGender')" id="gender" :options="genders" required
            :errors="errors.gender" />
          <FormSelect v-model="newCustomer.status" :label="$t('selectStatus')" id="status" :options="status" required
            :errors="errors.status" />
        </form>
      </Modal>
      <!-- End of modal backdrop -->
      <!-- Confirmar Eliminación -->
      <Modal :isOpen="isDeleteModalOpen" :title="$t('confirmDelete')" :confirmAction="deleteUser"
        @close="closeDeleteModal" :isDeleteModal="true">
        <p class="text-sm text-black dark:text-white">
          {{ $t('messageDelete') }} <span class="text-red-500 font-bold">
            {{ selectedCustomer.name }}
          </span> ?
        </p>
      </Modal>
      <!-- Fin del Modal de Confirmación de Eliminación -->
      <!-- Editar Cliente -->
      <Modal :isOpen="isEditModalOpen" :title="$t('editCustomer')" :confirmAction="updateCustomer"
        @close="closeEditModal">
        <form @submit.prevent="updateCustomer">
          <FormInput v-model="selectedCustomerEdit.name" :label="$t('name')" id="name" required :errors="errors.name" />
          <FormInput v-model="selectedCustomerEdit.lastname" :label="$t('lastname')" id="lastname" required
            :errors="errors.lastname" />
          <FormInput v-model="selectedCustomerEdit.address" :label="$t('address')" id="address" required
            :errors="errors.address" />
          <FormInput v-model="selectedCustomerEdit.phone_number" :label="$t('numberphone')" id="phone_number" required
            :errors="errors.phone_number" />
          <FormInput v-model="selectedCustomerEdit.birthdate" :label="$t('birthdate')" id="birthdate" required
            :errors="errors.birthdate" type="date" />
          <FormInput v-model="selectedCustomerEdit.national_id" :label="$t('national_id')" id="national_id" required
            :errors="errors.national_id" />
          <FormSelect v-model="selectedCustomerEdit.gender" :label="$t('selectGender')" id="gender" :options="genders"
            required :errors="errors.gender" />
          <FormSelect v-model="selectedCustomerEdit.status" :label="$t('selectStatus')" id="status" :options="status"
            required :errors="errors.status" />
        </form>
      </Modal>
      <!-- End of Edit Modal -->
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import DashboardLayout from '@/components/DashboardLayout.vue';
import Modal from '@/components/Modal.vue';
import FormInput from '@/components/FormInput.vue';
import axios from '@/plugins/axios';
import DataTable from '@/components/DataTable.vue';
import EditButton from '@/components/EditButton.vue';
import DeleteButton from '@/components/DeleteButton.vue';
import SearchBar from '@/components/SearchBar.vue';
import CreateButton from '@/components/CreateButton.vue';
import { isDarkMode } from '@/utils/theme';
import PaginationControl from '@/components/PaginationControl.vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import FormSelect from '@/components/FormSelect.vue';

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

const genders = [
  { id: 'male', name: t('male') },
  { id: 'female', name: t('female') },
  { id: 'other', name: t('other') },
];

const status = [
  { id: 'Active', name: t('active') },
  { id: 'Inactive', name: t('inactive') },
  { id: 'Suspended', name: t('suspended') },
];



const isModalOpen = ref(false);
const newCustomer = ref({ user_id: '', name: '', lastname: '', address: '', phone_number: '', birthdate: '', national_id: '', status: '', gender: '', });
const modalRef = ref(null);
const users = ref([]);
const errors = ref({});
const currentPage = ref(1);
const totalPages = ref(1);
const searchTerm = ref('');
const sortOrder = ref('desc');



const fetchCustomers = async (page = 1, searchTerm = '',) => {
  try {
    const response = await axios.get(`/customers`, {
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
    fetchCustomers(page, searchTerm.value,);
  }
};

const onSearch = () => {
  fetchCustomers(1, searchTerm.value,);
};

const sortByDate = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  fetchCustomers(currentPage.value, searchTerm.value,);
};



const openModal = () => {
  isModalOpen.value = true;
  document.addEventListener('mousedown', handleClickOutside);
};

const closeModal = () => {
  isModalOpen.value = false;
  newCustomer.value = { user_id: '', name: '', lastname: '', address: '', phone_number: '', birthdate: '', national_id: '', status: '', gender: '', };
  errors.value = {};
  document.removeEventListener('mousedown', handleClickOutside);
};

const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    closeModal();
  }
};



const createCustomer = async () => {
  const toast = useToast();
  try {
    await axios.post('/customers', newCustomer.value);
    errors.value = {};
    fetchCustomers();
    closeModal();
    toast.success(t('messageCreateCustomer'));
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      toast.error(t('messageErrorCreateCustomer'));
      console.error('Error al crear el usuario:', error);
    }
  }

};

onMounted(() => {
  fetchCustomers();
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});



//////////////////////////eliminacion de usaurio//////////////////////////
const isDeleteModalOpen = ref(false);
const selectedCustomer = ref(null);

const openDeleteModal = (user) => {
  selectedCustomer.value = user;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedCustomer.value = null;
};

const deleteUser = async () => {
  const toast = useToast();
  try {
    await axios.delete(`/customers/${selectedCustomer.value.id}`);
    fetchCustomers();
    closeDeleteModal();
    toast.success(t('messageDeleteCustomer'));
  } catch (error) {
    toast.error(t('messageErrorDeleteCustomer'));
    console.error('Error al eliminar el usuario:', error);
  }
};

//////////////////////////edicion de usuarios//////////////////////////
const isEditModalOpen = ref(false);
const selectedCustomerEdit = ref({ user_id: '', name: '', lastname: '', address: '', phone_number: '', birthdate: '', national_id: '', status: '', gender: '', });

const openEditModal = (user) => {
  selectedCustomerEdit.value = { ...user };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedCustomerEdit.value = { user_id: '', name: '', lastname: '', address: '', phone_number: '', birthdate: '', national_id: '', status: '', gender: '', };
  errors.value = {};
};

const updateCustomer = async () => {
  const toast = useToast();
  if (selectedCustomerEdit.value.id == null) {
    console.error('ID de usuario no está definido');
    return;
  }
  try {
    await axios.put(`/customers/${selectedCustomerEdit.value.id}`, {
      user_id: selectedCustomerEdit.value.user_id,
      account_number: selectedCustomerEdit.value.account_number,
      name: selectedCustomerEdit.value.name,
      lastname: selectedCustomerEdit.value.lastname,
      address: selectedCustomerEdit.value.address,
      phone_number: selectedCustomerEdit.value.phone_number,
      birthdate: selectedCustomerEdit.value.birthdate,
      national_id: selectedCustomerEdit.value.national_id,
      status: selectedCustomerEdit.value.status,
      gender: selectedCustomerEdit.value.gender,
    });
    errors.value = {};
    closeEditModal();
    toast.success(t('messageEditCustomer'));
    await fetchCustomers();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      console.error('Error al editar el usuario:', error);
      toast.error(t('messageErrorEditCustomer'));
    }
  }
};
</script>