<template>
  <div></div>
</template>

<script>
export default {
  name: 'MapLeafletPoint',
  props: {
    data: Object,
  },
  mounted() {
    this.$emit('add', this.data);
  },
  beforeDestroy() {
    this.$emit('remove', this.data.id);
  },
};
</script>

<style scoped>

</style>
