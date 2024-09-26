<template>
  <DashboardLayout>
    <template v-slot:default>
      <h2 class="my-6 mt-6 text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center">
        {{ $t('openClose') }}
      </h2>
      <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="my-3 flex justify-between">
          <CreateButton :onClick="openModalRegister" label="Crear" />
        </div>
        <DataTable :items="cashRegisterOpen" :columns="columns">
          <template #opened_at="{ item }">
            <td class="pl-5 pr-3 whitespace-no-wrap">
              <div class="text-black dark:text-white">{{ new
                Date(item.opened_at).toLocaleDateString() }}</div>
              <div class="text-black dark:text-white">{{ new
                Date(item.opened_at).toLocaleTimeString() }}</div>
            </td>
          </template>
          <template #closed_at="{ item }">
            <td class="pl-5 pr-3 whitespace-no-wrap">
              <div class="text-black dark:text-white">{{ new
                Date(item.closed_at).toLocaleDateString() }}</div>
              <div class="text-black dark:text-white">{{ new
                Date(item.closed_at).toLocaleTimeString() }}</div>
            </td>
          </template>
          <template #actions="{ item }">
            <div class="flex items-center space-x-4 text-sm">
                <button :onClick="() => modalCloseRegister(item.id)"
                  class="px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-yellow-600 border border-transparent rounded-lg active:bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:shadow-outline-purple">
                  {{ $t('closeCash') }}
                </button>
            </div>
          </template>
        </DataTable>
        <!-- Historial-->
        <h2 class="my-6 mt-6 text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center">
          {{ $t('record') }}
        </h2>
        <DataTable :items="cashRegisterClosed" :columns="columnsHistory">
          <template #opened_at="{ item }">
            <td class="pl-5 pr-3 whitespace-no-wrap">
              <div class="text-black dark:text-white">{{ new
                Date(item.opened_at).toLocaleDateString() }}</div>
              <div class="text-black dark:text-white">{{ new
                Date(item.opened_at).toLocaleTimeString() }}</div>
            </td>
          </template>
          <template #closed_at="{ item }">
            <td class="pl-5 pr-3 whitespace-no-wrap">
              <div class="text-black dark:text-white">{{ new
                Date(item.closed_at).toLocaleDateString() }}</div>
              <div class="text-black dark:text-white">{{ new
                Date(item.closed_at).toLocaleTimeString() }}</div>
            </td>
          </template>
        </DataTable>
      </div>
      <!-- Modal de abrir caja-->
      <Modal :isOpen="isModalOpenRegsiter" :title="$t('initialBalance')" :confirmAction="createCashRegister"
        @close="closeModal">
        <form @submit.prevent="createCashRegister">
          <FormInput v-model="newCashRegister.initial_balance" :label="$t('initialBalance')" id="initial_balance"
            required :errors="errors.initial_balance" />
        </form>
      </Modal>
      <!-- Modal de cerrar caja -->
      <Modal :isOpen="isCloseRegsiter" :title="$t('finalBalance')" :confirmAction="createCloseRegister"
        @close="closeModalFinalBalance">
        <form @submit.prevent="createCloseRegister">
          <FormInput v-model="newFinalRegister.final_balance" :label="$t('finalBalance')" id="final_balance" required
            :errors="errors.final_balance" />
            <div class="mb-4">
            <label for="description"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('observations') }}</label>
            <textarea v-model="newFinalRegister.observations" id="observations"
              class="textarea-in mt-1 py-1 block w-full text-black dark:text-white rounded-md shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50 dark:bg-gray-700 bg-zinc-300"
              required></textarea>
          </div>
        </form>
      </Modal>
    </template>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import DashboardLayout from '@/components/DashboardLayout.vue';
import axios from '@/plugins/axios';
import DataTable from '@/components/DataTable.vue';
import { useI18n } from 'vue-i18n';
import CreateButton from '@/components/CreateButton.vue';
import Modal from '@/components/Modal.vue';
import FormInput from '@/components/FormInput.vue';
import { useToast } from 'vue-toastification';


const { t } = useI18n();

const columns = computed(() => [
  { key: 'initial_balance', label: t('initialBalance') },
  { key: 'final_balance', label: t('finalBalance') },
  { key: 'difference', label: t('difference') },
  { key: 'opened_at', label: t('opened_at') },
  { key: 'closed_at', label: t('closed_at') },
  { key: 'actions', label: t('actions') },
]);

const columnsHistory = computed(() => [
  { key: 'initial_balance', label: t('initialBalance') },
  { key: 'final_balance', label: t('finalBalance') },
  { key: 'difference', label: t('difference') },
  { key: 'opened_at', label: t('opened_at') },
  { key: 'closed_at', label: t('closed_at') },
  { key: 'observations', label: t('observations') },
]);

const cashRegisterOpen = ref([]);
const cashRegisterClosed = ref([]);

const fetchCashRegister = async () => {
  try {
    const response = await axios.get('/cash-registers/history');
    cashRegisterOpen.value = response.data.data.open_registers;
    cashRegisterClosed.value = response.data.data.closed_registers;
  } catch (error) {
    console.error('Error al obtener las cajas:', error);
  }
};

onMounted(() => {
  fetchCashRegister();
});

//crear caja
const isModalOpenRegsiter = ref(false);
const newCashRegister = ref({ initial_balance: '' });
const modalRef = ref(null);
const errors = ref({});

const openModalRegister = () => {
  isModalOpenRegsiter.value = true;
  document.addEventListener('mousedown', handleClickOutside);
};

const closeModal = () => {
  isModalOpenRegsiter.value = false;
  newCashRegister.value = {
    initial_balance: '',
  };
  errors.value = {};
  document.removeEventListener('mousedown', handleClickOutside);
};

const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    closeModal();
  }
};

const createCashRegister = async () => {
  const toast = useToast();
  try {
    const formattedInitialBalance = parseFloat(newCashRegister.value.initial_balance.replace(',', '.'));
    await axios.post('/cash-registers/open', {
      ...newCashRegister.value,
      initial_balance: formattedInitialBalance
    });
    errors.value = {};
    closeModal();
    fetchCashRegister();
    toast.success(t('createBalance'));
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      console.error('Error al crear al iniciar la caja:', error);
      toast.error(t('errorCreateBalance'));
    }
  }
};

//Cerrar caja
const isCloseRegsiter = ref(false);
const newFinalRegister = ref({ final_balance: '' });

const modalCloseRegister = (cashregister) => {
  newFinalRegister.value.id = cashregister;
  isCloseRegsiter.value = true;
  document.addEventListener('mousedown', handleClickOutside);
};

const closeModalFinalBalance = () => {
  isCloseRegsiter.value = false;
  newFinalRegister.value = {
    final_balance: '',
    observations:'',
  };
  errors.value = {};
  document.removeEventListener('mousedown', handleClickOutside);
};

const createCloseRegister = async () => {
  const toast = useToast();
  try {
    const formattedFinalBalance = parseFloat(newFinalRegister.value.final_balance.replace(',', '.'));
    const observations = newFinalRegister.value.observations || ''; 
    await axios.post(`/cash-registers/${newFinalRegister.value.id}/close`, {
      final_balance: formattedFinalBalance,
      observations: observations,
    });
    errors.value = {};
    closeModalFinalBalance();
    fetchCashRegister();
    toast.success(t('createCloseBalance'));
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      console.error('Error al crear al iniciar la caja:', error);
      toast.error(t('errorCloseBalance'));
    }
  }
};

</script>
<style scoped>
.textarea-in {
  field-sizing: content;
  min-height: 4lh;
}
</style>