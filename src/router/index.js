import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import RolesView from '../views/RolesView.vue';
import UserView from '../views/UsersView.vue';
import store from '../store';
import Error404 from '../views/Error404View.vue';
import CompanyView from '../views/CompanyView.vue';
import WareHouseManageView from '../views/WarehouseManageView.vue';
import CategoriesView from '../views/CategoriesView.vue';
import SubCategoriesView from '../views/SubCategoriesView.vue';
import ProductsView from '@/views/ProductsView.vue';
import WarehouseProductsView from '@/views/WarehouseProductsView.vue';
import AuditView from '@/views/AuditView.vue';
import OpenCloseCashRegister from '@/views/OpenCloseCashRegister.vue';
import PosView from '@/views/PosView.vue';
import i18n from '../i18n';
import CustomerView from '@/views/CustomerView.vue';
import DeletedCustomersView from '@/views/DeletedCustomersView.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta: { title: 'tabLogin' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, title: 'tabDashboard' },
  },
  {
    path: '/roles',
    name: 'roles',
    component: RolesView,
    meta: { requiresAuth: true, roleId: 1, title: 'tabRoles' }
  },
  {
    path: '/users',
    name: 'users',
    component: UserView,
    meta: { requiresAuth: true, roleId: 1, title: 'tabUsers' }
  },
  {
    path: '/company',
    name: 'company',
    component: CompanyView,
    meta: { requiresAuth: true, roleId: 1, title: 'tabCompany' }
  },
  {
    path: '/warehouse',
    name: 'warehouse',
    component: WareHouseManageView,
    meta: { requiresAuth: true, roleId: 1, title: 'tabWarehouse' }
  },
  {
    path: '/warehouse/:id/products',
    name: 'WarehouseProducts',
    component: WarehouseProductsView,
    meta: { requiresAuth: true, roleId: 1, title: 'tabWarehouseProducts' }
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesView,
    meta: { requiresAuth: true, roleId: 1, title: 'tabCategories' }
  },
  {
    path: '/subcategories',
    name: 'subcategories',
    component: SubCategoriesView,
    meta: { requiresAuth: true, roleId: 1, title: 'tabSubcategories' }
  },
  {
    path: '/products',
    name: 'products',
    component: ProductsView,
    meta: { requiresAuth: true, roleId: 1, title: 'tabProducts' }
  },
  {
    path: '/audits',
    name: 'audits',
    component: AuditView,
    meta: { requiresAuth: true, roleId: 1, title: 'tabAudits' }
  },
  {
    path: '/openclosecash',
    name: 'openclosecash',
    component: OpenCloseCashRegister,
    meta: { requiresAuth: true, roleId: 1, title: 'tabOpenclosecash' }
  },
  {
    path: '/pos',
    name: 'pos',
    component: PosView,
    meta: { requiresAuth: true, roleId: 1, title: 'tabPos' }
  },
  {
    path: '/customers',
    name: 'customers',
    component: CustomerView,
    meta: { requiresAuth: true, roleId: 1, title: 'client' }
  },
  {
    path: '/customersdeleted',
    name: 'customersdeleted',
    component: DeletedCustomersView,
    meta: { requiresAuth: true, roleId: 1, title: 'accountDeleted' }
  },
  {
    path: '/error',
    name: 'error',
    component: Error404,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const loggedIn = store.getters.isAuthenticated;
  const userRoleId = store.getters.userRoleId;

  if (to.meta.title) {
    document.title = i18n.global.t(to.meta.title);
  }

  // Si ya está autenticado y trata de acceder a la página de inicio de sesión, redirigir al dashboard
  if (loggedIn && to.name === 'login') {
    next('/dashboard');
  }
  // Si se requiere autenticación y el usuario no está autenticado
  else if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/');
  }
  // Si se requiere un rol específico
  else if (to.matched.some(record => record.meta.roleId)) {
    const allowedRoles = to.meta.roleId;

    if (Array.isArray(allowedRoles)) {
      if (!allowedRoles.includes(userRoleId)) {
        next('/error'); // o redirige a una página de error o no autorizado
      } else {
        next();
      }
    } else {
      // Caso en que roleId no es un array
      if (userRoleId !== allowedRoles) {
        next('/error'); // o redirige a una página de error o no autorizado
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
