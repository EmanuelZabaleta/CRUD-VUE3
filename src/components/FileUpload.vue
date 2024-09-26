<template>
  <main class="container mx-auto max-w-screen-lg h-full">
    <article aria-label="File Upload Modal"
      class="relative h-full flex flex-col bg-stone-100 dark:bg-gray-900 shadow-xl rounded-md" @drop="dropHandler"
      @dragover="dragOverHandler" @dragleave="dragLeaveHandler" @dragenter="dragEnterHandler">
      <section class="overflow-auto p-4 w-full h-full flex flex-col">
        <h1 class="pt-4 pb-3 font-semibold sm:text-lg text-black dark:text-white text-center">{{ $t('image') }}</h1>
        <ul id="product-gallery" class="flex flex-1 flex-wrap -m-1">
          <li v-if="productImages && productImages.length === 0" id="empty"
            class="h-full w-full text-center flex flex-col items-center justify-center">
            <span class="text-small text-black dark:text-white">{{ $t('imageProductFile') }}</span>
          </li>

          <li v-for="prodImage in productImages" :key="prodImage.id" class="block p-1 w-1/2 sm:w-1/3 xl:w-1/8 h-24">
            <article tabindex="0"
              class="group w-full h-full rounded-md focus:outline-none focus:shadow-outline relative bg-gray-100 cursor-pointer shadow-sm">
              <img :src="prodImage.url" :alt="prodImage.name"
                class="img-preview w-full h-full sticky object-cover rounded-md bg-fixed" />
              <section
                class="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3 opacity-0 group-hover:opacity-100 group-hover:bg-purple-600 group-hover:bg-opacity-60 transition-opacity duration-300">
                <h1 class="flex-1 group-hover:text-white">{{ prodImage.name }}</h1>
                <div class="flex">
                  <button @click="openDeleteImageModal(prodImage.id)" type="button"
                    class="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800">
                    <svg class="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg"
                      width="24" height="24" viewBox="0 0 24 24">
                      <path class="pointer-events-none" fill="#ffffff"
                        d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                    </svg>
                  </button>
                  <button @click="openLightbox(prodImage.url)" type="button"
                    class="view ml-2 focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" aria-hidden="true" viewBox="0 0 24 24">
                      <path fill="#fff"
                        d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5" />
                    </svg>
                  </button>
                </div>
              </section>
            </article>
          </li>
        </ul>
      </section>
      <!-- Overlay -->
      <div id="overlay"
        class="w-full h-full absolute top-0 left-0 pointer-events-none z-50 flex flex-col items-center justify-center rounded-md">
        <i>
          <svg class="fill-current w-12 h-12 mb-3 text-blue-700" xmlns="http://www.w3.org/2000/svg" width="24"
            height="24" viewBox="0 0 24 24">
            <path
              d="M19.479 10.092c-.212-3.951-3.473-7.092-7.479-7.092-4.005 0-7.267 3.141-7.479 7.092-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408zm-7.479-1.092l4 4h-3v4h-2v-4h-3l4-4z" />
          </svg>
        </i>
        <p class="text-lg text-black dark:text-white">Drop files to upload</p>
      </div>

      <!-- Scroll area -->
      <section class="h-full overflow-auto p-8 w-full flex flex-col">
        <header class="border-dashed border-2 border-gray-400 py-12 flex flex-col justify-center items-center">
          <p class="mb-3 font-semibold text-black dark:text-white flex flex-wrap justify-center">
            <span>{{ $t('dropZone1') }}</span>&nbsp;<span>{{ $t('dropZone2') }}</span>
          </p>
          <input ref="hiddenInput" type="file" multiple class="hidden" @change="handleFileChange" />
          <button @click="triggerFileInput" type="button"
            class="mt-2 rounded-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 focus:shadow-outline focus:outline-none">
            {{ $t('butonUploadFile') }}
          </button>
        </header>

        <h1 class="pt-8 pb-3 font-semibold sm:text-lg text-black dark:text-white">{{ $t('archives') }}</h1>

        <ul id="gallery" class="flex flex-1 flex-wrap -m-1">
          <li v-if="!Object.keys(FILES).length" id="empty"
            class="h-full w-full text-center flex flex-col items-center justify-center">
            <img class="mx-auto w-32"
              src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
              alt="no data" />
            <span class="text-small text-black dark:text-white">{{ $t('notArchives') }}</span>
          </li>
          <li v-for="(file, key) in FILES" :key="key" class="block p-1 w-1/2 sm:w-1/3 xl:w-1/8 h-24">
            <article tabindex="0"
              class="group w-full h-full rounded-md focus:outline-none focus:shadow-outline relative bg-gray-100 cursor-pointer shadow-sm">
              <img v-if="file.isImage" :src="file.objectURL" :alt="file.name"
                class="img-preview w-full h-full sticky object-cover rounded-md bg-fixed" />
              <section
                class="flex flex-col rounded-md text-xs break-words w-full h-full z-20 absolute top-0 py-2 px-3 opacity-0 group-hover:opacity-100 group-hover:bg-gray-700 group-hover:bg-opacity-60 transition-opacity duration-300">
                <h1 class="flex-1 group-hover:text-white">{{ file.name }}</h1>
                <div class="flex">
                  <span class="p-1 text-blue-800">
                    <i>
                      <svg class="fill-current w-4 h-4 ml-auto pt-1" xmlns="http://www.w3.org/2000/svg" width="24"
                        height="24" viewBox="0 0 24 24">
                        <path d="M15 2v5h5v15h-16v-20h11zm1-2h-14v24h20v-18l-6-6z" />
                      </svg>
                    </i>
                  </span>
                  <p class="p-1 size flex text-xs text-white">{{ formatFileSize(file.size) }}</p>
                  <button @click="removeFile(key)"
                    class="delete ml-auto focus:outline-none hover:bg-gray-300 p-1 rounded-md text-gray-800">
                    <svg class="pointer-events-none fill-current w-4 h-4 ml-auto" xmlns="http://www.w3.org/2000/svg"
                      width="24" height="24" viewBox="0 0 24 24">
                      <path class="pointer-events-none" fill="#ffffff"
                        d="M3 6l3 18h12l3-18h-18zm19-4v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.316c0 .901.73 2 1.631 2h5.711z" />
                    </svg>
                  </button>
                </div>
              </section>
            </article>
          </li>
        </ul>
      </section>
    </article>
  </main>
  <vue-easy-lightbox :visible="visible" :imgs="imgs" :index="index" @hide="visible = false" />
  <Modal :isOpen="isDeleteImageModalOpen" :title="$t('confirmDelete')" :confirmAction="confirmDeleteImage"
    @close="closeDeleteImageModal" :isDeleteModal="true">
    <p class="text-sm text-black dark:text-white">
      {{ $t('messageDeleteImage') }}
    </p>
  </Modal>

</template>

<script>
import VueEasyLightbox from 'vue-easy-lightbox';
import Modal from '@/components/Modal.vue';

export default {
  props: {
    productImages: {
      type: Array,
      default: () => [],
    },
    uploadFiles: {
      type: Function,
      default: () => () => { },
    },
  },
  emits: ['images-selected', 'remove-image'],
  components: { VueEasyLightbox, Modal },
  data() {
    return {
      FILES: {},
      visible: false,
      imgs: [],
      index: 0,
      isDeleteImageModalOpen: false,
      selectedImageId: null,
    };
  },
  methods: {
    openLightbox(imageUrl) {
      this.imgs = this.productImages.map(img => img.url); // Pone todas las imágenes en el lightbox
      this.index = this.imgs.indexOf(imageUrl); // Encuentra el índice de la imagen clickeada
      this.visible = true; // Muestra el lightbox
    },
    handleFileChange(event) {
      const files = event.target.files || event.dataTransfer.files;
      this.addFiles(files);
      this.$emit('images-selected', this.getFilesArray());
    },
    addFiles(files) {
      for (let file of files) {
        if (this.isImageFile(file)) {
          const key = `${file.name}-${file.size}-${file.lastModified}`;
          this.FILES[key] = {
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            isImage: true,
            objectURL: URL.createObjectURL(file),
          };
        }
      }
    },
    isImageFile(file) {
      return file.type.startsWith('image/');
    },
    removeFile(key) {
      URL.revokeObjectURL(this.FILES[key].objectURL); // Libera la memoria ocupada por la URL del objeto
      delete this.FILES[key];
      this.$emit('images-selected', this.getFilesArray());
    },
    triggerFileInput() {
      this.$refs.hiddenInput.click();
    },
    formatFileSize(size) {
      const sizeInKb = size / 1024;
      return sizeInKb >= 1024 ? `${(sizeInKb / 1024).toFixed(2)} MB` : `${sizeInKb.toFixed(2)} KB`;
    },
    clearFiles() {
      this.FILES = {};
      this.$emit('images-selected', []);
    },
    getFilesArray() {
      return Object.values(this.FILES).map(fileObj => fileObj.file);
    },
    dragOverHandler(event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
      event.currentTarget.classList.add('draggedover');
    },
    dragEnterHandler(event) {
      event.preventDefault();
      event.currentTarget.classList.add('draggedover');
    },
    dragLeaveHandler(event) {
      event.currentTarget.classList.remove('draggedover');
    },
    dropHandler(event) {
      event.preventDefault();
      event.currentTarget.classList.remove('draggedover');
      this.addFiles(event.dataTransfer.files);
      this.$emit('images-selected', this.getFilesArray());
    },
    openDeleteImageModal(imageId) {
      this.selectedImageId = imageId;
      this.isDeleteImageModalOpen = true;
    },
    closeDeleteImageModal() {
      this.isDeleteImageModalOpen = false;
      this.selectedImageId = null;
    },
    confirmDeleteImage() {
      this.$emit('remove-image', this.selectedImageId);
      this.closeDeleteImageModal();
    },
  },
};
</script>

<style scoped>
.hasImage:hover section {
  background-color: rgba(5, 5, 5, 0.4);
}

.hasImage:hover button:hover {
  background: rgba(5, 5, 5, 0.45);
}

#overlay p,
i {
  opacity: 0;
}

#overlay.draggedover {
  background-color: rgba(255, 255, 255, 0.7);
}

#overlay.draggedover p,
#overlay.draggedover i {
  opacity: 1;
}

.group:hover .group-hover\:text-blue-800 {
  color: #2b6cb0;
}
</style>
