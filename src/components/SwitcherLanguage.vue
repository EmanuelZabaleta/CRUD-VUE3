<template>
  <div class="relative inline-block text-left">
    <button @click="toggleDropdown" id="states-button" class="flex-shrink-0 z-10 inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600" type="button">
      <FlagsEspIcon v-if="selectedLanguage === 'es'" />
      <FlagsEngIcon v-else />
      <span>{{ selectedLanguage === 'es' ? 'ES' : 'EN' }}</span>
      <svg class="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
    </button>    
    <!-- Dropdown Menu -->
    <div v-if="isOpen" class="absolute mt-2 w-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 dark:bg-gray-700">
      <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="states-button">
        <button @click="selectLanguage('es')" class="text-gray-700 flex items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
          <FlagsEspIcon />
          Español
        </button>
        <button @click="selectLanguage('en')" class="text-gray-700 flex items-center px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
          <FlagsEngIcon/>
          English
        </button>
      </div>
    </div>
  </div>
</template>

  
  <script setup>
 import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FlagsEspIcon from './icons/FlagsEspIcon.vue';
import FlagsEngIcon from './icons/flagsEngIcon.vue';

const { locale, setLocaleMessage, availableLocales } = useI18n();
const selectedLanguage = ref(locale.value);
const isOpen = ref(false);

const loadLocaleMessages = async (locale) => {
  if (!availableLocales.includes(locale)) {
    const messages = await import(`../locales/${locale}.js`);
    setLocaleMessage(locale, messages.default);
  }
};

const changeLanguage = async (lang) => {
  await loadLocaleMessages(lang);
  locale.value = lang;
  selectedLanguage.value = lang;
  localStorage.setItem('locale', lang);
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectLanguage = (lang) => {
  changeLanguage(lang);
  isOpen.value = false;
};
  </script>
  