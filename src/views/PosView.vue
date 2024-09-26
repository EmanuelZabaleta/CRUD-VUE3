<template>
  <DashboardLayout>
    <template v-slot:default>
      <h2 class="my-6 text-2xl font-semibold text-center text-gray-700 dark:text-gray-200">
        {{ $t('pos') }}
      </h2>
      <div class="w-full overflow-hidden rounded-lg shadow-xs">
        <div class="my-3">
          <!-- Contenedor para SearchBar y CreateButton -->
          <div class="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div class="flex w-full md:w-auto items-center space-x-3">
              <CreateButton :onClick="openModal" label="Agregar cliente" class="-mt-1.5 md:-mt-1.5" />
            </div>
          </div>
        </div>
        <div v-if="customer" class="p-3 mb-3 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-800 dark:border-gray-600">
    <p class="text-sm font-medium text-gray-800 dark:text-gray-300">
      Nombre: {{ customer.name }} {{ customer.lastname }}
    </p>
    <p class="text-sm text-gray-600 dark:text-gray-400">ID Nacional: {{ customer.national_id }}</p>
  </div>

        <div class="my-3 flex justify-between">
          <input v-model="barcode" @input="fetchProducts" @keydown.enter="addProduct"
            placeholder="Scan or enter barcode"
            class="p-2 border border-gray-300 rounded-md w-full dark:bg-gray-800 dark:text-white" />
          <ul v-if="suggestions.length"
            class="bg-white border border-gray-300 rounded-md mt-14 max-h-52 overflow-y-auto absolute w-auto z-10 dark:bg-gray-800 dark:border-gray-600">
            <li v-for="(product, index) in suggestions" :key="index" @click="selectProduct(product)"
              class="inline-block p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer dark:text-white text-dark ">
              {{ product.name }} ({{ product.code }})
            </li>
          </ul>
          <button @click="openScanner"
            class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-blue-600 rounded-lg dark:text-white focus:outline-none focus:shadow-outline-gray"
            aria-label="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2m4-5h10" />
            </svg>
          </button>
        </div>
        <!-- Contenedor del escáner -->
        <ScannerModal :isScannerOpen="isScannerOpen" :onDetect="detectBarcode" :onClose="closeScanner" />
        <DataTable :items="cart" :columns="columns">
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.code }}</td>
              <td>{{ item.price }}</td>
              <td>
                <input type="number" v-model.number="item.quantity" @input="updateCartItem(item)" min="1"
                  class="w-20" />
              </td>
              <td>{{ item.subtotal }}</td>
            </tr>
          </template>

        </DataTable>

        <div class="mt-4 text-right">
          <h3 class="text-xl dark:text-white text-black font-semibold">
            Total: {{ totalAmount.toFixed(2) }}
          </h3>
        </div>
        <button @click="generatePDF" class="mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg dark:bg-blue-700">
          Generar Factura
        </button>
      </div>

      <!-- Crear Usuario -->
      <Modal :isOpen="isModalOpen" :title="$t('createUser')" :confirmAction="addCustomer" @close="closeModal">
    <form @submit.prevent="addCustomer" ref="modalRef">
      <!-- Selección de "Nuevo" o "Existente" -->
      <div class="customer-selection">
        <label>
          <input type="radio" value="new" v-model="customerType" />
          Nuevo
        </label>
        <label>
          <input type="radio" value="existing" v-model="customerType" />
          Existente
        </label>
      </div>

      <!-- Mostrar campos para "Nuevo" cliente -->
      <div v-if="customerType === 'new'">
        <label for="name">Nombre:</label>
        <input v-model="newUser.name" type="text" id="name" placeholder="Nombre" required />

        <label for="lastname">Apellido:</label>
        <input v-model="newUser.lastname" type="text" id="lastname" placeholder="Apellido" required />

        <label for="national_id">ID Nacional:</label>
        <input v-model="newUser.national_id" type="text" id="national_id" placeholder="ID Nacional" required />
      </div>

      <!-- Mostrar barra de búsqueda para "Existente" cliente -->
      <div v-if="customerType === 'existing'">
        <label for="search">Buscar Cliente:</label>
        <input v-model="searchQuery" type="text" id="search" placeholder="Buscar cliente..." @input="searchCustomers" />

        <ul v-if="filteredCustomers.length">
          <li v-for="customerItem in filteredCustomers" :key="customerItem.id" @click="selectCustomer(customerItem)">
            {{ customerItem.name }} {{ customerItem.lastname }}
          </li>
        </ul>
      </div>
    </form>
  </Modal>
      <!-- End of modal backdrop -->
    </template>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '@/components/DashboardLayout.vue';
import axios from '@/plugins/axios';
import DataTable from '@/components/DataTable.vue';
import { useI18n } from 'vue-i18n';
import ScannerModal from '@/components/ScannerModal.vue';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import CreateButton from '@/components/CreateButton.vue';
import Modal from '@/components/Modal.vue';

const { t } = useI18n();

const barcode = ref('');
const suggestions = ref([]);
const cart = ref([]);

const columns = computed(() => [
  { key: 'name', label: t('name') },
  { key: 'code', label: t('code') },
  { key: 'price', label: t('price') },
  { key: 'quantity', label: t('quantity') },
  { key: 'subtotal', label: 'subtotal' },
]);

const fetchProducts = async () => {
  if (barcode.value.length > 2) {
    try {
      const response = await axios.get('/products', {
        params: { search: barcode.value, paginate: 'false' },
      });
      suggestions.value = response.data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  } else {
    suggestions.value = [];
  }
};

const selectProduct = (product) => {
  addProduct(product);
  suggestions.value = [];
};

const addProduct = (product) => {
  if (!product) return;

  const existingProduct = cart.value.find((item) => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.value.push({
      ...product,
      quantity: 1,
      subtotal: product.price,
    });
  }

  updateSubtotal();
  barcode.value = '';
};

const updateCartItem = (item) => {
  item.subtotal = item.price * item.quantity;
  updateSubtotal();
};

const updateSubtotal = () => {
  cart.value.forEach((item) => {
    item.subtotal = item.price * item.quantity;
  });
};

const totalAmount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.subtotal, 0);
});

//////////////////////////generar pdf/////////////////////////////////
// Función para obtener el valor de una cookie por su nombre
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

// Función para obtener la información de la empresa del localStorage
const CACHE_KEY = 'companies';
const getCompanyInfo = () => {
  try {
    const cachedCompanies = localStorage.getItem(CACHE_KEY);
    if (cachedCompanies) {
      const companiesArray = JSON.parse(cachedCompanies);
      return companiesArray[0] || {}; // O elige el índice adecuado si hay más de una
    }
    return {}; // Devuelve un objeto vacío si no hay información en el localStorage
  } catch (error) {
    console.error('Error al obtener la información de la empresa:', error);
    return {}; // Devuelve un objeto vacío en caso de error
  }
};

const generatePDF = () => {
  const doc = new jsPDF();

  // Información de la empresa
  const company = getCompanyInfo();
  const companyName = company.name || '';
  const companyAddress = company.address || '';
  const companyPhone = company.phone_number || '';
  const issueDate = new Date().toLocaleDateString(); // Fecha actual en formato local

  // Información del usuario desde la cookie
  const userCookie = getCookie('user');
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : {};
  const issuedBy = user.name || 'Desconocido';

  // Agregar información de la empresa
  doc.setFontSize(24); // Tamaño grande para el nombre de la empresa
  doc.text(companyName, 14, 20);

  doc.setFontSize(10); // Tamaño más pequeño para dirección y teléfono
  doc.text('Dirección: ' + companyAddress, 14, 28);
  doc.text('Teléfono: ' + companyPhone, 14, 34);

  // Agregar la fecha de emisión y emitido por, alineados a la derecha pero más abajo
  doc.setFontSize(12);
  const pageWidth = doc.internal.pageSize.getWidth(); // Obtener el ancho de la página
  doc.text('Fecha de emisión: ' + issueDate, pageWidth - 60, 50); // Alineada a la derecha
  doc.text('Emitido por: ' + issuedBy, pageWidth - 60, 56); // Debajo de la fecha de emisión

  // Título de la factura
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold'); // Establece la fuente en negrita
  doc.text('Factura', 14, 70); // Ajustar la posición para que no se superponga con la información de la empresa

  // Tabla de productos
  const tableColumn = ["Nombre", "Código", "Precio", "Cantidad", "Subtotal"];
  const tableRows = cart.value.map(item => [
    item.name,
    item.code,
    parseFloat(item.price).toFixed(2),
    item.quantity,
    parseFloat(item.subtotal).toFixed(2)
  ]);

  // Agregar tabla al PDF
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 80, // Asegúrate de que la tabla comience después del título
    margin: { horizontal: 10 },
  });

  // Total
  const finalY = doc.lastAutoTable.finalY + 10; // Posición final de la tabla
  doc.setFontSize(14);
  const totalText = `Total: ${totalAmount.value.toFixed(2)}`;
  const textWidth = doc.getTextWidth(totalText); // Obtener el ancho del texto para alinear

  // Alinear el total en la misma columna que el subtotal (ajustando según el ancho del PDF)
  const subtotalColumnPosition = pageWidth - 40; // Ajusta la posición del subtotal/total
  doc.text(totalText, subtotalColumnPosition - textWidth / 2, finalY);

  // Descargar PDF
  doc.save('factura.pdf');
};




//////////////////////////escaner/////////////////////////////////
import { nextTick } from 'vue';
import Quagga from 'quagga';

const isScannerOpen = ref(false);

const resetQuaggaEvents = () => {
  Quagga.offDetected();
};



// Abre el escáner para buscar un producto por código de barras
const openScanner = async () => {
  isScannerOpen.value = true;
  resetQuaggaEvents();
  await nextTick();
  startScanner();
  detectBarcode();
};

const closeScanner = () => {
  isScannerOpen.value = false;
  Quagga.stop();  // Detener el escaneo y limpiar
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
    barcode.value = data.codeResult.code;
    closeScanner();
    fetchProducts();
    addProduct();
  });
};

//////////agregar cliente
const isModalOpen = ref(false);
const modalRef = ref(null);
const newUser = ref({ name: '', lastname: '', national_id: '' });
const customerType = ref('new'); // Selección entre 'new' y 'existing'
const searchQuery = ref('');
const filteredCustomers = ref([]);
const selectedCustomer = ref(null);
const customer = ref(null);

const openModal = () => {
  isModalOpen.value = true;
  document.addEventListener('mousedown', handleClickOutside);
};

const closeModal = () => {
  isModalOpen.value = false;
  newUser.value = { name: '', lastname: '', national_id: '' };
  selectedCustomer.value = null;
  document.removeEventListener('mousedown', handleClickOutside);
};

const handleClickOutside = (event) => {
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    closeModal();
  }
};

const searchCustomers = async () => {
  if (searchQuery.value.trim() !== '') {
    try {
      const response = await axios.get('/api/customers', {
        params: { query: searchQuery.value }
      });
      filteredCustomers.value = response.data;
    } catch (error) {
      console.error('Error al buscar clientes:', error);
    }
  } else {
    filteredCustomers.value = [];
  }
};

const selectCustomer = (selectedCustomer) => {
  customer.value = selectedCustomer;
  isModalOpen.value = false;
};

const addCustomer = () => {
  if (customerType.value === 'new') {
    // Lógica para añadir nuevo cliente
    console.log('Añadir nuevo cliente:', newUser.value);
    // Aquí agregarías la lógica para enviar los datos a tu API
  } else if (customerType.value === 'existing' && selectedCustomer.value) {
    // Lógica para usar cliente existente
    console.log('Cliente existente seleccionado:', selectedCustomer.value);
    // Aquí agregarías la lógica para vincular el cliente existente
  } else {
    alert('Por favor, seleccione un cliente o complete los datos del nuevo cliente.');
  }
  closeModal();
};

</script>
