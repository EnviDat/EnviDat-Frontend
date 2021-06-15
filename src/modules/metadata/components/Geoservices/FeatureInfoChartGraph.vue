<template>
<div></div>
</template>

<script>
export default {
  name: 'FeatureInfoChartGraph',
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
