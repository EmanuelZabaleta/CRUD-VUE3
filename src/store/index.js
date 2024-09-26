import { createStore } from 'vuex';
import axiosInstance from '../plugins/axios';
import Cookies from 'js-cookie'; // Importa js-cookie
import warehouses from './modules/warehouses';

const store = createStore({
  modules: {
    warehouses
  },
  state: {
    token: Cookies.get('token') || '', // Lee el token de las cookies
    user: JSON.parse(Cookies.get('user') || 'null'), // Lee el usuario de las cookies
    company_id: Cookies.get('company_id') || null, // Lee el company_id de las cookies
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      Cookies.set('token', token, { expires: 7 }); // Establece el token en cookies con una expiración de 7 días
    },
    SET_USER(state, user) {
      state.user = user;
      Cookies.set('user', JSON.stringify(user), { expires: 7 }); // Establece el usuario en cookies con una expiración de 7 días
    },
    SET_COMPANY_ID(state, company_id) {
      state.company_id = company_id;
      Cookies.set('company_id', company_id, { expires: 7 }); // Establece el company_id en cookies con una expiración de 7 días
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        // Solicita el token CSRF
        await axiosInstance.get('http://localhost:8000/sanctum/csrf-cookie');

        // Luego realiza la solicitud de inicio de sesión
        const response = await axiosInstance.post('/login', credentials);

        // Procesar la respuesta si es necesario
        const user = response.data.user;
        const token = response.data.accessToken;
        const company_id = response.data.company_id;

        // Guardar el token y la información del usuario en cookies
        Cookies.set('token', token);
        Cookies.set('user', JSON.stringify(user));
        Cookies.set('company_id', company_id);

        // Configura el encabezado de autorización
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        commit('SET_USER', user);
        commit('SET_TOKEN', token);
        commit('SET_COMPANY_ID', company_id);

        return response;
      } catch (error) {
        console.error('Error en login:', error);
        throw error; // O maneja el error según sea necesario
      }
    },
    async logout({ commit }) {
      try {
        // Asegúrate de que el token de acceso esté configurado en los encabezados
        await axiosInstance.post('/logout');

        // Limpia las cookies y el estado
        Cookies.remove('token');
        Cookies.remove('user');
        Cookies.remove('company_id');
        commit('SET_TOKEN', '');
        commit('SET_USER', null);
        commit('SET_COMPANY_ID', null);
      } catch (error) {
        console.error('Error en logout:', error);
        throw error;
      }
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    user: state => state.user,
    userRoleId: state => state.user ? state.user.rol_id : null,
    companyId: state => state.company_id,
  },
});

export default store;
