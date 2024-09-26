// src/composables/useDateFormatter.js
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const DateFormatter = () => {
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMMM dd, yyyy HH:mm:ss', { locale: es });
  };

  return { formatDateTime };
};
