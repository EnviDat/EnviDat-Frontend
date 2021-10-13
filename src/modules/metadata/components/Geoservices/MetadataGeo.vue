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
      </v-row>
    </v-card-title>

    <v-card-text  v-if="error"
                  class="py-1 text-caption readableText"
                  :style="`line-height: 1rem; background-color: ${ $vuetify.theme.themes.light.error };`" >
      {{ error }}
    </v-card-text>

    <v-card-text style="position: relative;" >
      <Map :layer-config="layerConfig"
            :mapDivId="mapDivId"
            :selectedLayerName="selectedLayerName"
            @changeLayer="selectLayer"
            :site="site"
            :showFullscreenButton="true"
            :mapHeight="mapHeight"
            :mapEditable="mapEditable" />
    </v-card-text>

  </v-card>
</template>


<script>
import { METADATA_LOCATION_TITLE } from '@/factories/metadataConsts';

import {
  INJECT_MAP_FULLSCREEN,
  METADATA_OPEN_MODAL,
  METADATA_CLOSE_MODAL,
  eventBus,
} from '@/factories/eventBus';

import Map from './Map';
import MetadataMapFullscreen from './MetadataMapFullscreen';

export default {
  name: 'MetadataGeo',
  components: {
    Map,
  },
  props: {
    genericProps: Object,
  },
  created() {
    eventBus.$on(INJECT_MAP_FULLSCREEN, this.showFullscreenMapModal);
    eventBus.$on(METADATA_CLOSE_MODAL, this.closeModal);
  },
  beforeDestroy() {
    eventBus.$off(INJECT_MAP_FULLSCREEN, this.showFullscreenMapModal);
    eventBus.$off(METADATA_CLOSE_MODAL, this.closeModal);
  },
  computed: {
    error() {
      return this.genericProps?.error;
    },
    site() {
      return this.genericProps?.site;
    },
    layerConfig() {
      return this.genericProps?.layerConfig;
    },
    mapHeight() {
      return this.genericProps?.mapHeight;
    },
    mapEditable() {
      return this.genericProps?.mapEditable;
    },
    mapDivId() {
      return this.genericProps?.mapDivId;
    },
  },
  methods: {
    triggerFullscreen() {
      // console.log(`triggerFullscreenEvent ${this.layerConfig}`);
      eventBus.$emit(INJECT_MAP_FULLSCREEN, this.layerConfig);
    },
    selectLayer(layerName) {
      this.selectedLayerName = layerName;
    },
    showFullscreenMapModal() {
      this.fullScreenComponent = MetadataMapFullscreen;
      eventBus.$emit(METADATA_OPEN_MODAL);
    },
    closeModal() {
      this.fullScreenComponent = null;
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
    selectedLayerName: '',
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
