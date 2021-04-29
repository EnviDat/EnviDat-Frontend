<template>
  <v-card id="MetadataGeo" >

    <v-card-title class="text-h6 metadata_title">Location Geoservices</v-card-title>

    <v-card-text class="py-1 text-caption readableText"
                  :style="`line-height: 1rem; background-color: ${ $vuetify.theme.themes.light.accent };`" >
      Checkout the new experimental Geoservice Features: 3D Map, Fullscreen with map comparison. There might be bugs.
    </v-card-text>

    <v-card-text v-if="isReady"
                  style="position: relative;" >
    <!-- style="height: 500px;" -->
      <Map :layer-config="layerConfig"
            :map-div-id="'map-small'"
            :selected-layer-name="selectedLayer"
            @changeLayer="setLayer"
            :site="site"
            :showFullscreenButton="true"
            :height="450" />
    </v-card-text>

    <v-card-text v-else>
      No location data available
    </v-card-text>

  </v-card>
</template>

<script>
  import {
    INJECT_MAP_FULLSCREEN,
    eventBus,
  } from '@/factories/eventBus';

  import Map from './Map';

  export default {
    name: 'MetadataGeo',
    components: {
      Map,
    },
    props: {
      genericProps: Object,
    },
    mounted() {
      
      if (this.wmsUrl) {
        this.$store.dispatch('fetchWmsConfig', this.wmsUrl);
      }

      if (this.configUrl) {
        this.$store.dispatch('fetchLayerConfig', this.configUrl);
      }
    },
    computed: {
      isReady() {
        return (!this.wmsUrl && !this.configUrl) || ((this.wmsUrl || this.configUrl));
        // return (!this.wmsUrl && !this.configUrl) || ((this.wmsUrl || this.configUrl) && this.layerConfig !== null);
      },
      hasData() {
        return this.layerConfig;
      },
      selectedLayer() {
        return this.$store.state.geoservices.selectedLayer;
      },
      site() {
        return this.genericProps?.site;
      },
      wmsUrl() {
        return this.genericProps?.wmsUrl;
      },
      configUrl() {
        return this.genericProps?.configUrl;
      },
      layerConfig() {
        return this.genericProps?.layerConfig;
        // return this.$store.state.geoservices.layerConfig;
      },
      mapSize() {
        const height = this.$vuetify.breakpoint.xsOnly || this.$vuetify.breakpoint.smAndDown
          ? this.smallSize : this.mediumSize;
        return { style: `max-width: 100%; height: ${height}px !important;` };
      },
    },
    methods: {
      triggerFullscreenEvent() {
        // console.log(`triggerFullscreenEvent ${this.layerConfig}`);
        eventBus.$emit(INJECT_MAP_FULLSCREEN, this.layerConfig);
      },
      setLayer(name) {
        this.$store.commit('setSelectedLayer', name);
      },
    },
    data: () => ({
      ready: false,
      map: null,
      smallSize: 300,
      mediumSize: 500,
      largeSize: 725,
      fullWidthSize: 875,
      fullscreen: false,
    }),    
  };
</script>
<style scoped>
  .layers {
    position: absolute;
    top: 70px;
    right: 5px;
    padding: 3px;
    z-index: 9999;
  }

  .selected {
    background-color: cadetblue;
  }
</style>
