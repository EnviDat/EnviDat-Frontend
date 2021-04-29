<template>
  <v-container id="MetadataMapFullscreen"
                v-if="ready"
                style="position: relative;" 
                fluid
                class="fill-height">

    <v-row no-gutters
            class="fill-height">
      <v-col :cols="mapCompareActive ? '6' : '12'"
              :class="mapCompareActive ? 'splitDelimiter' : ''">

        <Map :layer-config="layerConfig"
              @changeLayer="setLayer"
              :map-div-id="'map0'"
              :site="site"
              :showMapSplitButton="!mapCompareActive"
              :showMapSplitCloseButton="mapCompareActive" />

              <!-- :selected-layer-name="selectedLayer" -->

      </v-col>

      <v-col v-if="mapCompareActive" 
              cols="6">
        <Map :layer-config="layerConfig"
              @changeLayer="setLayer"
              :map-div-id="'map1'"
              :site="site"
              :showMapSplitButton="!mapCompareActive"
              :showMapSplitCloseButton="mapCompareActive" />

              <!-- :selected-layer-name="selectedLayer" -->
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
  import {
    MAP_COMPARE_START,
    MAP_COMPARE_END,
    eventBus,
  } from '@/factories/eventBus';

  import Map from './Map';

  export default {
    name: 'MetadataMapFullscreen',
    components: {
      Map,
    },
    props: {
      fileConfig: Object,
    },
    mounted() {
      // Wait for dialog transition to complete
      setTimeout(() => { this.ready = true; }, 250);

      eventBus.$on(MAP_COMPARE_START, this.startSplit);
      eventBus.$on(MAP_COMPARE_END, this.quitSplit);
    },
    beforeDestroy() {
      eventBus.$off(MAP_COMPARE_START, this.startSplit);
      eventBus.$off(MAP_COMPARE_END, this.quitSplit);

      if (this.map) {
        this.map.remove();
      }
    },    
    computed: {
      site() {
        return this.fileConfig.site;
      },
      // splitScreen() {
      //   return this.$store.state.geoservices.splitScreen;
      // },
      // splitLayer() {
      //   return this.$store.state.geoservices.splitLayer;
      // },
      // selectedLayer() {
      //   return this.$store.state.geoservices.selectedLayer;
      // },
      layerConfig() {
        return this.fileConfig.layerConfig;
      },
      // show3d() {
      //   return this.$store.state.geoservices.show3d;
      // },
      // show3dSplit() {
      //   return this.$store.state.geoservices.show3dSplit;
      // },
    },
    methods: {
      setShow3d(value) {
        this.$store.commit('setShow3d', value);
      },
      setShow3dSplit(value) {
        this.$store.commit('setShow3dSplit', value);
      },
      setLayer(name) {
        this.$store.commit('setSelectedLayer', name);
      },
      setLayerSplit(name) {
        this.$store.commit('setSplitLayer', name);
      },
      // eslint-disable-next-line no-unused-vars
      quitSplit(mapId) {
        this.mapCompareActive = false;
        // if (mapId === 1) {
        //   this.$store.commit('setSelectedLayer', this.splitLayer);
        // }
        // this.$store.commit('setSplitScreen', false);
      },
      startSplit() {
        // this.mapCompareActive = !this.mapCompareActive;
        this.mapCompareActive = true;

        // this.$store.commit('setSelectedLayer', this.selectedLayer);
        // this.$store.commit('setSplitScreen', true);
      },
      close() {
        this.$emit('close');
      },
    },
    data: () => ({
      layerControlOpen: false,
      opacity: 100,
      mapCompareActive: false,
      ready: false,
    }),
  };
</script>

<style scoped>

  .splitDelimiter {
    border-right: 1px dashed black;
  }
</style>
