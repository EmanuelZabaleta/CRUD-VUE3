<template>
    <svg class="w-4 h-4 mr-3" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round"
        stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1">
        </path>
    </svg>
</template>

<script>
export default {
    name: 'LogoutIcon',
    props: {
        isDarkMode: {
            type: Boolean,
            required: true,
        },
    },
};
</script>