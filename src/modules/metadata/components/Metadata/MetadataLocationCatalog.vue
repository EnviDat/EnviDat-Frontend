<template>
  <v-card height="350" width="300">
    <div v-if="catalog === null">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <v-card-text v-else>
      <div style="overflow-y: auto; max-height: 300px;" v-if="catalog">
        <div
          v-for="(cat, key) in catalog.children"
          :key="key"
          class="item"
          @click="select(cat)"
          :class="{ selected: isSelected(cat.id) }"
        >
          {{ cat.name }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'MetadataLocationCatalog',
  props: {
    catalog: Object,
    selected: String,
  },
  methods: {
    select(value) {
      this.$emit('select', value);
    },
    isSelected(id) {
      return this.selected === id;
    },
  },
};
</script>

<style scoped>
.item:hover {
  background-color: #eeeeee;
  cursor: pointer;
}

.selected {
  background-color: #4db6ac;
}
</style>
