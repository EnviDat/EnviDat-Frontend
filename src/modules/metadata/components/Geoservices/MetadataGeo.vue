<template>
  <v-card id="MetadataGeo" >

    <v-card-title >
      <v-row justify="end"
              align="center"
              no-gutters>

        <v-col class="title metadata_title grow"
                align-self="start">
          {{ METADATA_LOCATION_TITLE }}
        </v-col>

        <v-col class="shrink metadataTitleIcons" >
          <BaseIconLabelView :icon="getGeoJSONIcon()" />
        </v-col>

        <v-col class="shrink pl-2">

          <BaseIconButton materialIconName="zoom_out_map"
                          iconColor="black"
                          :fillColor="$vuetify.theme.themes.light.accent"
                          @clicked="triggerFullscreen" />

        </v-col>

      </v-row>
    </v-card-title>

    <v-card-text class="py-1 text-caption readableText"
                  :style="`line-height: 1rem; background-color: ${ $vuetify.theme.themes.light.accent };`" >
      Checkout the new experimental Geoservice Features: 3D Map, Fullscreen with map comparison. There might be bugs.
    </v-card-text>

    <v-card-text v-if="error"
                  class="py-1 text-caption readableText"
                  :style="`line-height: 1rem; background-color: ${ $vuetify.theme.themes.light.error };`" >
      {{ error }}
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
  import { METADATA_LOCATION_TITLE } from '@/factories/metadataConsts';

  import {
    INJECT_MAP_FULLSCREEN,
    eventBus,
  } from '@/factories/eventBus';

  import BaseIconButton from '@/components/BaseElements/BaseIconButton';
  import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView';
  import Map from './Map';

  export default {
    name: 'MetadataGeo',
    components: {
      Map,
      BaseIconButton,
      BaseIconLabelView,
    },
    props: {
      genericProps: Object,
    },
    mounted() {

      if (this.wmsUrl) {
        this.$store.dispatch('fetchWmsConfig', this.wmsUrl);
      }

      // if (this.configUrl) {
      //   this.$store.dispatch('fetchLayerConfig', this.configUrl);
      // }
    },
    computed: {
      isReady() {
        return (!this.wmsUrl && !this.configUrl) || ((this.wmsUrl || this.configUrl));
        // return (!this.wmsUrl && !this.configUrl) || ((this.wmsUrl || this.configUrl) && this.layerConfig !== null);
      },
      hasData() {
        return this.layerConfig;
      },
      error() {
        return this.genericProps?.error;
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
      // configUrl() {
      //   return this.genericProps?.configUrl;
      // },
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
      triggerFullscreen() {
        // console.log(`triggerFullscreenEvent ${this.layerConfig}`);
        eventBus.$emit(INJECT_MAP_FULLSCREEN, this.layerConfig);
      },
      setLayer(name) {
        this.$store.commit('setSelectedLayer', name);
      },
      getGeoJSONIcon() {
        return this.mixinMethods_getGeoJSONIcon(this.site?.type);
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
      METADATA_LOCATION_TITLE,
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
