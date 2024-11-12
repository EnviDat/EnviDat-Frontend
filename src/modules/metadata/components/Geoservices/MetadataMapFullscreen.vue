<template>
  <v-container
    id="MetadataMapFullscreen"
    v-if="ready"
    style="position: relative; height: 89vh;"
    fluid
    class="fill-height"
  >
    <v-row no-gutters class="fill-height">
      <v-col
        :cols="mapCompareActive ? '6' : '12'"
        :class="mapCompareActive ? 'splitDelimiter' : ''"
      >
        <MapRoot
          :layer-config="layerConfig"
          :mapDivId="mapId1"
          :selectedLayerName="selectedLayer1"
          @changeLayer="setLayer"
          :site="site"
          :mapHeight="mapHeight"
          :isGcnet="isGcnet"
          :showMapSplitButton="!mapCompareActive"
          :showMapSplitCloseButton="mapCompareActive"
        />
      </v-col>

      <v-col v-if="mapCompareActive" cols="6">
        <MapRoot
          :layer-config="layerConfig"
          :mapDivId="mapId2"
          :selectedLayerName="selectedLayer2"
          @changeLayer="setLayer"
          :site="site"
          :mapHeight="mapHeight"
          :showMapSplitButton="!mapCompareActive"
          :showMapSplitCloseButton="mapCompareActive"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  eventBus,
  MAP_COMPARE_END,
  MAP_COMPARE_START,
} from '@/factories/eventBus';
import MapRoot from '@/modules/metadata/components/Geoservices/MapRoot.vue';

export default {
  name: 'MetadataMapFullscreen',
  components: {
    MapRoot,
  },
  props: {
    site: Object,
    layerConfig: Object,
    mapHeight: Number,
    isGcnet: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    // Wait for dialog transition to complete
    setTimeout(() => {
      this.ready = true;
    }, 250);

    eventBus.on(MAP_COMPARE_START, this.startSplit);
    eventBus.on(MAP_COMPARE_END, this.quitSplit);
  },
  beforeUnmount() {
    eventBus.off(MAP_COMPARE_START, this.startSplit);
    eventBus.off(MAP_COMPARE_END, this.quitSplit);

    if (this.map) {
      this.map.remove();
    }
  },
  computed: {},
  methods: {
    setShow3d(value) {
      this.$store.commit('setShow3d', value);
    },
    setShow3dSplit(value) {
      this.$store.commit('setShow3dSplit', value);
    },
    setLayer(name, mapId) {
      if (this.mapId1 === mapId) {
        this.selectedLayer1 = name;
      } else if (this.mapId2 === mapId) {
        this.selectedLayer2 = name;
      }
    },
    setLayerSplit(name) {
      this.$store.commit('setSplitLayer', name);
    },
    quitSplit() {
      this.mapCompareActive = false;
    },
    startSplit() {
      this.mapCompareActive = true;
    },
  },
  data: () => ({
    layerControlOpen: false,
    opacity: 100,
    mapCompareActive: false,
    ready: false,
    selectedLayer1: '',
    selectedLayer2: '',
    mapId1: 'map1',
    mapId2: 'map2',
  }),
};
</script>

<style scoped>
.splitDelimiter {
  border-right: 1px dashed black;
}
</style>
