<template>
  <v-card>
    <v-card-title class="title metadata_title">Location Geoservices</v-card-title>

    <v-card-text v-if="configFile" style="width: 100%; height: 500px; position: relative;">
      <Map
        :config="configFile"
        :map-div-id="'map-small'"
        :selected-layer-name="selectedLayer"
        @changeLayer="setLayer"
        @setShow3d="setShow3d"
        :show3d="show3d"
        :site="genericProps.site"
      >
        <v-btn fab small color="primary" @click.native.stop="openFullscreen">
          <v-icon medium style="height: auto;">fullscreen</v-icon>
        </v-btn>
      </Map>
    </v-card-text>

  </v-card>
</template>

<script>
  import Map from './Map';

  export default {
    name: 'MetadataGeo',
    components: { Map },
    props: {
      genericProps: Object,
    },
    data: () => ({
      map: null,
      smallSize: 300,
      mediumSize: 500,
      largeSize: 725,
      fullWidthSize: 875,
    }),
    computed: {
      selectedLayer() {
        return this.$store.state.geoservices.selectedLayer;
      },
      configFile() {
        return this.$store.state.geoservices.config;
      },
      ready() {
        return !!this.genericProps.data.config;
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
    watch: {
      ready: {
        handler() {
          if (this.genericProps?.data?.configUrl) {
            this.$store.dispatch('fetchConfig', this.genericProps.data.configUrl);
          }
        },
        immediate: true,
      },
    },
    methods: {
      setLayer(name) {
        this.$store.commit('setSelectedLayer', name);
      },
      openFullscreen() {
        this.$router.push({ path: '/metadata/dataset-for-testing-geoservices/map' });
      },
      setShow3d(value) {
        this.$store.commit('setShow3d', value);
      },
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
