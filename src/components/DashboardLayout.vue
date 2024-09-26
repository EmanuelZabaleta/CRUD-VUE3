<template>
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Barra lateral de escritorio -->
        <aside v-if="!isSideMenuOpen" :class="{'dark': isDarkMode, 'light': !isDarkMode}"
            class="z-20 hidden w-64 h-screen overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0 custom-scroll">
            <div class="flex flex-col h-full ">
                <nav
                    class="py-4 flex-1 space-y-2 overflow-y-auto text-gray-500 dark:text-gray-400 custom-scroll">
                    <template v-for="company in companies" :key="company.id">
                        <a class="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="/dashboard">
                            {{ company.name }}
                        </a>
                    </template>
                    <ul class="mt-6">
                        <li class="relative px-6 py-3">
                            <router-link :class="['router-link', { 'active-link': $route.path === '/dashboard' }]"
                                to="/dashboard">
                                <HomeIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-black dark:text-white"> {{ $t('home') }}</span>
                            </router-link>
                        </li>
                        <li class="relative px-6 py-3">
                            <router-link :class="['router-link', { 'active-link': $route.path === '/audits' }]"
                                to="/audits">
                                <AuditIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-black dark:text-white">{{ $t('audit') }}</span>
                            </router-link>
                        </li>
                        <li v-if="userRoleId === 1" class="relative px-6 py-3">
                            <button :class="{
                                'menu-button': true,
                                'active': isActiveMenu
                            }" class="inline-flex items-center justify-between w-full transition-colors duration-150 dark:hover:text-gray-200 dark:text-gray-100"
                                @click="togglePagesMenu" aria-haspopup="true">
                                <span class="inline-flex items-center">
                                    <UsersIcon :isDarkMode="isDarkMode" />
                                    <span class="ml-2 text-black dark:text-white">{{ $t('users') }}</span>
                                </span>
                                <ChevronIcon :isDarkMode="isDarkMode" />
                            </button>
                            <template v-if="isPagesMenuOpen">
                                <ul class="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
                                    aria-label="submenu">
                                    <li
                                        class="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                                        <router-link class="w-full" to="/users">
                                            {{ $t('users') }}
                                        </router-link>
                                    </li>
                                    <li
                                        class="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                                        <router-link class="w-full" to="/roles">
                                            {{ $t('roles') }}
                                        </router-link>
                                    </li>
                                </ul>
                            </template>
                        </li>
                        <li v-if="userRoleId === 1" class="relative px-6 py-3">
                            <button :class="{
                                'menu-button': true,
                                'active': isActiveCatalogo
                            }" class="inline-flex items-center justify-between w-full transition-colors duration-150 dark:hover:text-gray-200 dark:text-gray-100"
                                @click="toggleCatalogoMenu" aria-haspopup="true">
                                <span class="inline-flex items-center">
                                    <CategorieIcon :isDarkMode="isDarkMode" />
                                    <span class="ml-2 whitespace-nowrap text-black dark:text-white">{{ $t('categoryManagement') }}</span>
                                </span>
                                <ChevronIcon :isDarkMode="isDarkMode" />
                            </button>
                            <template v-if="isCatalogoMenuOpen">
                                <ul class="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
                                    aria-label="submenu">
                                    <li
                                        class="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                                        <router-link class="w-full" to="/categories">
                                            {{ $t('categories') }}
                                        </router-link>
                                    </li>
                                    <li
                                        class="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                                        <router-link class="w-full" to="/subcategories">
                                            {{ $t('subcategories') }}
                                        </router-link>
                                    </li>
                                </ul>
                            </template>
                        </li>
                        <div
                            class="py-3 flex font-bold items-center text-sm text-purple-500 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-purple-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
                            {{ $t('warehousesAndProducts') }}</div>
                        <li class="relative px-6 py-3">
                            <span class="absolute inset-y-0 left-0 w-1" aria-hidden="true"></span>
                            <router-link :class="['router-link', { 'active-link': $route.path === '/warehouse' }]"
                                to="/warehouse">
                                <WarehouseManageIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-black dark:text-white">{{ $t('warehouseManagement') }}</span>
                            </router-link>
                        </li>
                        <li class="relative px-6 py-3">
                            <span class="absolute inset-y-0 left-0 w-1" aria-hidden="true"></span>
                            <router-link :class="['router-link', { 'active-link': $route.path === '/products' }]"
                                to="/products">
                                <ProductIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-black dark:text-white">{{ $t('productManagement') }}</span>
                            </router-link>
                        </li>
                        <li v-for="warehouse in warehouses" :key="warehouse.id" class="relative px-6 py-3">
                            <button :class="{
                                'menu-button': true,
                                'active': isActiveCatalogoWare(warehouse.id)
                            }" class="inline-flex items-center justify-between w-full transition-colors duration-150 dark:hover:text-gray-200 dark:text-gray-100"
                                @click="toggleCatalogoWareMenu(warehouse.id)" aria-haspopup="true">
                                <span class="inline-flex items-center">
                                    <WarehouseIcon :isDarkMode="isDarkMode" />
                                    <span class="ml-2 text-black dark:text-white">{{ warehouse.name }}</span>
                                </span>
                                <ChevronIcon :isDarkMode="isDarkMode" />
                            </button>
                            <template v-if="isCatalogoWareMenuOpen[warehouse.id]">
                                <ul class="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
                                    aria-label="submenu">
                                    <li
                                        class="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                                        <router-link :to="`/warehouse/${warehouse.id}/products`" class="w-full">
                                            {{ $t('seeProducts') }}
                                        </router-link>
                                    </li>
                                </ul>
                            </template>
                        </li>
                        <div
                            class="py-3 flex font-bold items-center text-sm text-purple-500 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-purple-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
                            {{ $t('client') }}
                        </div>
                        <li class="relative px-6 py-3">
                            <router-link :class="['router-link', { 'active-link': $route.path === '/customers' }]"
                                to="/customers">
                                <CustomersIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-black dark:text-white"> {{ $t('client') }}</span>
                            </router-link>
                        </li>
                        <li class="relative px-6 py-3">
                            <router-link :class="['router-link', { 'active-link': $route.path === '/customersdeleted' }]"
                                to="/customersdeleted">
                                <AccountDeleteIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-black dark:text-white"> {{ $t('accountDeleted') }}</span>
                            </router-link>
                        </li>
                        <div
                            class="py-3 font-bold flex items-center text-sm text-purple-500 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-purple-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
                            {{ $t('cashier') }}
                        </div>
                        <li class="relative px-6 py-3">
                            <router-link :class="['router-link', { 'active-link': $route.path === '/openclosecash' }]"
                                to="/openclosecash">
                                <CashierIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-sm text-black dark:text-white"> {{ $t('openClose') }}</span>
                            </router-link>
                        </li>
                        <li class="relative px-6 py-3">
                            <router-link :class="['router-link', { 'active-link': $route.path === '/pos' }]"
                                to="/pos">
                                <PosIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-sm text-black dark:text-white"> {{ $t('pos') }}</span>
                            </router-link>
                        </li>
                    </ul>
                </nav>
                <div class="flex-shrink-0 px-2 py-4 space-y-2">
                    <router-link to="/company"
                        class="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                        {{ $t('settings') }}
                        <span class="ml-2" aria-hidden="true">
                            <ConfigurationIcon :isDarkMode="isDarkMode" />
                        </span>
                    </router-link>
                </div>
            </div>
        </aside>

        <!-- Barra lateral móvil -->
        <div v-if="isSideMenuOpen"
            class="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center"></div>
        <aside v-if="isSideMenuOpen"
            class="fixed inset-y-0 z-20 h-screen flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 md:hidden"
            @click.stop>
            <div class="flex flex-col h-full">
                <nav
                    class="py-4 flex-1 space-y-2 overflow-y-auto text-gray-500 dark:text-gray-400">
                    <template v-for="company in companies" :key="company.id">
                        <router-link class="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" to="/dashboard">
                            {{ company.name }}
                        </router-link>
                    </template>
                    <ul class="mt-6">
                        <li class="relative px-6 py-3">
                            <router-link :class="['router-link', { 'active-link': $route.path === '/dashboard' }]"
                                to="/dashboard">
                                <HomeIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-black dark:text-white">{{ $t('home') }}</span>
                            </router-link>
                        </li>
                        <li class="relative px-6 py-3">
                            <router-link :class="['router-link', { 'active-link': $route.path === '/audits' }]"
                                to="/audits">
                                <AuditIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-black dark:text-white">{{ $t('audit') }}</span>
                            </router-link>
                        </li>
                        <li v-if="userRoleId === 1" class="relative px-6 py-3">
                            <button :class="{
                                'menu-button': true,
                                'active': isActiveMenu
                            }" class="inline-flex items-center justify-between w-full transition-colors duration-150 dark:hover:text-gray-200 dark:text-gray-100"
                                @click="togglePagesMenu" aria-haspopup="true">
                                <span class="inline-flex items-center">
                                    <UsersIcon :isDarkMode="isDarkMode" />
                                    <span class="ml-2 text-black dark:text-white">{{ $t('users') }}</span>
                                </span>
                                <ChevronIcon :isDarkMode="isDarkMode" />
                            </button>
                            <template v-if="isPagesMenuOpen">
                                <ul class="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
                                    aria-label="submenu">
                                    <li
                                        class="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                                        <router-link class="w-full" to="/users">
                                            {{ $t('users') }}
                                        </router-link>
                                    </li>
                                    <li
                                        class="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                                        <router-link class="w-full" to="/roles">
                                            {{ $t('roles') }}
                                        </router-link>
                                    </li>
                                </ul>
                            </template>
                        </li>
                        <li v-if="userRoleId === 1" class="relative px-6 py-3">
                            <button :class="{
                                'menu-button': true,
                                'active': isActiveCatalogo
                            }" class="inline-flex items-center justify-between w-full transition-colors duration-150 dark:hover:text-gray-200 dark:text-gray-100"
                                @click="toggleCatalogoMenu" aria-haspopup="true">
                                <span class="inline-flex items-center">
                                    <CategorieIcon :isDarkMode="isDarkMode" />
                                    <span class="ml-2 whitespace-nowrap text-black dark:text-white">{{ $t('categoryManagement') }}</span>
                                </span>
                                <ChevronIcon :isDarkMode="isDarkMode" />
                            </button>
                            <template v-if="isCatalogoMenuOpen">
                                <ul class="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
                                    aria-label="submenu">
                                    <li
                                        class="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                                        <router-link class="w-full" to="/categories">
                                            {{ $t('categories') }}
                                        </router-link>
                                    </li>
                                    <li
                                        class="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                                        <router-link class="w-full" to="/subcategories">
                                            {{ $t('subcategories') }}
                                        </router-link>
                                    </li>
                                </ul>
                            </template>
                        </li>
                        <div
                            class="py-3 flex font-bold items-center text-sm text-purple-500 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-purple-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
                            {{ $t('warehousesAndProducts') }}</div>
                        <li class="relative px-6 py-3">
                            <span class="absolute inset-y-0 left-0 w-1" aria-hidden="true"></span>
                            <router-link :class="['router-link', { 'active-link': $route.path === '/warehouse' }]"
                                to="/warehouse">
                                <WarehouseManageIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-black dark:text-white">{{ $t('warehouseManagement') }}</span>
                            </router-link>
                        </li>
                        <li class="relative px-6 py-3">
                            <span class="absolute inset-y-0 left-0 w-1" aria-hidden="true"></span>
                            <router-link :class="['router-link', { 'active-link': $route.path === '/products' }]"
                                to="/products">
                                <ProductIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-black dark:text-white">{{ $t('productManagement') }}</span>
                            </router-link>
                        </li>
                        <li v-for="warehouse in warehouses" :key="warehouse.id" class="relative px-6 py-3">
                            <button :class="{
                                'menu-button': true,
                                'active': isActiveCatalogoWare(warehouse.id)
                            }" class="inline-flex items-center justify-between w-full transition-colors duration-150 dark:hover:text-gray-200 dark:text-gray-100"
                                @click="toggleCatalogoWareMenu(warehouse.id)" aria-haspopup="true">
                                <span class="inline-flex items-center">
                                    <WarehouseIcon :isDarkMode="isDarkMode" />
                                    <span class="ml-2 text-black dark:text-white">{{ warehouse.name }}</span>
                                </span>
                                <ChevronIcon :isDarkMode="isDarkMode" />
                            </button>
                            <template v-if="isCatalogoWareMenuOpen[warehouse.id]">
                                <ul class="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
                                    aria-label="submenu">
                                    <li
                                        class="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200">
                                        <router-link :to="`/warehouse/${warehouse.id}/products`" class="w-full">
                                            {{ $t('seeProducts') }}
                                        </router-link>
                                    </li>
                                </ul>
                            </template>
                        </li>
                        <div
                            class="py-3 font-bold flex items-center text-sm text-purple-500 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-purple-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
                            {{ $t('client') }}
                        </div>
                        <li class="relative px-6 py-3">
                            <router-link :class="['router-link', { 'active-link': $route.path === '/customers' }]"
                                to="/customers">
                                <CustomersIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-black dark:text-white"> {{ $t('client') }}</span>
                            </router-link>
                        </li>
                        <li class="relative px-6 py-3">
                            <router-link :class="['router-link', { 'active-link': $route.path === '/customersdeleted' }]"
                                to="/customersdeleted">
                                <AccountDeleteIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-black dark:text-white"> {{ $t('accountDeleted') }}</span>
                            </router-link>
                        </li>
                        <div
                            class="py-3 font-bold flex items-center text-sm text-purple-500 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-purple-500 dark:before:border-neutral-600 dark:after:border-neutral-600">
                            {{ $t('cashier') }}
                        </div>
                        <li class="relative px-6 py-3">
                            <router-link :class="['router-link', { 'active-link': $route.path === '/openclosecash' }]"
                                to="/openclosecash">
                                <CashierIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-sm text-black dark:text-white"> {{ $t('openClose') }}</span>
                            </router-link>
                        </li>
                        <li class="relative px-6 py-3">
                            <router-link :class="['router-link', { 'active-link': $route.path === '/pos' }]"
                                to="/pos">
                                <PosIcon :isDarkMode="isDarkMode" />
                                <span class="ml-2 text-sm text-black dark:text-white"> {{ $t('pos') }}</span>
                            </router-link>
                        </li>
                    </ul>
                </nav>
                <div class="flex-shrink-0 px-2 py-4 space-y-2">
                    <router-link to="/company"
                        class="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                        {{ $t('settings') }}
                        <span class="ml-2" aria-hidden="true">
                            <ConfigurationIcon :isDarkMode="isDarkMode" />
                        </span>
                    </router-link>
                </div>
            </div>
        </aside>

        <!-- Contenido principal -->
        <div class="flex flex-col flex-1 w-full">
            <header class="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
                <div
                    class="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
                    <!-- Menú hamburguesa móvil -->
                    <button class="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
                        @click="toggleSideMenu" aria-label="Menu">
                        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                            :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }">
                            <path fill-rule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </button>

                    <!-- Menú de perfil -->
                    <ul class="flex items-center space-x-6 ml-auto">
                        <!-- Theme toggler -->
                        <SwitcherLanguage />
                        <li class="flex">
                            <button class="rounded-md focus:outline-none focus:shadow-outline-purple"
                                @click="toggleTheme" aria-label="Toggle color mode">
                                <div v-if="!isDarkMode">
                                    <MoonIcon :isDarkMode="isDarkMode" />
                                </div>
                                <div v-else>
                                    <SunIcon :isDarkMode="isDarkMode" />
                                </div>
                            </button>
                        </li>
                        <li class="relative">
                            <button class="align-middle rounded-full focus:shadow-outline-purple focus:outline-none"
                                @click="toggleProfileMenu" @keydown.escape="closeProfileMenu" aria-label="Account"
                                aria-haspopup="true">
                                <UserMenuIcon :isDarkMode="isDarkMode" />
                            </button>
                            <transition name="fade">
                                <ul v-if="isProfileMenuOpen" ref="profileMenu" v-click-outside="closeProfileMenu"
                                    class="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md dark:border-gray-700 dark:text-gray-300 dark:bg-gray-700"
                                    aria-label="submenu">
                                    <li class="flex">
                                        <button @click="logout"
                                            class="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                                            <LogoutIcon :isDarkMode="isDarkMode" />
                                            <span>{{ $t('logout') }}</span>
                                        </button>
                                    </li>
                                </ul>
                            </transition>
                        </li>
                    </ul>
                </div>
            </header>
            <main class="h-full overflow-y-auto">
                <div class="container px-6 mx-auto grid">
                    <slot></slot>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { isDarkMode, toggleTheme } from '@/utils/theme';
import HomeIcon from './icons/HomeIcon.vue';
import AuditIcon from './icons/AuditIcon.vue';
import UsersIcon from './icons/UsersIcon.vue';
import ChevronIcon from './icons/ChevronIcon.vue';
import CategorieIcon from './icons/CategorieIcon.vue';
import WarehouseManageIcon from './icons/WarehouseManageIcon.vue';
import ProductIcon from './icons/ProductIcon.vue';
import WarehouseIcon from './icons/WarehouseIcon.vue';
import ConfigurationIcon from './icons/ConfigurationIcon.vue';
import LogoutIcon from './icons/LogoutIcon.vue';
import UserMenuIcon from './icons/UserMenuIcon.vue';
import SunIcon from './icons/SunIcon.vue';
import MoonIcon from './icons/MoonIcon.vue';
import SwitcherLanguage from './SwitcherLanguage.vue';
import CashierIcon from './icons/CashierIcon.vue';
import PosIcon from './icons/PosIcon.vue';
import CustomersIcon from './icons/CustomersIcon.vue';
import AccountDeleteIcon from './icons/AccountDeleteIcon.vue';

export default {
    data() {
        return {
            isSideMenuOpen: false,
            isProfileMenuOpen: false,
            isPagesMenuOpen: false,
            isCatalogoMenuOpen: false,
            isCatalogoWareMenuOpen: {} 
        };
    },
    methods: {
        togglePagesMenu() {
            this.isPagesMenuOpen = !this.isPagesMenuOpen;
        },
        toggleCatalogoMenu() {
            this.isCatalogoMenuOpen = !this.isCatalogoMenuOpen;
        },
        toggleSideMenu() {
            this.isSideMenuOpen = !this.isSideMenuOpen;
        },
        toggleProfileMenu() {
            this.isProfileMenuOpen = !this.isProfileMenuOpen;
        },
        closeProfileMenu() {
            this.isProfileMenuOpen = false;
        },
        async logout() {
            await this.$store.dispatch('logout');
            this.$router.push('/');
        },
        toggleCatalogoWareMenu(warehouseId) {
        // Cierra todos los menús
        this.isCatalogoWareMenuOpen = {};
        // Abre el menú del almacén seleccionado
        this.$set(this.isCatalogoWareMenuOpen, warehouseId, !this.isCatalogoWareMenuOpen[warehouseId]);
    },
    },
    computed: {
        ...mapGetters(['userRoleId']),
        isActiveMenu() {
            // Verifica si la ruta actual es /users o /roles
            return ['/users', '/roles'].includes(this.$route.path);
        },
        isActiveCatalogo() {
            // Verifica si la ruta actual es /users o /roles
            return ['/categories', '/subcategories'].includes(this.$route.path);
        },
        isActiveCatalogoWare() {
            // Obtén el ID del almacén actual desde la ruta
            const currentWarehouseId = this.$route.params.id;
            return (warehouseId) => currentWarehouseId && Number(currentWarehouseId) === warehouseId;
        }
    },
    directives: {
        clickOutside: {
            bind(el, binding, vnode) {
                el.clickOutsideEvent = function (event) {
                    // Aquí verificamos que el clic esté fuera del elemento y que no sea un descendiente
                    if (!(el == event.target || el.contains(event.target))) {
                        vnode.context[binding.expression](event);
                    }
                };
                document.body.addEventListener('click', el.clickOutsideEvent);
            },
            unbind(el) {
                document.body.removeEventListener('click', el.clickOutsideEvent);
            },
        },
    },
};
</script>

<script setup>
import { onMounted, ref,computed } from 'vue';
import axios from '@/plugins/axios';
import { useStore } from 'vuex';

const companies = ref([]);
const CACHE_KEY = 'companies';
const CACHE_EXPIRATION_KEY = 'companies_expiration';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

const fetchCompany = async () => {
    const cachedCompanies = localStorage.getItem(CACHE_KEY);
    const cacheExpiration = localStorage.getItem(CACHE_EXPIRATION_KEY);
    const isCacheExpired = !cacheExpiration || new Date().getTime() > cacheExpiration;

    if (cachedCompanies && !isCacheExpired) {
        companies.value = JSON.parse(cachedCompanies);
    } else {
        try {
            const response = await axios.get('/company');
            companies.value = response.data.data;
            localStorage.setItem(CACHE_KEY, JSON.stringify(companies.value));
            localStorage.setItem(CACHE_EXPIRATION_KEY, new Date().getTime() + CACHE_DURATION);
        } catch (error) {
            console.error('Error al obtener la compañía:', error);
        }
    }
};

onMounted(() => {
    fetchCompany();
    fetchWarehouses();
});

// Obtén la lista de almacenes desde Vuex
const warehouses = computed(() => store.getters['warehouses/warehouses']);
const store = useStore();
const isCatalogoWareMenuOpen = ref({});

const fetchWarehouses = async () => {
  await store.dispatch('warehouses/fetchWarehouses');
};


const toggleCatalogoWareMenu = (warehouseId) => {
    isCatalogoWareMenuOpen.value[warehouseId] = !isCatalogoWareMenuOpen.value[warehouseId];
};

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.router-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: #fff;
    /* Color por defecto */
    transition: color 0.2s;
    padding: 0.5rem 0;
}

.router-link::before {
    content: "";
    position: absolute;
    top: -0.3rem;
    bottom: -0.3rem;
    left: -1.5rem;
    background-color: #9333EA;
    /* Color de fondo */
    border-top-right-radius: 0.375rem;
    /* Redondeo superior derecho */
    border-bottom-right-radius: 0.375rem;
    /* Redondeo inferior derecho */
    transition: width 0.2s;
    z-index: 1;
}

.router-link.active-link::before {
    width: 0.24rem;
    /* Ajusta el ancho cuando está activo */
}

.menu-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: #fff;
    /* Color del texto por defecto */
    transition: color 0.2s;
    padding: 0.5rem 0;
}

.menu-button::before {
    content: "";
    position: absolute;
    top: -0.3rem;
    bottom: -0.3rem;
    left: -1.5rem;
    background-color: #9333EA;
    /* Color de la franja */
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
    transition: width 0.2s;
    z-index: 1;
}

.menu-button.active::before {
    width: 0.1rem;
    /* Ancho de la franja cuando está activo */
}

.custom-scroll {
    scrollbar-width: thin; /* Para navegadores compatibles con scrollbar-width */
    scrollbar-color: transparent transparent; /* Oculta el scrollbar por defecto */
}

.custom-scroll::-webkit-scrollbar {
    width: 0; /* Oculta el scrollbar en navegadores basados en WebKit */
    height: 0;
}

.custom-scroll:hover {
    scrollbar-color: #9333EA #fff; /* Colores cuando el usuario hace hover en light mode */
}

.custom-scroll:hover::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}

.custom-scroll:hover::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 4px;
}

.custom-scroll:hover::-webkit-scrollbar-thumb {
    background-color: #9333EA;
    border-radius: 4px;
    border: 1px solid #fff;
}

.custom-scroll:hover::-webkit-scrollbar-thumb:hover {
    background-color: #7c2ae8;
}

/* Dark mode */
.custom-scroll.dark:hover {
    scrollbar-color: #9333EA #3f3a3a;
}

.custom-scroll.dark:hover::-webkit-scrollbar-track {
    background: #3f3a3a;
}

.custom-scroll.dark:hover::-webkit-scrollbar-thumb {
    background-color: #9333EA;
    border: 1px solid #3f3a3a;
}



</style>
