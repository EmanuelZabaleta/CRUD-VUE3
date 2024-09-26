import { ref, computed } from 'vue';

export function useSearch(items, searchFields) {
  const searchQuery = ref('');

  const filteredItems = computed(() => {
    if (!searchQuery.value.trim()) {
      return items.value;
    }

    const query = searchQuery.value.toLowerCase();

    return items.value.filter(item => {
      return searchFields.some(field => {
        // Divide el campo en partes si es anidado
        const fieldParts = field.split('.');
        let value = item;
        for (const part of fieldParts) {
          value = value ? value[part] : null;
        }
        return value && value.toString().toLowerCase().includes(query);
      });
    });
  });

  return {
    searchQuery,
    filteredItems,
  };
}
