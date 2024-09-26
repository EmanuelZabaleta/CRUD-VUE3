<template>
  <div class="w-screen min-h-screen flex items-center justify-center bg-gray-200 dark:bg-gray-800 px-4 sm:px-6 lg:px-8">
    <div class="relative py-3 w-full max-w-md lg:max-w-lg mx-auto px-4 sm:px-0">
      <form @submit.prevent="login">
        <div class="min-h-96 px-8 py-6 mt-4 text-left bg-white dark:bg-gray-900 rounded-xl shadow-lg">
          <div class="flex flex-col justify-center items-center h-full select-none">
            <div class="flex flex-col items-center justify-center gap-2 mb-8">
              <a href="https://amethgalarcio.web.app/" target="_blank">
                <img src="https://amethgalarcio.web.app/assets/logo-42fde28c.svg" class="w-8" />
              </a>
              <p class="m-0 text-[16px] font-semibold dark:text-white">Bienvenido</p>
            </div>
            <div class="w-full flex flex-col gap-2">
              <label class="text-xs text-black dark:text-gray-400">Email</label>
              <input
                class="border rounded-lg px-3 py-2 mb-5 text-sm text-black w-full outline-none dark:border-gray-500 dark:bg-gray-900 dark:text-white"
                placeholder="email" type="email" v-model="email" required />
            </div>
          </div>
          <div class="w-full flex flex-col gap-2">
            <label class="text-xs text-black dark:text-gray-400">Password</label>
            <input type="password"
              class="border rounded-lg px-3 py-2 mb-5 text-sm w-full outline-none text-black dark:border-gray-500 dark:bg-gray-900 dark:text-white"
              placeholder="••••••••" v-model="password" required />
          </div>
          <div v-if="errorMessage" class="text-red-500 text-xs mt-2">{{ errorMessage }}</div>
          <div class="mt-5">
            <button
              class="py-1 px-8 bg-blue-500 hover:bg-blue-800 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg cursor-pointer select-none"
              type="submit">Log In</button>
          </div>
        </div>
      </form>
    </div>
  </div>

</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const login = async () => {
      try {
        await store.dispatch('login', { email: email.value, password: password.value });
        router.push('/dashboard');
      } catch (error) {
        console.error('Error en login:', error);
        if (error.response?.status === 429) {
          errorMessage.value = 'Demasiados intentos fallidos. Por favor, espera un minuto e intenta nuevamente.';
        } else {
          errorMessage.value = error.response?.data?.message || 'Credenciales no validas';
        }
      }
    };

    return {
      email,
      password,
      login,
      errorMessage,
    };
  },
};
</script>