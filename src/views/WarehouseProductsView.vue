<template>
  <DashboardLayout>
    <template v-slot:default>
      <h2 class="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center mt-6">
        {{ $t('productWare') }} {{ warehouse.name }}
      </h2>
      <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="my-3 flex justify-between">
          <SearchBar v-model="searchTerm" @input="onSearch" :isDarkMode="isDarkMode" />
        </div>
        <div class="w-full overflow-x-auto">
          <DataTable :items="products" :columns="columns" @sortByDate="sortByDate">
            <template #description="{ item }">
              <span>{{ truncateText(item.description, 100) }}</span>
            </template>
            <template #actions="{ item }">
              <div class="flex items-center space-x-4 text-sm">
                <ButtonActions :textColor="'text-yellow-700'" :borderColor="'border-yellow-700'"
                @click="openModalStock(item)" :darkMode="true">{{ $t('buttonAdjustStock') }}</ButtonActions>
                <ButtonActions :textColor="'text-blue-600'" :borderColor="'border-blue-600'"
                @click="openModalMove(item)" :darkMode="true">{{ $t('buttonChangeWarehouse') }}</ButtonActions>
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
      <!-- ajuste de stock-->
      <Modal :isOpen="isStockModalOpen" title="Stock" :confirmAction="updateStock" @close="closeStockModal">
        <form @submit.prevent="updateStock">
          <FormInput v-model="selectedStockEdit.stock" label="Stock" id="stock" required :errors="errors.stock" />
        </form>
      </Modal>
      <!-- End of modal backdrop -->
      <!-- Modal de cambio de almacén -->
      <Modal :isOpen="isMoveModalOpen" :title="$t('movingProduct')" :confirmAction="moveProduct" @close="closeMoveModal">
        <form @submit.prevent="moveProduct">
          <FormSelect v-model="moveDetails.new_warehouse_id" :label="$t('warehouse')" id="warehouse"
            :options="availableWarehouses" required :errors="errors.new_warehouse_id" />
        </form>
        <div v-if="validationError" class="text-red-500 text-sm mt-2">
          {{ validationError }}
        </div>
        <div class="mb-4">
          <label for="moveOption" class="block text-sm font-medium text-black dark:text-gray-300">{{ $t('selectOptionMovement') }}</label>
          <select v-model="moveDetails.moveOption" id="moveOption"
            class="mt-1 block w-full py-1 px-2 bg-zinc-300 dark:bg-gray-700 dark:text-white text-black rounded-md shadow-sm  focus:ring-purple-500 focus:ring-opacity-50"
            required>
            <option value="all">{{ $t('MoveAllStock') }}</option>
            <option value="partial">{{ $t('MovePartStock') }}</option>
          </select>
        </div>
        <div v-if="moveDetails.moveOption === 'partial'" class="mb-4">
          <label for="quantity" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('AmountToMove') }}</label>
          <input v-model="moveDetails.quantity" type="number" id="quantity"
            class="mt-1 py-1 block w-full text-balck bg-zinc-300 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-purple-500  focus:ring-purple-500 focus:ring-opacity-50"
            required />
          <div v-if="errors.quantity" class="text-red-500 text-sm mt-2">
            {{ errors.quantity[0] }}
          </div>
          <div v-if="errors.message" class="text-red-500 text-sm mt-2">
            {{ errors.message }}
          </div>
        </div>
      </Modal>
      <!-- End of modal backdrop -->
    </template>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/components/DashboardLayout.vue';
import { onMounted, ref, watch,computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from '@/plugins/axios';
import FormInput from '@/components/FormInput.vue';
import Modal from '@/components/Modal.vue';
import FormSelect from '@/components/FormSelect.vue';
import DataTable from '@/components/DataTable.vue';
import SearchBar from '@/components/SearchBar.vue';
import { isDarkMode } from '@/utils/theme';
import PaginationControl from '@/components/PaginationControl.vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import ButtonActions from '@/components/ButtonActions.vue';

const { t } = useI18n();

const columns = computed(() => [
  { key: 'name', label: t('name') },
  { key: 'price', label: t('price') },
  { key: 'stock', label: 'Stock' },           
  { key: 'created_at', label: t('registered') }, 
  { key: 'actions', label: t('actions') } 
]);

const route = useRoute();
const warehouse = ref({});
const products = ref([]);
const errors = ref({});
const currentPage = ref(1);
const totalPages = ref(1);
const sortOrder = ref('desc');
const searchTerm = ref('');

const fetchWarehouseProducts = async (page = 1, searchTerm = '') => {
  try {
    const warehouseId = route.params.id;
    const response = await axios.get(`/warehouse/${warehouseId}/products`, {
      params: {
        page: page,
        order: sortOrder.value,
        search: searchTerm,
      }
    });
    // Asignar los productos obtenidos
    products.value = response.data.data.data;
    totalPages.value = response.data.data.last_page;
    currentPage.value = page;
    // Obtener información del almacén
    const warehouseResponse = await axios.get(`/warehouse/${warehouseId}`);
    warehouse.value = warehouseResponse.data.data;
  } catch (error) {
    console.error('Error al obtener los productos del almacén:', error);
  }
};

const sortByDate = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  fetchWarehouseProducts(currentPage.value, searchTerm.value);
};

const onSearch = () => {
  fetchWarehouseProducts(1, searchTerm.value); // Reiniciar a la primera página en cada búsqueda
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchWarehouseProducts(page, searchTerm.value);
  }
};

onMounted(() => {
  fetchWarehouseProducts();
  fetchAvailableWarehouses();
});

watch(() => route.params.id, () => {
  fetchWarehouseProducts();
});

//////////////////////////Ajuste de stock//////////////////////////
const isStockModalOpen = ref(false);
const selectedStockEdit = ref({ id: null, name: '', slug: '' });

const openModalStock = (product) => {
  console.log(product);
  selectedStockEdit.value = {
    id: product.id,
    stock: product.stock,
    product_id: product.id,
    warehouse_id: warehouse.value.id,
    product_name: product.name,
  };
  isStockModalOpen.value = true;
};

const closeStockModal = () => {
  isStockModalOpen.value = false;
  selectedStockEdit.value = {
    id: null,
    stock: '',
    product_id: null,
    warehouse_id: null,
    product_name: null,
  }; // Reinicia datos
  errors.value = {};
};

const updateStock = async () => {
  const toast = useToast();
  if (selectedStockEdit.value.product_id == null || selectedStockEdit.value.warehouse_id == null) {
    console.error('ID del producto o almacén no encontrado');
    return;
  }
  try {
    await axios.post(`/stock/${selectedStockEdit.value.product_id}`, {
      stock: selectedStockEdit.value.stock,
      product_id: selectedStockEdit.value.product_id,
      warehouse_id: selectedStockEdit.value.warehouse_id,
      product_name: selectedStockEdit.value.product_name,
    });
    errors.value = {};
    closeStockModal();
    await fetchWarehouseProducts();
    toast.success(t('stockUpdate'));
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      toast.error(t('errorstockUpdate'));
      console.error('Error al Ajustar el stock:', error);
    }
  }
};

//////////////////////////mover stock//////////////////////////
const isMoveModalOpen = ref(false);
const availableWarehouses = ref([]);
const validationError = ref('');

const moveDetails = ref({
  product_id: null,
  new_warehouse_id: null,
  moveOption: 'all',
  quantity: 0
});

const openModalMove = (product) => {
  moveDetails.value = {
    product_id: product.id,
    new_warehouse_id: null,
    product_name: product.name,
    moveOption: 'all',
    quantity: 0
  };
  isMoveModalOpen.value = true;
};

const closeMoveModal = () => {
  isMoveModalOpen.value = false;
  moveDetails.value = {
    product_id: null,
    new_warehouse_id: null,
    moveOption: 'all',
    product_name: null,
    quantity: 0
  };
  errors.value = {};
};

const fetchAvailableWarehouses = async () => {
  try {
    const response = await axios.get(`/warehouse`, {
      params: {
        page: false,
      }
    });
    warehouse.value = response.data.data.data;
    // Filtrar los almacenes para excluir el actual
    availableWarehouses.value = warehouse.value.filter(wh => wh.id !== warehouse.value.id);
  } catch (error) {
    console.error('Error al obtener los almacenes disponibles:', error);
  }
};

const moveProduct = async () => {
  validationError.value = '';
  errors.value = {};
  if (!moveDetails.value.product_id || !moveDetails.value.new_warehouse_id) {
    validationError.value = 'Seleccione el nuevo alamacen';
    return;
  }
  const payload = {
    product_id: moveDetails.value.product_id,
    new_warehouse_id: moveDetails.value.new_warehouse_id,
    moveOption: moveDetails.value.moveOption,
    product_name: moveDetails.value.product_name,
  };
  if (moveDetails.value.moveOption === 'partial') {
    payload.quantity = moveDetails.value.quantity;
  }
  const toast = useToast();
  try {
    await axios.post(`/warehouse/${warehouse.value.id}/move`, payload);
    closeMoveModal();
    await fetchWarehouseProducts(); // Refrescar productos en almacén actual
    toast.success(t('messageMoveProduct'));
  } catch (error) {
    if (error.response && error.response.data) {
      errors.value = error.response.data.errors || {};
      if (error.response.data.message) {
        errors.value.message = error.response.data.message;
      }
    } else {
      toast.error(t('messageErrorMoveProduct'));
      console.error('Error al mover el producto:', error);
    }
  }
};

</script>
