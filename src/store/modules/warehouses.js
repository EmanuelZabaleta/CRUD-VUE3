import axios from '@/plugins/axios';

const state = {
    warehouses: [],
};

const getters = {
    warehouses: (state) => state.warehouses,
};

const actions = {
    async fetchWarehouses({ commit }) {
        try {
            const response = await axios.get('/warehouse', {
                params: {
                    paginate: 'false',
                    order: 'asc' // Ordenar del más antiguo al más nuevo
                }
            });
            commit('SET_WAREHOUSES', response.data.data);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    },

    async createWarehouse({ dispatch }, warehouseData) {
        try {
            await axios.post('/warehouse', warehouseData); // Ajusta la URL a tu endpoint
            await dispatch('fetchWarehouses'); // Actualizar la lista de almacenes
        } catch (error) {
            console.error('Error creating warehouse:', error);
            throw error; // Propagar el error para manejarlo en el componente
        }
    },
    async deleteWarehouse({ dispatch }, warehouseId) {
        try {
            await axios.delete(`/warehouse/${warehouseId}`);
            await dispatch('fetchWarehouses'); // Actualizar la lista de almacenes después de la eliminación
        } catch (error) {
            console.error('Error deleting warehouse:', error);
            throw error; // Propagar el error para manejarlo en el componente
        }
    },
    async updateWarehouse({ dispatch }, warehouseData) {
        try {
            const slug = warehouseData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            await axios.put(`/warehouse/${warehouseData.id}`, {
                name: warehouseData.name,
                address: warehouseData.address,
                city: warehouseData.city,
                state_province: warehouseData.state_province,
                postal_code: warehouseData.postal_code,
                country: warehouseData.country,
                slug: slug,
            });
            await dispatch('fetchWarehouses'); // Actualizar la lista de almacenes después de la actualización
        } catch (error) {
            console.error('Error updating warehouse:', error);
            throw error; // Propagar el error para manejarlo en el componente
        }
    }
};

const mutations = {
    SET_WAREHOUSES(state, warehouses) {
        state.warehouses = warehouses;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
