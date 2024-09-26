// theme.js
import { ref } from 'vue';

// Initialize theme based on localStorage or user's system preference
if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

// Reactive ref to keep track of the current theme state
const isDarkMode = ref(document.documentElement.classList.contains('dark'));

// Function to toggle dark mode
const toggleTheme = () => {
    isDarkMode.value = document.documentElement.classList.toggle('dark');
    localStorage.theme = isDarkMode.value ? 'dark' : 'light';
};

export { isDarkMode, toggleTheme };
