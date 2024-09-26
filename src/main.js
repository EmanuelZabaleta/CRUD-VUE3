import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from './plugins/axios';
import store from './store';
import './assets/tailwind.css'
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import i18n, { setupI18n } from './i18n';


const app = createApp(App);

app.config.globalProperties.$axios = axios; // Configura axios como propiedad global

setupI18n().then(() => {
    app.use(router);
    app.use(store);
    app.use(i18n);
    app.use(Toast, {
        position: POSITION.TOP_RIGHT, // Ajusta la posición según prefieras
    });
    app.mount('#app');
});
