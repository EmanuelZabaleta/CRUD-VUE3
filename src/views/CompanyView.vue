<template>
  <DashboardLayout>
    <template v-slot:default>
      <h2 class="my-6 text-2xl text-center font-semibold text-gray-700 dark:text-gray-200">
        {{ $t('informationCompany') }}
      </h2>
      <div class="flex flex-col sticky top-0 z-10" v-for="company in companies" :key="company.id">
        <div class="bg-white dark:bg-gray-800 border border-gray-800 shadow-lg  rounded-2xl p-4">
          <div class="flex justify-end">
            <button @click="openEditModal(company)"
              class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-full active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              aria-label="Edit">
              <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z">
                </path>
              </svg>
            </button>
          </div>
          <!-- Imagen del logo -->
          <div class="w-full overflow-hidden rounded-lg shadow-xs align-middle">
            <div class="flex justify-center items-center h-32 w-32 sm:mb-0 mb-3 mx-auto">
              <img :src="company.image_url" alt="aji" class="w-32 h-32 object-cover rounded-2xl" />
            </div>

            <form class="py-5">
              <div class="grid gap-6 mb-6 lg:grid-cols-2">
                <div>
                  <label for="first_name"
                    class="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"><svg
                      xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"
                      :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }">
                      <path fill="currentColor"
                        d="M4 3v26h11v-4h2v4h11V3zm2 2h20v22h-7v-4h-6v4H6zm2 2v2h4V7zm6 0v2h4V7zm6 0v2h4V7zM8 11v2h4v-2zm6 0v2h4v-2zm6 0v2h4v-2zM8 15v2h4v-2zm6 0v2h4v-2zm6 0v2h4v-2zM8 19v2h4v-2zm6 0v2h4v-2zm6 0v2h4v-2zM8 23v2h4v-2zm12 0v2h4v-2z" />
                    </svg><span class="ml-2">{{ $t('name') }}</span></label>
                  <input readonly type="text" id="first_name"
                    class="bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 "
                    :placeholder="company.name" style="pointer-events: none;">
                </div>
                <div>
                  <label for="phone"
                    class="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"><svg
                      xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"
                      :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }">
                      <g fill="currentColor">
                        <path
                          d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                        <path d="M8 14a1 1 0 1 0 0-2a1 1 0 0 0 0 2" />
                      </g>
                    </svg><span class="ml-2">{{ $t('phone') }}</span></label>
                  <input readonly type="tel" id="phone"
                    class="bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 "
                    :placeholder="company.phone_number" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                    style="pointer-events: none;">
                </div>
                <div>
                  <label for="adress"
                    class="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"><svg
                      xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32"
                      :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }">
                      <path fill="currentColor"
                        d="M16 18a5 5 0 1 1 5-5a5.006 5.006 0 0 1-5 5m0-8a3 3 0 1 0 3 3a3.003 3.003 0 0 0-3-3" />
                      <path fill="currentColor"
                        d="m16 30l-8.436-9.949a35 35 0 0 1-.348-.451A10.9 10.9 0 0 1 5 13a11 11 0 0 1 22 0a10.9 10.9 0 0 1-2.215 6.597l-.001.003s-.3.394-.345.447ZM8.813 18.395s.233.308.286.374L16 26.908l6.91-8.15c.044-.055.278-.365.279-.366A8.9 8.9 0 0 0 25 13a9 9 0 1 0-18 0a8.9 8.9 0 0 0 1.813 5.395" />
                    </svg><span class="ml-2">{{ $t('location') }}</span></label>
                  <input readonly type="tel" id="adress"
                    class="bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 "
                    :placeholder="company.address" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" style="pointer-events: none;">
                </div>
                <div class="mb-6">
                  <label for="email"
                    class="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"><svg
                      xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }">
                      <path fill="currentColor"
                        d="M5.856 6.84a.75.75 0 0 0-1.106.66V17a.75.75 0 0 0 1.5 0V8.756l5.394 2.904c.222.12.49.12.712 0l5.394-2.904V17a.75.75 0 0 0 1.5 0V7.5a.75.75 0 0 0-1.106-.66L12 10.148z" />
                      <path fill="currentColor" fill-rule="evenodd"
                        d="M17.31 3.722a59.632 59.632 0 0 0-10.62 0l-1.518.135a3.53 3.53 0 0 0-3.179 3.006a35.508 35.508 0 0 0 0 10.274a3.53 3.53 0 0 0 3.18 3.005l1.516.136c3.534.316 7.088.316 10.622 0l1.517-.136a3.53 3.53 0 0 0 3.179-3.005a35.508 35.508 0 0 0 0-10.274a3.53 3.53 0 0 0-3.18-3.006zM6.824 5.216a58.133 58.133 0 0 1 10.354 0l1.517.136a2.03 2.03 0 0 1 1.829 1.728a34.005 34.005 0 0 1 0 9.84a2.03 2.03 0 0 1-1.829 1.728l-1.517.136c-3.444.308-6.91.308-10.354 0l-1.517-.136a2.03 2.03 0 0 1-1.829-1.728a34.008 34.008 0 0 1 0-9.84a2.03 2.03 0 0 1 1.829-1.728z"
                        clip-rule="evenodd" />
                    </svg><span class="ml-2">Email</span></label>
                  <input readonly type="email" id="email"
                    class="bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 "
                    :placeholder="company.email" style="pointer-events: none;">
                </div>
                <div class="mb-6">
                  <label for="instagram"
                    class="mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 flex items-center"><svg
                      xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }">
                      <path fill="currentColor"
                        d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
                    </svg><span class="ml-2">Instagram</span></label>
                  <input readonly type="text" id="instagram"
                    class="bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 "
                    :placeholder="company.instagram" style="pointer-events: none;">
                </div>
                <div class="mb-6">
                  <label for="facebook"
                    class="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"><svg
                      xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }">
                      <path fill="currentColor"
                        d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02" />
                    </svg><span class="ml-2">Facebook</span></label>
                  <input readonly type="text" id="facebook"
                    class="bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 "
                    :placeholder="company.facebook" style="pointer-events: none;">
                </div>
                <div class="mb-6">
                  <label for="twitter"
                    class="flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"><svg
                      xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                      :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }">
                      <path fill="currentColor"
                        d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.2 4.2 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.52 8.52 0 0 1-5.33 1.84q-.51 0-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23" />
                    </svg><span class="ml-2">Twitte</span></label>
                  <input readonly type="text" id="twitter"
                    class="bg-gray-50  text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 "
                    :placeholder="company.twitter" style="pointer-events: none;">
                </div>
              </div>


            </form>
          </div>
        </div>
      </div>

      <Modal :isOpen="isEditModalOpen" :title="$t('informationCompany')" :confirmAction="updateCompany" @close="closeEditModal">
        <form @submit.prevent="updateCompany">
          <div class="relative flex items-center justify-center h-32 w-32 mb-3 mx-auto">
            <img :src="imagePreview || selectedCompanyEdit.image_url" alt="Imagen de la compañía"
              class="w-32 h-32 object-cover rounded-2xl" />
            <label for="image"
              class="absolute -right-2 bottom-2 -ml-3 text-white p-1 text-xs bg-green-400 hover:bg-green-500 font-medium tracking-wider rounded-full transition ease-in duration-300 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z">
                </path>
              </svg>
              <input @change="handleImageChange" id="image_url" type="file" accept="image/*"
                class="absolute inset-0 opacity-0 cursor-pointer" />
            </label>
          </div>
          <FormInput v-model="selectedCompanyEdit.name" :label="$t('name')" id="name" required :errors="errors.name" />
          <FormInput v-model="selectedCompanyEdit.phone_number" :label="$t('numberphone')" id="phone_number" required
            :errors="errors.phone_number" />
          <FormInput v-model="selectedCompanyEdit.address" :label="$t('city')" id="Ubicacioón" required
            :errors="errors.address" />
          <FormInput v-model="selectedCompanyEdit.email" label="Email" id="email" required :errors="errors.email" />
          <FormInput v-model="selectedCompanyEdit.instagram" label="Instagram" id="instagram" required
            :errors="errors.instagram" />
          <FormInput v-model="selectedCompanyEdit.facebook" label="Facebook" id="facebook" required
            :errors="errors.facebook" />
          <FormInput v-model="selectedCompanyEdit.twitter" label="Twitter" id="twitter" required
            :errors="errors.twitter" />
        </form>
      </Modal>


    </template>
  </DashboardLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import DashboardLayout from '@/components/DashboardLayout.vue';
import axios from '@/plugins/axios';
import { isDarkMode } from '@/utils/theme';
import Modal from '@/components/Modal.vue';
import FormInput from '@/components/FormInput.vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import { convertToWebP } from '@/utils/imageUtils';

const { t } = useI18n();

const companies = ref([]);
const errors = ref({});

const fetchComapny = async () => {
  try {
    const response = await axios.get('/company');
    companies.value = response.data.data;
  } catch (error) {
    console.error('Error al obtener la compañia:', error);
  }
};

onMounted(() => {
  fetchComapny();
});


//edicion de la compañia
const isEditModalOpen = ref(false);
const selectedCompanyEdit = ref({ id: null, name: '', address: '', phone_number: '', email: '', instagram: '', facebook: '', twitter: '', user_id: '', image_url: '' });
const imagePreview = ref(null);

const openEditModal = (company) => {
  // Inicializa selectedUserEdit con los datos del usuario a editar
  selectedCompanyEdit.value = { ...company };
  imagePreview.value = company.image;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedCompanyEdit.value = { id: null, name: '', address: '', phone_number: '', email: '', instagram: '', facebook: '', twitter: '', user_id: null, image_url: '' }; // Reinicia datos
  imagePreview.value = null;
};

const handleImageChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      // Convertir la imagen a formato WebP utilizando `convertToWebP`
      const webpImage = await convertToWebP(file);

      // Crear una vista previa utilizando un Data URL
      const reader = new FileReader();
      reader.onload = () => {
        imagePreview.value = reader.result; // Mostrar la vista previa de la imagen WebP
      };
      reader.readAsDataURL(webpImage);

      // Guardar la imagen WebP en el objeto de la compañía
      selectedCompanyEdit.value.image = webpImage;
    } catch (error) {
      console.error('Error al convertir la imagen a WebP:', error);
    }
  }
};


const updateCompany = async () => {
  if (selectedCompanyEdit.value.id == null) {
    console.error('ID de la compañia no está definido');
    return;
  }
  const toast = useToast();
  try {
    const formData = new FormData();
    formData.append('name', selectedCompanyEdit.value.name);
    formData.append('address', selectedCompanyEdit.value.address);
    formData.append('phone_number', selectedCompanyEdit.value.phone_number);
    formData.append('email', selectedCompanyEdit.value.email);
    formData.append('instagram', selectedCompanyEdit.value.instagram);
    formData.append('facebook', selectedCompanyEdit.value.facebook);
    formData.append('twitter', selectedCompanyEdit.value.twitter);

    // Añadir la imagen al FormData si existe
    if (selectedCompanyEdit.value.image) {
      formData.append('image_url', selectedCompanyEdit.value.image);
    }
    await axios.post(`/company/${selectedCompanyEdit.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    localStorage.setItem('companyUpdated', 'true');
    window.location.reload();
    closeEditModal();
  } catch (error) {
    if (error.response && error.response.data.errors) {
      errors.value = error.response.data.errors;
    } else {
      toast.error(t('errorUpdateCompany'));
      console.error('Error al Actalizar la compania:', error);
    }
  }
};
// Código para mostrar el toast después de la recarga
if (localStorage.getItem('companyUpdated') === 'true') {
  const toast = useToast();
  toast.success(t('updateCompany'));
  localStorage.removeItem('companyUpdated'); // Limpiar el estado
}
</script>