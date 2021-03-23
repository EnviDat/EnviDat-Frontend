<template>
  <v-card height="350" width="300">
    <div v-if="catalog === null">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
    <v-card-text v-else>
    <div style="overflow-y: auto; max-height: 300px;">
      <div v-for="(cat, key) in catalog.layerdata.children" :key="key" class="item">
        {{ cat.name }}
      </div>
    </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { createCatalog } from '../GeoservicesMVP/catalog';

export default {
  name: 'MetadataLocationCatalog',
  data: () => ({
    catalog: null,
  }),
  props: {
    url: String,
    type: String,
  },
  beforeMount() {
    this.catalog = createCatalog(this.url, this.type)
      // eslint-disable-next-line no-return-assign
    .then(res => this.catalog = res);

  },
};
</script>

<style scoped>
.item:hover {
  background-color: #eeeeee;
  cursor: pointer;
}
</style>
