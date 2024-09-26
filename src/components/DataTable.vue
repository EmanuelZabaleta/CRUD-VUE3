<template>
  <div class="w-full overflow-x-auto">
    <table class="w-full whitespace-no-wrap">
      <thead>
        <tr
          class="text-xs bg-stone-200 font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800">
          <th v-for="column in columns" :key="column.key" @click="column.key === 'created_at' ? emitSortByDate() : null"
            class="px-4 py-3 cursor-pointer"><span v-if="column.key === 'created_at'">
              <svg v-if="sortKey === 'created_at' && sortOrder === 'asc'" xmlns="http://www.w3.org/2000/svg"
                class="inline w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>
              <svg v-else-if="sortKey === 'created_at' && sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg"
                class="inline w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>{{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
        <tr v-for="item in sortedItems" :key="item.id" class="text-gray-700 dark:text-white">
          <td v-for="column in columns" :key="column.key" class="px-4 py-3">
            <slot :name="column.key" :item="item">{{ item[column.key] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
});
const sortKey = ref('');


const sortedItems = computed(() => {
  return [...props.items].sort((a, b) => {
    let result = 0;
    if (sortKey.value) {
      if (a[sortKey.value] < b[sortKey.value]) result = -1;
      if (a[sortKey.value] > b[sortKey.value]) result = 1;

    }
    return result;
  });
});

const emit = defineEmits(['sortByDate']);
const emitSortByDate = () => {
  emit('sortByDate');
};
</script>