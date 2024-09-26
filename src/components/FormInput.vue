<template>
  <div class="mb-4">
    <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :class="[
        'mt-1 py-1 px-2 block w-full bg-zinc-300 text-black dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:border-purple-500 focus:ring-opacity-50',
        { capitalize: capitalize }
      ]"
      :required="required"
    />
    <div v-if="errors && errors.length" class="mt-1 text-red-600 text-sm">
      <p v-for="(error, index) in errors" :key="index">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  id: String,
  type: {
    type: String,
    default: 'text',
  },
  required: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Array,
    default: () => [],
  },
  capitalize: {
    type: Boolean,
    default: false,
  }
});
</script>
