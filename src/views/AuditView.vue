<template>
    <DashboardLayout>
        <template v-slot:default>
            <h2 class="my-6 text-2xl text-center font-semibold text-gray-700 dark:text-gray-200">
                {{ $t('movementsUser') }}
            </h2>
            <div class="my-6 px-4 py-3 overflow-x-auto mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div class="my-3 flex flex-col md:flex-row items-start md:items-center">
                    <SearchBar v-model="searchTerm" @input="onSearch" :isDarkMode="isDarkMode"
                        :placeholder="$t('searchUser')" class="mb-4 md:mb-0" />
                    <div class="flex ml-4 items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }" class="w-5 h-5"
                            viewBox="0 0 512 512">
                            <path fill="currentColor"
                                d="M472 168H40a24 24 0 0 1 0-48h432a24 24 0 0 1 0 48m-80 112H120a24 24 0 0 1 0-48h272a24 24 0 0 1 0 48m-96 112h-80a24 24 0 0 1 0-48h80a24 24 0 0 1 0 48" />
                        </svg>
                        <select id="movementFilter" v-model="selectedMovement" @change="filterByMovement"
                            class="mt-0 block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white md:transform  md:ml-2">
                            <option value="">{{ $t('all') }}</option>
                            <option value="created">{{ $t('created') }}</option>
                            <option value="updated">{{ $t('updated') }}</option>
                            <option value="deleted">{{ $t('deleted') }}</option>
                        </select>
                    </div>
                </div>
                <table class="w-full whitespace-no-wrap">
                    <thead>
                        <tr
                            class="text-xs bg-stone-200 font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
                            <th @click="sortByDate"
                                class="cursor-pointer px-5 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                {{ $t('date') }}
                                <span>
                                    <svg v-if="sortOrder === 'asc'" xmlns="http://www.w3.org/2000/svg"
                                        class="inline w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M5 15l7-7 7 7" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="inline w-4 h-4 ml-2"
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </th>
                            <th
                                class="px-2 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                {{ $t('userMovement') }}
                            </th>
                            <th
                                class="px-2 py-3 text-left text-xs font-medium dark:text-white text-gray-500 uppercase tracking-wider">
                                {{ $t('changes') }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="audit in audits" :key="audit.id"
                            class="relative transform scale-100 text-xs py-1 border-b border-gray-300 cursor-default">
                            <td class="pl-5 pr-3 whitespace-no-wrap">
                                <div class="text-black dark:text-white">{{ new
                                    Date(audit.created_at).toLocaleDateString() }}</div>
                                <div class="text-black dark:text-white">{{ new
                                    Date(audit.created_at).toLocaleTimeString() }}</div>
                            </td>
                            <td class="px-2 py-2 whitespace-no-wrap">
                                <div class="leading-5 text-base text-gray-500 dark:text-white">{{ audit.user?.name ??
                                    'Sistema' }}</div>
                                <div class="leading-5 text-gray-900 dark:text-white">
                                    <span
                                        v-html="translateAudit(audit.event, audit.auditable_type, audit.auditable_name, audit.old_values, audit.new_values,audit.transformed_new_values,audit.transformed_old_values)"></span>
                                </div>
                            </td>
                            <td class="px-2 py-2 whitespace-no-wrap">
                                <div class="flex items-center text-sm">
                                    <button @click="openDataModal(audit)"
                                        class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                                        aria-label="images">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" aria-hidden="true"
                                            viewBox="0 0 24 24"
                                            :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }">
                                            <path fill="currentColor"
                                                d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <PaginationControl :currentPage="currentPage" :totalPages="totalPages" @go-to-page="goToPage" />
            </div>

            <Modal :isOpen="isOpenDataModal" :title="$t('changes')" :confirmAction="closeDataModal"
                @close="closeDataModal">
                <div class="p-4">
                    <div v-if="formattedNewValues" class="mb-4">
                        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ $t('newData') }}</h3>
                        <textarea
                            class="textarea-in w-full dark:text-white text-black bg-gray-100 dark:bg-gray-700 p-3 rounded resize-none"
                            v-model="formattedNewValues" readonly></textarea>
                    </div>
                    <div v-if="formattedOldValues">
                        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-200">{{ $t('oldData') }}</h3>
                        <textarea
                            class="textarea-in dark:text-white text-black w-full bg-gray-100 dark:bg-gray-700 p-3 rounded resize-none"
                            v-model="formattedOldValues" readonly></textarea>
                    </div>
                </div>
            </Modal>
        </template>
    </DashboardLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import DashboardLayout from '@/components/DashboardLayout.vue';
import axios from '@/plugins/axios';
import { isDarkMode } from '@/utils/theme';
import Modal from '@/components/Modal.vue';
import SearchBar from '@/components/SearchBar.vue';
import PaginationControl from '@/components/PaginationControl.vue';
import { useI18n } from 'vue-i18n';

const audits = ref([]);

const translateAudit = (event, auditableType, auditable_name, oldValues = {}, newValues = {},transformed_new_values={},transformed_old_values={}, auditableWarehouse = '') => {
    let action = '';
    let type = '';
    const { t } = useI18n();

    // Buscar en old_values y new_values
    const nameFromValues = oldValues.name || newValues.name || auditable_name;
    const warehouseName = oldValues.warehouse_name || newValues.warehouse_name || auditableWarehouse;
    const productName = oldValues.product_name || newValues.product_name || nameFromValues;
    const moveProdWare = oldValues.to || newValues.to || nameFromValues;
    const PoductNameStock= transformed_old_values.product_name||transformed_new_values.product_name||auditable_name;
    const WarehouseNameStock= transformed_old_values.warehouse_name||transformed_new_values.warehouse_name||auditable_name;
    const productNameImage = oldValues.product_name || newValues.product_name || nameFromValues;

    switch (event) {
        case 'created':
            action = `<span class="text-green-500">${t('createdTable')}</span>`;
            break;
        case 'updated':
            action = `<span class="text-yellow-500">${t('updatedTable')}</span>`;
            break;
        case 'deleted':
            action = `<span class="text-red-500">${t('deletedTable')}</span>`;
            break;
        default:
            action = `<span>${event}</span>`;
    }

    switch (auditableType) {
        case 'App\\Models\\ProductStock':
        type = `${t('stockProduct')}<span class="text-blue-500"> #${PoductNameStock ||productName} (${t('warehouse')}: ${warehouseName || WarehouseNameStock})</span>`;
            break;
        case 'App\\Models\\Products':
            type = `${t('thePoduct')}<span class="text-blue-500"> #${nameFromValues}</span>`;
            break;
        case 'App\\Models\\Warehouse':
            type = `${t('theWarehouse')}<span class="text-blue-500"> #${nameFromValues}</span>`;
            break;
        case 'App\\Models\\WarehouseProductMove':
            type = `${t('productMovement')}<span class="text-blue-500"> #${moveProdWare}</span>`;
            break;
        case 'App\\Models\\User':
            type = `${t('auser')}<span class="text-blue-500"> #${nameFromValues}</span>`;
            break;
        case 'App\\Models\\Image':
            type = `${t('imageToProduct')}<span class="text-blue-500"> #${productNameImage}</span>`;
            break;
        case 'App\\Models\\Categorie':
            type = `${t('aCategory')}<span class="text-blue-500"> #${nameFromValues}</span>`;
            break;
        case 'App\\Models\\SubCategories':
            type = `${t('aSubCategory')}<span class="text-blue-500"> #${nameFromValues}</span>`;
            break;
        case 'App\\Models\\Company':
            type = `${t('companyInformation')}<span class="text-blue-500"> #${nameFromValues}</span>`;
            break;
        default:
            type = `${auditableType} #${nameFromValues}`;
    }

    return `${action} ${type}`;
};



const currentPage = ref(1);
const totalPages = ref(1);
const sortOrder = ref('desc');
const selectedMovement = ref('');
const searchTerm = ref('');
const movementFilter = ref('');

const fetchAudits = async (page = 1, movementFilter = '', searchTerm = '') => {
    try {
        const response = await axios.get(`/audits`, {
            params: {
                page: page,
                order: sortOrder.value,
                event: movementFilter,
                search: searchTerm, // Parámetro de búsqueda
            }
        });
        audits.value = response.data.data.data;
        totalPages.value = response.data.data.last_page;
        currentPage.value = page; // Actualizar la página actual
    } catch (error) {
        console.error('Error al obtener las auditorias:', error);
    }
};

const onSearch = () => {
    fetchAudits(1, selectedMovement.value, searchTerm.value, movementFilter.value); // Reiniciar a la primera página en cada búsqueda
};

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        fetchAudits(page, selectedMovement.value, searchTerm.value, movementFilter.value);
    }
};

const sortByDate = () => {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    fetchAudits(currentPage.value, selectedMovement.value, searchTerm.value, movementFilter.value);
};

const filterByMovement = () => {
    currentPage.value = 1;  // Reiniciar a la primera página cuando se aplique un filtro
    fetchAudits(1, selectedMovement.value, searchTerm.value, movementFilter.value);
};

onMounted(() => {
    fetchAudits();
});

const isOpenDataModal = ref(false);
const selectedAudit = ref({ id: null, new_values: '', old_values: '' });

const formatJson = (jsonObject) => {
    return Object.entries(jsonObject).map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
            value = JSON.stringify(value);
        }
        return `${key}: ${value}`;
    }).join('\n');
};

const formattedNewValues = computed(() => formatJson(selectedAudit.value.new_values));
const formattedOldValues = computed(() => formatJson(selectedAudit.value.old_values));

const openDataModal = (audit) => {
    selectedAudit.value = audit;
    isOpenDataModal.value = true;
};

const closeDataModal = () => {
    isOpenDataModal.value = false;
    selectedAudit.value = { id: null, new_values: '', old_values: '' };
};

</script>
<style scoped>
.textarea-in {
    field-sizing: content;
}
</style>