<template>
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" aria-hidden="true" fill="none" stroke-linecap="round"
        stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"
        :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }">
        <path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M17.928 19.634h2.138a1.165 1.165 0 0 0 1.116-1.555a6.851 6.851 0 0 0-6.117-3.95m0-2.759a3.664 3.664 0 0 0 3.665-3.664a3.664 3.664 0 0 0-3.665-3.674m-1.04 16.795a1.908 1.908 0 0 0 1.537-3.035a8.026 8.026 0 0 0-6.222-3.196a8.026 8.026 0 0 0-6.222 3.197a1.909 1.909 0 0 0 1.536 3.034zM9.34 11.485a4.16 4.16 0 0 0 4.15-4.161a4.151 4.151 0 0 0-8.302 0a4.16 4.16 0 0 0 4.151 4.16" />
    </svg>
</template>

<script>
export default {
    name: 'UsersIcon',
    props: {
        isDarkMode: {
            type: Boolean,
            required: true,
        },
    },
};
</script>