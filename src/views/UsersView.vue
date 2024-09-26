<template>
  <DashboardLayout>
    <template v-slot:default>
      <h4 class="mb-4 mt-6 text-lg font-semibold text-gray-600 dark:text-gray-300 text-center">
        {{ $t('listOfUsers') }}
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
            <!-- Contenedor para el Select -->
            <div class="flex w-full md:w-auto mt-3 md:mt-0 md:ml-4 items-center space-x-2">
              <SelectButton v-model="selectedRole" :roles="roles" :isDarkMode="isDarkMode" @change="filterByRole" />
            </div>
          </div>
        </div>
        <DataTable :items="users" :columns="columns" @sortByDate="sortByDate">
          <template #rol="{ item }">
            <span
              :class="`${getRoleClass(item.rol?.name)} inline-block text-xs px-2 py-1 font-semibold leading-tight rounded-full`">
              {{ item.rol?.name }}
            </span>
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
              <DeleteButton v-if="item.id !== 1 && item.id !== loggedInUserId" :item="item"
                :openDeleteModal="openDeleteModal" />
            </div>
          </template>
        </DataTable>
        <PaginationControl :currentPage="currentPage" :totalPages="totalPages" @go-to-page="goToPage" />
      </div>
      <!-- Crear Usuario -->
      <Modal :isOpen="isModalOpen" :title="$t('createUser')" :confirmAction="createUser" @close="closeModal">
        <form @submit.prevent="createUser">
          <FormInput v-model="newUser.name" :label="$t('name')" id="name" required :errors="errors.name" :capitalize="true"/>
          <FormInput v-model="newUser.email" label="Email" type="email" id="email" required
            :errors="errors.email" />
          <FormInput v-model="newUser.password" :label="$t('password')" type="password" id="password" required
            :errors="errors.password" />
          <FormSelect v-model="newUser.rol_id" :label="$t('role')" id="rol_id" :options="roles" required
            :errors="errors.rol_id" />
        </form>
      </Modal>
      <!-- End of modal backdrop -->
      <!-- Confirmar Eliminación -->
      <Modal :isOpen="isDeleteModalOpen" :title="$t('confirmDelete')" :confirmAction="deleteUser"
        @close="closeDeleteModal" :isDeleteModal="true">
        <p class="text-sm text-black dark:text-white">
          {{ $t('messageDelete') }} <span class="text-red-500 font-bold">
            {{ selectedUser.name }}
          </span> ?
        </p>
      </Modal>
      <!-- Fin del Modal de Confirmación de Eliminación -->
      <!-- Editar Usuario -->
      <Modal :isOpen="isEditModalOpen" :title="$t('editUser')" :confirmAction="updateUser" @close="closeEditModal">
        <form @submit.prevent="updateUser">
          <FormInput v-model="selectedUserEdit.name" :label="$t('name')" id="edit-name" required :errors="errors.name" :capitalize="true" />
          <FormInput v-model="selectedUserEdit.email" label="Email" type="email" id="edit-email" required
            :errors="errors.email" />
          <FormInput v-model="selectedUserEdit.password" :label="passwordLabel"
            type="password" id="edit-password" />
          <FormSelect v-model="selectedUserEdit.rol_id" :label="$t('role')" id="edit-rol_id" :options="roles" required
            :errors="errors.rol_id" />
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
import FormSelect from '@/components/FormSelect.vue';
import FormInput from '@/components/FormInput.vue';
import axios from '@/plugins/axios';
import DataTable from '@/components/DataTable.vue';
import EditButton from '@/components/EditButton.vue';
import DeleteButton from '@/components/DeleteButton.vue';
import SearchBar from '@/components/SearchBar.vue';
import CreateButton from '@/components/CreateButton.vue';
import SelectButton from '@/components/SelectButton.vue';
import { useStore } from 'vuex';
import { isDarkMode } from '@/utils/theme';
import PaginationControl from '@/components/PaginationControl.vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useStore();
const loggedInUserId = computed(() => store.getters.user?.id);

const columns = computed(() => [
  { key: 'name', label: t('name') },
  { key: 'email', label: 'email'}, 
  { key: 'rol', label: t('role') },
  { key: 'created_at', label: t('registered') }, 
  { key: 'actions', label: t('actions') } 
]);
const passwordLabel = computed(() => `${t('password')}: (${t('passwordHint')})`);

const isModalOpen = ref(false);
const newUser = ref({ name: '', email: '', password: '', rol_id: '' });
const roles = ref([]);
const modalRef = ref(null);
const users = ref([]);
const errors = ref({});
const currentPage = ref(1);
const totalPages = ref(1);
const searchTerm = ref('');
const sortOrder = ref('desc');
const selectedRole = ref('');

const fetchRoles = async () => {
  try {
    const response = await axios.get('/roles');
    roles.value = response.data.data.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Error al obtener los roles:', error);
  }
};

const fetchUsers = async (page = 1, searchTerm = '', roleFilter = '') => {
  try {
    const response = await axios.get(`/users`, {
      params: {
        page: page,
        search: searchTerm,
        order: sortOrder.value,
        role: roleFilter,
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
    fetchUsers(page, searchTerm.value, selectedRole.value);
  }
};

const onSearch = () => {
  fetchUsers(1, searchTerm.value, selectedRole.value); 
};

const sortByDate = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  fetchUsers(currentPage.value, searchTerm.value, selectedRole.value);
};

const filterByRole = () => {
  currentPage.value = 1; 
  fetchUsers(currentPage.value, searchTerm.value, selectedRole.value);
};

const openModal = () => {
  isModalOpen.value = true;
  fetchRoles();
  document.addEventListener('mousedown', handleClickOutside);
};

const closeModal = () => {
  isModalOpen.value = false;
  newUser.value = { name: '', email: '', password: '', rol_id: '' };
  errors.value = {};
  document.removeEventListener('mousedown', handleClickOutside);
};

const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    closeModal();
  }
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const createUser = async () => {
  const toast = useToast();
  try {
    newUser.value.name = capitalizeFirstLetter(newUser.value.name.trim());
    await axios.post('/users', newUser.value);
    errors.value = {};
    fetchUsers();
    closeModal();
    toast.success(t('userCreated'));
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      toast.error(t('errorCreatingUser'));
      console.error('Error al crear el usuario:', error);
    }
  }

};

onMounted(() => {
  fetchUsers();
  fetchRoles();
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

const getRoleClass = (roleName) => {
  switch (roleName) {
    case 'Admin':
      return 'bg-admin';
    case 'Usuario':
      return 'bg-usuario';
    case 'Cajero':
      return 'bg-cajero';
    case 'Gerente de Inventario':
      return 'bg-gerente-inventario';
    case 'Soporte Técnico':
      return 'bg-soporte-tecnico';
    case 'Marketing':
      return 'bg-marketing';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

//////////////////////////eliminacion de usaurio//////////////////////////
const isDeleteModalOpen = ref(false);
const selectedUser = ref(null);

const openDeleteModal = (user) => {
  selectedUser.value = user;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedUser.value = null;
};

const deleteUser = async () => {
  const toast = useToast();
  try {
    await axios.delete(`/users/${selectedUser.value.id}`);
    fetchUsers();
    closeDeleteModal();
    toast.success(t('deleteUser'));
  } catch (error) {
    toast.error(t('errorDeleteUser'));
    console.error('Error al eliminar el usuario:', error);
  }
};

//////////////////////////edicion de usuarios//////////////////////////
const isEditModalOpen = ref(false);
const selectedUserEdit = ref({ id: null, name: '', email: '', password: '', rol_id: null });

const openEditModal = (user) => {
  selectedUserEdit.value = { ...user };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedUserEdit.value = { id: null, name: '', email: '', password: '', rol_id: null };
  errors.value = {};
};

const updateUser = async () => {
  const toast = useToast();
  if (selectedUserEdit.value.id == null) {
    console.error('ID de usuario no está definido');
    return;
  }
  try {
    selectedUserEdit.value.name = capitalizeFirstLetter(selectedUserEdit.value.name.trim());
    await axios.put(`/users/${selectedUserEdit.value.id}`, {
      name: selectedUserEdit.value.name,
      email: selectedUserEdit.value.email,
      password: selectedUserEdit.value.password,
      rol_id: selectedUserEdit.value.rol_id
    });
    errors.value = {};
    closeEditModal();
    toast.success(t('editUserToast'));
    await fetchUsers();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      console.error('Error al editar el usuario:', error);
      toast.error(t('errorEditUser'));
    }
  }
};
</script>

<style scoped>
.bg-admin {
  background-color: #238d23;
  color: #fff;
}

.bg-usuario {
  background-color: #1075b9;
  color: #fff;
}

.bg-cajero {
  background-color: #daf63b;
  color: #000;
}

.bg-gerente-inventario {
  background-color: #5d24fb;
  color: #fff;
}

.bg-soporte-tecnico {
  background-color: #ef4444;
  color: #fff;
}

.bg-marketing {
  background-color: #8b5cf6;
  color: #fff;
}

.inline-block {
  white-space: nowrap;
}

.rounded-full {
  padding: 0.25rem 0.5rem;
  line-height: 1.5;
}
</style>