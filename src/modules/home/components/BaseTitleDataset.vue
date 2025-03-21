<template>
  <div>
    <div class="position-relative" :class="className">
      {{ text }}
      <v-chip
        class="title-chip"
        v-if="extraData"
        variant="outlined"
        color="secondary"
        >Total: {{ extraData }}</v-chip
      >
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
<style scss scoped>
.title-chip {
  background-color: #fff;
  position: absolute;
  top
}
</style>
