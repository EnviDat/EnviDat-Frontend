<template>
  <v-card ripple class="basemap-toggle">
    <img width="40" height="40" v-if="value==='streets'" src="./satellite-icon.png" @click.stop="set('satellite')">
    <img width="40" height="40" v-if="value==='satellite'" src="./streets-icon.png" @click.stop="set('streets')">
  </v-card>
</template>

<script>
export default {
  name: 'BasemapToggle',
  props: {
    value: String, // streets or satellite
  },
  methods: {
    set(value) {
      this.$emit('input', value);
    },
  },
};
</script>

<style scoped>
.basemap-toggle {
  cursor: pointer;
  padding: 2px;
  width: 44px;
  height: 44px;
}
</style>
