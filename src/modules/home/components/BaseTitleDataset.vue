<template>
  <div>
    <div :class="className">
      {{ text }}
      <v-chip v-if="extraData" color="secondary">Total: {{ extraData }}</v-chip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseTitle',
  props: {
    text: {
      type: String,
      required: true,
    },
    extraData: {
      type: String,
      required: false,
    },
    className: {
      type: String,
      default: 'text-h5',
    },
  },
};
</script>
