<template>
  <div>
    <div :class="className">{{ text }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: 'text-h5',
  },
});
</script>
