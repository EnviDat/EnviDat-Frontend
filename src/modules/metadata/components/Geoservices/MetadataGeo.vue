<template>
  <v-card>
    <v-card-title class="text-h6 metadata_title">Location Geoservices</v-card-title>

    <v-card-text v-if="isReady" style="width: 100%; height: 500px; position: relative;">
      <Map
        :layer-config="layerConfig"
        :map-div-id="'map-small'"
        :selected-layer-name="selectedLayer"
        @changeLayer="setLayer"
        @setShow3d="setShow3d"
        :show3d="show3d"
        :site="site"
      >
        <v-dialog v-model="fullscreen" fullscreen>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" fab small color="primary" v-if="hasData">
              <v-icon medium style="height: auto;">fullscreen</v-icon>
            </v-btn>
          </template>
          <metadata-map-fullscreen @close="fullscreen = false"></metadata-map-fullscreen>
        </v-dialog>
      </Map>
    </v-card-text>
    <v-card-text v-else>
      No location data available
    </v-card-text>

  </v-card>
</template>

<script>
  import Map from './Map';
  import MetadataMapFullscreen from './MetadataMapFullscreen';

  export default {
    name: 'MetadataGeo',
    components: { MetadataMapFullscreen, Map },
    props: {
      genericProps: Object,
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
    computed: {
      isReady() {
        return (!this.wmsUrl && !this.configUrl) || ((this.wmsUrl || this.configUrl) && this.layerConfig !== null);
      },
      hasData() {
        return this.layerConfig;
      },
      selectedLayer() {
        return this.$store.state.geoservices.selectedLayer;
      },
      site() {
        return this.genericProps.site;
      },
      wmsUrl() {
        return this.genericProps.data?.wmsUrl;
      },
      configUrl() {
        return this.genericProps.data?.configUrl;
      },
      layerConfig() {
        return this.$store.state.geoservices.layerConfig;
      },
      mapSize() {
        const height = this.$vuetify.breakpoint.xsOnly || this.$vuetify.breakpoint.smAndDown
          ? this.smallSize : this.mediumSize;
        return { style: `max-width: 100%; height: ${height}px !important;` };
      },
      show3d() {
        return this.$store.state.geoservices.show3d;
      },
    },
    methods: {
      setLayer(name) {
        this.$store.commit('setSelectedLayer', name);
      },
      setShow3d(value) {
        this.$store.commit('setShow3d', value);
      },
    },
    mounted() {
      if (this.wmsUrl) {
        this.$store.dispatch('fetchWmsConfig', this.wmsUrl);
      }
      if (this.configUrl) {
        this.$store.dispatch('fetchLayerConfig', this.configUrl);
      }
      if (this.site) {
        this.$store.commit('setSite', this.site);
      }
    },
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
