<template>
  <DashboardLayout>
    <template v-slot:default>
      <h2 class="my-6 mt-6 text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center">
        {{ $t('categories') }}
      </h2>
      <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <p class="text-sm text-black dark:text-white">
          *{{ $t('note') }}: {{ $t('orderUserNote') }}
        </p>
      </div>
      <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="my-3 flex justify-between">
          <SearchBar v-model="searchTerm" @input="onSearch" :isDarkMode="isDarkMode" />
          <CreateButton :onClick="openModal" label="Crear" />
        </div>
        <DataTable :items="categories" :columns="columns" @sortByDate="sortByDate">
          <template #actions="{ item }">
            <div class="flex items-center space-x-4 text-sm">
              <EditButton :item="item" :openEditModal="openEditModal" />
              <DeleteButton :item="item" :openDeleteModal="openDeleteModal" />
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
      <!-- Modal -->
      <Modal :isOpen="isModalOpen" :title="$t('newCategorie')" :confirmAction="createCategory" @close="closeModal">
        <form @submit.prevent="createCategory">
          <FormInput v-model="newCategory.name" @input="generateSlug" :label="$t('name')" id="name" required
            :errors="errors.name" :capitalize="true"/>
        </form>
      </Modal>
      <!-- End of modal backdrop -->
      <!-- Confirmar Eliminación -->
      <Modal :isOpen="isDeleteModalOpen" :title="$t('confirmDelete')" :confirmAction="deleteCategory"
        @close="closeDeleteModal" :isDeleteModal="true">
        <p class="text-sm text-black dark:text-white">
          {{ $t('messageDelete') }} <span class="text-red-500 font-bold">
            {{ selectedCategory.name }}
          </span> ?
        </p>
      </Modal>
      <!-- Fin del Modal de Confirmación de Eliminación -->
      <!-- Editar Usuario -->
      <Modal :isOpen="isEditModalOpen" :title="modalTitle" :confirmAction="updateCategory" @close="closeEditModal">
        <form @submit.prevent="updateCategory">
          <FormInput v-model="selectedCategoryEdit.name" :label="$t('name')" id="edit-name" required :errors="errors.name" :capitalize="true"/>
        </form>
      </Modal>
      <!-- End of Edit Modal -->
    </template>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import DashboardLayout from '@/components/DashboardLayout.vue';
import axios from '@/plugins/axios';
import FormInput from '@/components/FormInput.vue';
import Modal from '@/components/Modal.vue';
import DataTable from '@/components/DataTable.vue';
import EditButton from '@/components/EditButton.vue';
import DeleteButton from '@/components/DeleteButton.vue';
import CreateButton from '@/components/CreateButton.vue';
import SearchBar from '@/components/SearchBar.vue';
import { isDarkMode } from '@/utils/theme';
import PaginationControl from '@/components/PaginationControl.vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const columns = computed(() => [
  { key: 'name', label: t('name') },           
  { key: 'created_at', label: t('registered') },
  { key: 'actions', label: t('actions') }     
]);

const categories = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const sortOrder = ref('desc');
const searchTerm = ref('');

const fetchCategories = async (page = 1, searchTerm = '') => {
  try {
    const response = await axios.get(`/categories`, {
      params: {
        page: page,
        search: searchTerm,
        order: sortOrder.value,
      }
    });
    categories.value = response.data.data.data;
    totalPages.value = response.data.data.last_page;
    currentPage.value = page;
  } catch (error) {
    console.error('Error al obtener las categorias:', error);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchCategories(page, searchTerm.value);
  }
};

const sortByDate = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  fetchCategories(currentPage.value, searchTerm.value);
};

const onSearch = () => {
  fetchCategories(1, searchTerm.value); 
};

onMounted(() => {
  fetchCategories();
});

//////////////////////////Crear categoria//////////////////////////
const isModalOpen = ref(false);
const newCategory = ref({ name: '', slug: '' });
const modalRef = ref(null);
const errors = ref({});

const openModal = () => {
  isModalOpen.value = true;
  document.addEventListener('mousedown', handleClickOutside);
};

const closeModal = () => {
  isModalOpen.value = false;
  newCategory.value = {
    name: '',
    slug: ''
  };
  errors.value = {};
  document.removeEventListener('mousedown', handleClickOutside);
};

const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    closeModal();
  }
};

const generateSlug = () => {
  const name = newCategory.value.name;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  newCategory.value.slug = slug;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const createCategory = async () => {
  const toast = useToast();
  try {
    newCategory.value.name = capitalizeFirstLetter(newCategory.value.name.trim());
    await axios.post('/categories', newCategory.value); 
    errors.value = {};
    fetchCategories(); 
    closeModal();
    toast.success(t('createCategorie')); 
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      console.error('Error al crear la categoria:', error);
      toast.error(t('errorCreateCategory')); 
    }
  }
};

//////////////////////////eliminacion de la categoria//////////////////////////
const isDeleteModalOpen = ref(false);
const selectedCategory = ref(null);

const openDeleteModal = (user) => {
  selectedCategory.value = user;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedCategory.value = null;
};

const deleteCategory = async () => {
  const toast = useToast();
  try {
    await axios.delete(`/categories/${selectedCategory.value.id}`);
    fetchCategories();
    closeDeleteModal();
    toast.success(t('deleteCategory')); 
  } catch (error) {
    toast.error(t('errorDeleteCategory')); 
    console.error('Error al eliminar la categoria:', error);
  }
};

//////////////////////////Edicion//////////////////////////
const isEditModalOpen = ref(false);
const selectedCategoryEdit = ref({ id: null, name: '', slug: '' });

const modalTitle = computed(() => {
  return t('editingCategory', { categoryName: selectedCategoryEdit.value.name });
});

const openEditModal = (category) => {
  selectedCategoryEdit.value = { ...category };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedCategoryEdit.value = {
    name: '',
    slug: '',
  };
  errors.value = {};
};

const updateCategory = async () => {
  const toast = useToast();
  if (selectedCategoryEdit.value.id == null) {
    console.error('ID de la categoria no está definido');
    return;
  }
  try {
    selectedCategoryEdit.value.name = capitalizeFirstLetter(selectedCategoryEdit.value.name.trim());
    const slug = selectedCategoryEdit.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await axios.put(`/categories/${selectedCategoryEdit.value.id}`, {
      name: selectedCategoryEdit.value.name,
      slug: slug,
    });
    errors.value = {};
    closeEditModal();
    toast.success(t('editCategory'));
    await fetchCategories();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      toast.error(t('errorEditCategory'));
      console.error('Error al actualizar la categoria:', error);
    }
  }
};
</script>