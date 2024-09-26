// src/i18n.js
import { createI18n } from 'vue-i18n';

const defaultLocale = localStorage.getItem('locale') || 'es';

// Función para cargar mensajes de forma dinámica
async function loadLocaleMessages(locale) {
    const messages = await import(`./locales/${locale}.js`);
    return messages.default;
}

const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: 'es',
    messages: {},
});

// Cargar mensajes iniciales
// Función para configurar los mensajes de localización
export async function setupI18n() {
    const messages = await loadLocaleMessages(defaultLocale);
    i18n.global.setLocaleMessage(defaultLocale, messages);
}


export default i18n;
