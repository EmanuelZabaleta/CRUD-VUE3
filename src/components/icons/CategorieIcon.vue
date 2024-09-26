<template>
    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 32 32"
        :class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }">
        <path
            d="M14 25h14v2H14zm-6.83 1l-2.58 2.58L6 30l4-4l-4-4l-1.42 1.41zM14 15h14v2H14zm-6.83 1l-2.58 2.58L6 20l4-4l-4-4l-1.42 1.41zM14 5h14v2H14zM7.17 6L4.59 8.58L6 10l4-4l-4-4l-1.42 1.41z" />
    </svg>
</template>

<script>
export default {
    name: 'CategorieIcon',
    props: {
        isDarkMode: {
            type: Boolean,
            required: true,
        },
    },
};
</script>