<template>
  <DashboardLayout>
    <template v-slot:default>
      <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center mt-6">
        {{ $t('productManagement') }}
      </h2>
      <div class="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <p class="text-sm text-black dark:text-white">
          *{{ $t('note') }}: {{ $t('noteProduct') }}
        </p>
      </div>
      <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="my-3">
          <!-- Contenedor para SearchBar y CreateButton -->
          <div class="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div class="flex w-full md:w-auto items-center space-x-3">
              <SearchBar v-model="searchTerm" :placeholder="$t('searchProduct')" @input="onSearch"
                :isDarkMode="isDarkMode" :svg="customSvg" :clickHandler="openScanner" />
              <CreateButton :onClick="openModal" label="Crear" class="-mt-1.5 md:-mt-1.5" />
            </div>
            <!-- Contenedor del escáner -->
            <ScannerModal :isScannerOpen="isScannerOpen" :onDetect="detectSearchBarcode" :onClose="closeScanner" />
            <!-- Contenedor para el Select -->
            <div class="flex w-full md:w-auto mt-3 md:mt-0 md:ml-4 items-center space-x-2">
              <SelectButton v-model="selectedCategory" :roles="categories" :isDarkMode="isDarkMode"
                @change="filterByCategory" />
            </div>
          </div>
        </div>
        <div class="w-full overflow-x-auto">
          <DataTable :items="products" :columns="columns" @sortByDate="sortByDate">
            <template #description="{ item }">
              <span>{{ truncateText(item.description, 100) }}</span>
            </template>
            <template #categoryName="{ item }">
              <span>{{ item.category.name }}</span>
            </template>

            <template #subcategoryName="{ item }">
              <span>{{ item.subcategory.name }}</span>
            </template>
            <template #almacen="{ item }">
              <div class="flex items-center space-x-4 text-sm">
                <span class="bg-green-700 text-sm text-white px-2 py-1 leading-tight rounded-lg"
                  v-if="item.assigned_warehouse">
                  {{ $t('assingTo') }} {{ item.assigned_warehouse.warehouse.name }}
                </span>
                <ButtonActions :textColor="'text-yellow-500'" :borderColor="'border-yellow-500'" :darkMode="true"
                v-else @click="openAsingWareModal(item)">{{ $t('buttonAssignStock') }}</ButtonActions>
              </div>
            </template>
            <template #images="{ item }">
              <div class="flex items-center justify-center text-sm">
                <button @click="openImagesModal(item)"
                  class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                  aria-label="images">
                  <ImageEyeIcon :isDarkMode="isDarkMode" />
                </button>
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
      <!-- Crear Producto -->
      <Modal :isOpen="isModalOpen" :title="$t('newPorduct')" :confirmAction="createProduc" @close="closeModal">
        <form @submit.prevent="createProduc">
          <div class="relative mb-4">
            <FormInput v-model="newProduct.code" :label="$t('code')" id="code" required :errors="errors.code"  class="pr-10" />
            <button @click="openCreateScanner" type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3 h-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-500 dark:text-gray-300 mt-5"
                viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 7V6a2 2 0 0 1 2-2h2M4 17v1a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v1m-4 13h2a2 2 0 0 0 2-2v-1M5 12h14" />
              </svg>
            </button>
          </div>
          <FormInput v-model="newProduct.name" :label="$t('name')" id="name" @input="generateSlug" required
            :errors="errors.name" :capitalize="true" />
          <FormSelect v-model="newProduct.category_id" :label="$t('categorie')" id="category_id" :options="categories" required
            :errors="errors.category_id" />
          <FormSelect v-model="newProduct.subcategory_id" :label="$t('subcategorie')" id="subcategory_id"
            :options="filteredSubcategories" required :errors="errors.subcategory_id"
            :disabled="!filteredSubcategories.length" />
          <div class="mb-4">
            <label for="description"
              class="block text-sm font-medium  text-gray-700 dark:text-gray-300">{{ $t('description') }}</label>
            <textarea v-model="newProduct.description" id="description"
              class="textarea-in mt-1 py-1 block w-full text-black dark:text-white rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 dark:bg-gray-700 bg-zinc-300"
              required :errors="errors.description"></textarea>
          </div>
          <FormInput v-model="newProduct.price" :label="$t('price')" id="price" required :errors="errors.price" />
        </form>
        <!-- Contenedor del escáner -->
        <ScannerModal :isScannerOpen="isScannerCreateOpen" :onDetect="detectBarcode" :onClose="closeCreateScanner" />
      </Modal>

      <!-- End of modal backdrop -->
      <!-- Asingna stock y alamcen  -->
      <Modal :isOpen="isModalStockOpen" :title="$t('warehouseStock')" :confirmAction="createStock"
        @close="closeModalStock">
        <form @submit.prevent="createStock">
          <FormSelect v-model="newStock.warehouse_id" :label="$t('warehouse')" id="warehouse_id" :options="warehouses" required
            :errors="errors.warehouse_id" />
          <FormInput v-model="newStock.stock" label="Stock" id="stock" required :errors="errors.stock" />
        </form>
      </Modal>
      <!-- End of modal backdrop -->
      <!-- Confirmar Eliminación -->
      <Modal :isOpen="isDeleteModalOpen" :title="$t('confirmDelete')" :confirmAction="deleteProduct"
        @close="closeDeleteModal" :isDeleteModal="true">
        <p class="text-sm text-black dark:text-white">
          {{ $t('messageDelete') }}  <span class="text-red-500 font-bold">
            {{ selectedProduct.name }}
          </span> ?
        </p>
      </Modal>
      <!-- Fin del Modal de Confirmación de Eliminación -->
      <!-- Editar Producto -->
      <Modal :isOpen="isEditModalOpen" :title="modalTitle" :confirmAction="updateProduct" @close="closeEditModal">
        <form @submit.prevent="updateProduct">
          <div class="relative mb-4">
            <FormInput v-model="selectedProductEdit.code" :label="$t('code')" id="code" required :errors="errors.code" />
            <button @click="openEditScanner" type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3 h-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-500 dark:text-gray-300 mt-5"
                viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 7V6a2 2 0 0 1 2-2h2M4 17v1a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v1m-4 13h2a2 2 0 0 0 2-2v-1M5 12h14" />
              </svg>
            </button>
          </div>
          <FormInput v-model="selectedProductEdit.name" :label="$t('name')" id="name" @input="generateSlug" required
            :errors="errors.name" :capitalize="true" />
          <FormSelect v-model="selectedProductEdit.category_id" :label="$t('categorie')" id="category_id" :options="categories"
            required :errors="errors.category_id" />
          <FormSelect v-model="selectedProductEdit.subcategory_id" :label="$t('subcategorie')" id="subcategory_id"
            :options="filteredEditSubcategories" required :errors="errors.subcategory_id" />
          <div class="mb-4">
            <label for="description"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('description') }}</label>
            <textarea v-model="selectedProductEdit.description" id="description"
              class="textarea-in mt-1 py-1 block w-full text-black dark:text-white rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 dark:bg-gray-700 bg-zinc-300"
              required></textarea>
          </div>
          <FormInput v-model="selectedProductEdit.price" :label="$t('price')" id="price" required :errors="errors.price" />
        </form>
        <!-- Contenedor del escáner -->
        <ScannerModal :isScannerOpen="isScannerEditOpen" :onDetect="detectEditBarcode" :onClose="closeEditScanner" />
      </Modal>
      <!-- End of modal backdrop -->
      <!-- Imaegenes  -->
      <Modal :isOpen="isopenImagesModal" :title="`${productName}`" :confirmAction="createImagesProdu"
        @close="closeImagesModal">
        <form @submit.prevent="handleFormSubmit">
          <FileUpload :uploadFiles="createImagesProdu" :productImages="productImages"
            @images-selected="handleFileChange" @remove-image="removeProductImage" />
          <p v-if="warningMessage" class="text-red-500">{{ warningMessage }}</p>
        </form>
      </Modal>
      <!-- End of modal backdrop -->
    </template>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue';
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
import FileUpload from '@/components/FileUpload.vue';
import { convertToWebP } from '@/utils/imageUtils';
import PaginationControl from '@/components/PaginationControl.vue';
import SelectButton from '@/components/SelectButton.vue';
import ScannerModal from '@/components/ScannerModal.vue';
import Cookies from 'js-cookie';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const customSvg = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  d: "M4 7V6a2 2 0 0 1 2-2h2M4 17v1a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v1m-4 13h2a2 2 0 0 0 2-2v-1M5 12h14",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill:"currentColor",
  strokeWidth: "2"
};

const columns = computed(() => [
  { key: 'code', label: t('code')},
  { key: 'name', label: t('name') },
  { key: 'description', label: t('description') },
  { key: 'price', label: t('price') },
  { key: 'categoryName', label: t('categorie') },
  { key: 'subcategoryName', label: t('subcategorie') },
  { key: 'almacen', label: t('warehouse') },
  { key: 'images', label: t('image') },
  { key: 'created_at', label: t('registered') },
  { key: 'actions', label: t('actions') },  
]);

const products = ref([]);
const errors = ref({});
const currentPage = ref(1);
const totalPages = ref(1);
const searchTerm = ref('');
const sortOrder = ref('desc');
const selectedCategory = ref('');

const fetchProducts = async (page = 1, searchTerm = '', categoryFilter = '') => {
  try {
    const response = await axios.get(`/products`, {
      params: {
        page: page,
        search: searchTerm,
        order: sortOrder.value,
        category: categoryFilter,
      }
    });
    products.value = response.data.data.data;
    totalPages.value = response.data.data.last_page;
    currentPage.value = page;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchProducts(page, searchTerm.value, selectedCategory.value);
  }
};

const onSearch = () => {
  fetchProducts(1, searchTerm.value, selectedCategory.value);
};

const sortByDate = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  fetchProducts(currentPage.value, searchTerm.value, selectedCategory.value);
};


const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

const filterByCategory = () => {
  currentPage.value = 1;
  fetchProducts(currentPage.value, searchTerm.value, selectedCategory.value);
};

onMounted(() => {
  fetchProducts();
  fetchCategories();
});

//////////////////////////escaner/////////////////////////////////
import { nextTick } from 'vue';
import Quagga from 'quagga';
import ImageEyeIcon from '@/components/icons/ImageEyeIcon.vue';
import ButtonActions from '@/components/ButtonActions.vue';

const isScannerOpen = ref(false);
const isScannerCreateOpen = ref(false);
const isScannerEditOpen = ref(false);

const resetQuaggaEvents = () => {
  Quagga.offDetected();
};

// Abre el escáner para la creación de un nuevo producto
const openCreateScanner = async () => {
  isScannerCreateOpen.value = true;
  resetQuaggaEvents();
  await nextTick();
  startScanner();
  detectBarcode();
};

// Abre el escáner para la edición de un producto existente
const openEditScanner = async () => {
  isScannerEditOpen.value = true;
  resetQuaggaEvents();
  await nextTick();
  startScanner();
  detectEditBarcode();
};

// Abre el escáner para buscar un producto por código de barras
const openScanner = async () => {
  isScannerOpen.value = true;
  resetQuaggaEvents();
  await nextTick();
  startScanner();
  detectSearchBarcode();
};

const closeCreateScanner = () => {
  isScannerCreateOpen.value = false;
  Quagga.stop();  // Detener el escaneo y limpiar
};

const closeEditScanner = () => {
  isScannerEditOpen.value = false;
  Quagga.stop();  
};

const closeScanner = () => {
  isScannerOpen.value = false;
  Quagga.stop(); 
};

const startScanner = () => {
  const scannerContainer = document.querySelector('#scanner-container');

  if (!scannerContainer) {
    console.error('El contenedor del escáner no se encuentra en el DOM.');
    return;
  }

  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: scannerContainer,
      constraints: {
        width: 640, // Ajusta la resolución si es necesario
        height: 480,
        facingMode: 'environment' // Cambia a 'user' si es una cámara frontal
      }
    },
    decoder: {
      readers: ["ean_reader", "upc_reader", "ean_8_reader", "upc_e_reader"]  // Ajusta este valor dependiendo del tipo de código de barras que estés escaneando
    },
    locate: true,  // Ayuda a localizar el código de barras en la imagen
    halfSample: true,  // Procesa la imagen a media resolución para mejorar la velocidad
    numOfWorkers: 2,  // Usa 2 hilos de procesamiento (ajusta según el dispositivo)
    frequency: 10  // Procesa 10 cuadros por segundo
  }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    Quagga.start();
  });
};

const detectBarcode = () => {
  Quagga.onDetected((data) => {
    console.log('Código detectado:', data.codeResult.code);
    newProduct.value.code = data.codeResult.code;
    closeCreateScanner();
  });
};

const detectEditBarcode = () => {
  Quagga.onDetected((data) => {
    console.log('Código detectado:', data.codeResult.code);
    selectedProductEdit.value.code = data.codeResult.code;
    closeEditScanner();
  });
};

const detectSearchBarcode = () => {
  Quagga.onDetected((data) => {
    console.log('Código detectado:', data.codeResult.code);
    searchTerm.value = data.codeResult.code;
    onSearch();
    closeScanner();
  });
};

//////////////////////////Crear producto//////////////////////////
const isModalOpen = ref(false);
const newProduct = ref({ name: '', slug: '', category_id: '', subcategory_id: '', description: '', price: '' });
const modalRef = ref(null);
const categories = ref([]);
const subcategories = ref([]);

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

const fetchSubcategories = async () => {
  try {
    if (newProduct.value.category_id) {
      const response = await axios.get('/subcategories?category_id=${newProduct.value.category_id}', {
        params: {
          paginate: 'false',
        }
      });
      subcategories.value = response.data.data.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    } else {
      subcategories.value = [];
    }
  } catch (error) {
    console.error('Error al obtener las subcategorías:', error);
  }
};

const filteredSubcategories = computed(() => {
  return subcategories.value.filter(subcategory => subcategory.category_id === newProduct.value.category_id);
});

watch(() => newProduct.value.category_id, () => {
  newProduct.value.subcategory_id = '';
  fetchSubcategories();
});

const openModal = () => {
  isModalOpen.value = true;
  fetchCategories();
  document.addEventListener('mousedown', handleClickOutside);
};

const closeModal = () => {
  isModalOpen.value = false;
  newProduct.value = { name: '', slug: '', category_id: null, subcategory_id: null, description: '', price: '' };
  errors.value = {};
  document.removeEventListener('mousedown', handleClickOutside);
};

const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    closeModal();
  }
};

const generateSlug = () => {
  const name = newProduct.value.name;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  newProduct.value.slug = slug;
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};



const createProduc = async () => {
  const toast = useToast();
  try {    
    const companyId = Cookies.get('company_id');
    newProduct.value.name = capitalizeFirstLetter(newProduct.value.name.trim());
    newProduct.value.company_id = companyId;
    await axios.post('/products', newProduct.value);
    fetchProducts();
    errors.value = {};
    closeModal();
    toast.success(t('createProduct'));
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      toast.error(t('errorCreateProduct'));
      console.error('Error al crear el producto:', error);
    }
  }
};

//////////////////////////Asignar almacen y stock//////////////////////////
const isModalStockOpen = ref(false);
const newStock = ref({ product_id: '', warehouse_id: '', stock: '' });
const warehouses = ref([]);

const fetchWarehouse = async () => {
  try {
    const response = await axios.get(`/warehouse`, {
      params: {
        page: false,
      }
    });
    warehouses.value = response.data.data.data;
  } catch (error) {
    console.error('Error al obtener los almacenes:', error);
  }
}

const openAsingWareModal = (product) => {
  isModalStockOpen.value = true;
  newStock.value.product_id = product.id;
  newStock.value.product_name = product.name; 
  fetchWarehouse();
  document.addEventListener('mousedown', handleClickOutside);
};

const closeModalStock = () => {
  isModalStockOpen.value = false;
  newStock.value = { product_id: null, warehouse_id: null, stock: '', product_name: '' };
  errors.value = {};
  document.removeEventListener('mousedown', handleClickOutside);
};

const createStock = async () => {
  const toast = useToast();
  try {
    await axios.post('/stock', newStock.value);
    fetchProducts();
    closeModalStock();
    toast.success(t('stockAssing'));
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      toast.error(t('errorstockAssing'));
      console.error('Error al crear el stock del producto:', error);
    }
  }
};

//////////////////////////eliminacion del poducto//////////////////////////
const isDeleteModalOpen = ref(false);
const selectedProduct = ref(null);

const openDeleteModal = (prodcut) => {
  selectedProduct.value = prodcut;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedProduct.value = null;
};

const deleteProduct = async () => {
  const toast = useToast();
  try {
    await axios.delete(`/products/${selectedProduct.value.id}`);
    fetchProducts();
    closeDeleteModal();
    toast.success(t('deletePorduct'));
  } catch (error) {
    toast.error(t('errordeletePorduct'));
    console.error('Error al eliminar el producto:', error);
  }
};

//////////////////////////Edicion//////////////////////////
const isEditModalOpen = ref(false);
const selectedProductEdit = ref({ id: null, name: '', slug: '', description: '', price: '', category_id: '', subcategory_id: '' });

const modalTitle = computed(() => {
  return t('editingProduct', { productName: selectedProductEdit.value.name });
});

const openEditModal = async (product) => {
  selectedProductEdit.value = { ...product };
  // Cargar las subcategorías para la categoría seleccionada antes de abrir el modal
  await fetchSubcategoriesForEdit(selectedProductEdit.value.category_id);
  // Asegurarse de que la subcategoría esté seleccionada correctamente
  selectedProductEdit.value.subcategory_id = product.subcategory_id;
  isEditModalOpen.value = true;
};

const fetchSubcategoriesForEdit = async (categoryId) => {
  try {
    if (categoryId) {
      const response = await axios.get('/subcategories?category_id=${categoryId}', {
        params: {
          paginate: 'false',  // Pasa 'false' para desactivar la paginación
        }
      });
      subcategories.value = response.data.data;
    } else {
      subcategories.value = [];
    }
  } catch (error) {
    console.error('Error al obtener las subcategorías:', error);
  }
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedProductEdit.value = {
    id: null, name: '', slug: '', description: '', price: '', category_id: null, subcategory_id: null
  };
};

const updateProduct = async () => {
  const toast = useToast();
  if (selectedProductEdit.value.id == null) {
    console.error('ID del producto no está definido');
    return;
  }
  try {
    selectedProductEdit.value.name = capitalizeFirstLetter(selectedProductEdit.value.name.trim());
    const slug = selectedProductEdit.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await axios.put(`/products/${selectedProductEdit.value.id}`, {
      code: selectedProductEdit.value.code,
      name: selectedProductEdit.value.name,
      category_id: selectedProductEdit.value.category_id,
      subcategory_id: selectedProductEdit.value.subcategory_id,
      description: selectedProductEdit.value.description,
      price: selectedProductEdit.value.price,
      slug: slug,
    });
    closeEditModal();
    await fetchProducts();
    toast.success(t('editProct'));
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      toast.error(t('erroeditProct'));
      console.error('Error al actualiza el producto:', error);
    }
  }
};

const filteredEditSubcategories = computed(() => {
  return subcategories.value.filter(subcategory => subcategory.category_id === selectedProductEdit.value.category_id);
});

watch(() => selectedProductEdit.value.category_id, () => {
  selectedProductEdit.value.subcategory_id = '';
  fetchSubcategoriesForEdit(selectedProductEdit.value.category_id);
});

//////////////////////////Asignar imagenes//////////////////////////
const isopenImagesModal = ref(false);
const selectedProductImages = ref({ id: null, imageable_id: '' });
const selectedImages = ref([]);
const warningMessage = ref('');
const productName = ref('');
const productImages = ref([]);
const isRemovingImage = ref(false);

const fetImagesProd = async (productId) => {
  try {
    const response = await axios.get(`products/${productId}/images`);
    const baseURL = 'http://localhost:8000/storage/';
    return response.data.data.map(image => ({
      id: image.id,
      url: `${baseURL}${image.url}`,
    }));
  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
    return [];
  }
};

const openImagesModal = async (product) => {
  selectedProductImages.value = { ...product };
  productName.value = product.name;
  warningMessage.value = '';
  try {
    productImages.value = await fetImagesProd(product.id);
  } catch (error) {
    console.error('Error al abrir el modal:', error);
  }
  isopenImagesModal.value = true;
};

const closeImagesModal = () => {
  isopenImagesModal.value = false;
  selectedProductImages.value = { id: null, imageable_id: '' };
  selectedImages.value = [];
  warningMessage.value = '';
};

const handleFormSubmit = () => {
  // Verifica si se está en modo de eliminar imágenes
  if (isRemovingImage.value) {
    return; // No mostrar la advertencia si se está eliminando una imagen
  }

  // Solo muestra la advertencia si se está intentando subir imágenes
  if (selectedImages.value.length === 0) {
    warningMessage.value = 'Debe seleccionar al menos una imagen.';
    return;
  }

  createImagesProdu();
};



const createImagesProdu = async () => {
  const toast = useToast();
  if (selectedImages.value.length === 0 && !isRemovingImage.value) {
    warningMessage.value = 'Debe seleccionar al menos una imagen.';
    return;
  }
  try {
    const formData = new FormData();
    const convertedImagesPromises = selectedImages.value.map(image => convertToWebP(image));
    const convertedImages = await Promise.all(convertedImagesPromises);

    formData.append('product_name', productName.value);

    convertedImages.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });
    await axios.post(`products/${selectedProductImages.value.id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    toast.success(t('assingImage'));
    closeImagesModal();
  } catch (error) {
    toast.error(t('errorassingImage'));
    console.error('Error al subir la imagen', error);
  } finally {
    isRemovingImage.value = false; // Asegúrate de resetear el estado de eliminación
  }
};

const handleFileChange = (files) => {
  selectedImages.value = files;
  warningMessage.value = '';
};

const removeProductImage = async (imageId) => {
  const toast = useToast();
  try {
    isRemovingImage.value = true; // Indica que se está eliminando una imagen
    await axios.delete(`products/${selectedProductImages.value.id}/images/${imageId}`);
    toast.success(t('deleteImage'));
    // Filtra la imagen eliminada de la lista de imágenes
    productImages.value = productImages.value.filter(image => image.id !== imageId);
  } catch (error) {
    console.error('Error al eliminar la imagen', error);
    toast.error(t('errordeleteImage'));
  } finally {
    isRemovingImage.value = false; // Resetea el estado de eliminación después de la operación
  }
};

</script>

<style scoped>
.textarea-in {
  field-sizing: content;
  min-height: 4lh;
}
</style>