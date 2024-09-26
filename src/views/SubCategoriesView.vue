<template>
  <DashboardLayout>
    <template v-slot:default>
      <h2 class="mb-4 mt-6 text-lg font-semibold text-gray-600 dark:text-gray-300 text-center">
        {{ $t('subcategories') }}
      </h2>
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
              <SelectButton v-model="selectedCategories" :roles="categories" :isDarkMode="isDarkMode" @change="filterByCategory" />
            </div>
          </div>
        </div>
        <div class="w-full overflow-x-auto">
          <DataTable :items="subcategories" :columns="columns" @sortByDate="sortByDate">
            <template #category="{ item }">
              <span class=" px-2 py-1 leading-tight rounded-full">
                {{ item.category?.name }}
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
                <DeleteButton :item="item" :openDeleteModal="openDeleteModal" />
              </div>
            </template>
          </DataTable>
          <PaginationControl :currentPage="currentPage" :totalPages="totalPages" @go-to-page="goToPage" />
        </div>
      </div>
      <!-- Crear subcategoria -->
      <Modal :isOpen="isModalOpen" :title="$t('newSubcategorie')" :confirmAction="createSubCategory" @close="closeModal">
        <form @submit.prevent="createSubCategory">
          <FormInput v-model="newSubCategory.name" @input="generateSlug" :label="$t('name')" id="name" required
            :errors="errors.name" :capitalize="true"/>
          <FormSelect v-model="newSubCategory.category_id" :label="$t('categorie')" id="rol_id" :options="categories" required
            :errors="errors.category_id" />
        </form>
      </Modal>
      <!-- End of modal backdrop -->
      <!-- Confirmar Eliminación -->
      <Modal :isOpen="isDeleteModalOpen" :title="$t('confirmDelete')" :confirmAction="deleteSubcategoria"
        @close="closeDeleteModal" :isDeleteModal="true">
        <p class="text-sm text-black dark:text-white">
          {{ $t('messageDelete') }} <span class="text-red-500 font-bold">
            {{ selectedSubCategory.name }}
          </span> ?
        </p>
      </Modal>
      <!-- Fin del Modal de Confirmación de Eliminación -->
      <!-- Editar subcategoria -->
      <Modal :isOpen="isEditModalOpen" :title="modalTitle" :confirmAction="updateSubCategory" @close="closeEditModal">
        <form @submit.prevent="updateSubCategory">
          <FormInput v-model="selectedSubCategoryEdit.name" :label="$t('name')" id="edit-name" required
            :errors="errors.name" :capitalize="true"/>
          <FormSelect v-model="selectedSubCategoryEdit.category_id" :label="$t('categorie')" id="edit-category_id"
            :options="categories" required :errors="errors.category_id" />
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
import Modal from '@/components/Modal.vue';
import FormSelect from '@/components/FormSelect.vue';
import FormInput from '@/components/FormInput.vue';
import DataTable from '@/components/DataTable.vue';
import EditButton from '@/components/EditButton.vue';
import DeleteButton from '@/components/DeleteButton.vue';
import CreateButton from '@/components/CreateButton.vue';
import SearchBar from '@/components/SearchBar.vue';
import { isDarkMode } from '@/utils/theme';
import PaginationControl from '@/components/PaginationControl.vue';
import SelectButton from '@/components/SelectButton.vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const columns = computed(() => [
  { key: 'name', label: t('name') }, 
  { key: 'category', label: t('categorie') },          
  { key: 'created_at', label: t('registered') }, 
  { key: 'actions', label: t('actions') } 
]);

const subcategories = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const sortOrder = ref('desc');
const searchTerm = ref('');
const selectedCategories = ref('');

const fetchSubCategories = async (page = 1, searchTerm = '', categoryFilter = '') => {
  try {
    const response = await axios.get(`/subcategories`, {
      params: {
        page: page,
        search: searchTerm,
        order: sortOrder.value,
        category: categoryFilter,
      }
    });
    subcategories.value = response.data.data.data;
    totalPages.value = response.data.data.last_page;
    currentPage.value = page;
  } catch (error) {
    console.error('Error al obtener las categorias:', error);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchSubCategories(page, searchTerm.value, selectedCategories.value);
  }
};

const sortByDate = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  fetchSubCategories(currentPage.value, searchTerm.value, selectedCategories.value);
};

const onSearch = () => {
  fetchSubCategories(1, searchTerm.value, selectedCategories.value); 
};

const filterByCategory = () => {
  currentPage.value = 1;
  fetchSubCategories(currentPage.value, searchTerm.value, selectedCategories.value);
};

//////////////////////////Crear subcategoria//////////////////////////
const isModalOpen = ref(false);
const newSubCategory = ref({ category_id: '', name: '', slug: '' });
const modalRef = ref(null);
const categories = ref([]);
const errors = ref({});

const fetchCategories = async () => {
  try {
    const response = await axios.get('/categories', {
      params: {
        paginate: 'false', 
      }
    }); 
    categories.value = response.data.data.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Error al obtener las categorias:', error);
  }
};

const openModal = () => {
  isModalOpen.value = true;
  fetchCategories();
  document.addEventListener('mousedown', handleClickOutside);
};

const closeModal = () => {
  isModalOpen.value = false;
  newSubCategory.value = {
    category_id: '',
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
  const name = newSubCategory.value.name;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  newSubCategory.value.slug = slug;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const createSubCategory = async () => {
  const toast = useToast();
  try {
    newSubCategory.value.name = capitalizeFirstLetter(newSubCategory.value.name.trim());
    await axios.post('/subcategories', newSubCategory.value); 
    errors.value = {};
    fetchSubCategories();     
    closeModal(); 
    toast.success(t('subcategoryCreated'));
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      toast.error(t('errorCreateSubcategory'));
      console.error('Error al crear la subcategoria:', error);
    }
  }
};

//////////////////////////eliminacion de la subcategoria//////////////////////////
const isDeleteModalOpen = ref(false);
const selectedSubCategory = ref(null);

const openDeleteModal = (subcategory) => {
  selectedSubCategory.value = subcategory;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedSubCategory.value = null;
};

const deleteSubcategoria = async () => {
  const toast = useToast();
  try {
    await axios.delete(`/subcategories/${selectedSubCategory.value.id}`);
    fetchSubCategories();
    closeDeleteModal();
    toast.success(t('deleteSubcategory'));
  } catch (error) {
    toast.error(t('errorDeleteSubcategory'));
    console.error('Error al eliminar la subcategoria:', error);
  }
};

//////////////////////////Edicion//////////////////////////
const isEditModalOpen = ref(false);
const selectedSubCategoryEdit = ref({ id: null, category_id: null, name: '', slug: '' });

const modalTitle = computed(() => {
  return t('editingSubCategory', { subcategoryName: selectedSubCategoryEdit.value.name });
});
const openEditModal = (subcategory) => {
  selectedSubCategoryEdit.value = { ...subcategory };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedSubCategoryEdit.value = {
    id: null,
    category_id: null,
    name: '',
    slug: '',
  }; 
  errors.value = {};
};

const updateSubCategory = async () => {
  const toast = useToast();
  if (selectedSubCategoryEdit.value.id == null) {
    console.error('ID de la subcategoria no está definido');
    return;
  }
  try {
    selectedSubCategoryEdit.value.name = capitalizeFirstLetter(selectedSubCategoryEdit.value.name.trim());
    const slug = selectedSubCategoryEdit.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await axios.put(`/subcategories/${selectedSubCategoryEdit.value.id}`, {
      name: selectedSubCategoryEdit.value.name,
      category_id: selectedSubCategoryEdit.value.category_id,
      slug: slug,
    });
    errors.value = {};
    closeEditModal();
    await fetchSubCategories();
    toast.success(t('editSubcategory'));
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      toast.error(t('errorEditSubcategory'));
      console.error('Error al crear la subcategoria:', error);
    }
  }
};

onMounted(() => {
  fetchCategories();
  fetchSubCategories();
});
</script>