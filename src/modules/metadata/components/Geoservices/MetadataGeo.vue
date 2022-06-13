<template>
  <v-card id="MetadataGeo">
    <v-card-title>
      <v-row justify="end" align="center" no-gutters>
        <v-col class="text-h6 metadataComponentTitle grow" align-self="start">
          {{ METADATA_LOCATION_TITLE }}
        </v-col>

        <v-col class="shrink pl-2">
          <BaseIconButton v-if="showFullscreenButton"
                          materialIconName="zoom_out_map"
                          iconColor="black"
                          :fillColor="$vuetify.theme.themes.light.accent"
                          @clicked="triggerFullscreen"
                        />
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text v-if="error"
                  class="py-1 text-caption readableText"
                  :style="`line-height: 1rem; background-color: ${$vuetify.theme.themes.light.error};`" >
      {{ error }}
    </v-card-text>

    <v-card-text style="position: relative">
      <Map
        :layer-config="layerConfig"
        :mapDivId="mapDivId"
        :selectedLayerName="selectedLayerName"
        @changeLayer="selectLayer"
        :site="site"
        :mapHeight="mapHeight"
        :mapEditable="mapEditable"
        :isGcnet="isGcnet"
      />
    </v-card-text>

    <v-row v-if="editErrorMessage"
           justify="end"
           align="center"
           no-gutters>

      <v-card-text
        class="text-caption readableText"
        align="center"
        :style="`line-height: 1rem; background-color: ${$vuetify.theme.themes.light.error};`"
      >
        {{ editErrorMessage }}
      </v-card-text>
    </v-row>

  </v-card>
</template>

<script>
import { METADATA_LOCATION_TITLE } from '@/factories/metadataConsts';

import {
  INJECT_MAP_FULLSCREEN,
  eventBus,
} from '@/factories/eventBus';

import BaseIconButton from '@/components/BaseElements/BaseIconButton';

import Map from './Map';

export default {
  name: 'MetadataGeo',
  components: {
    Map,
    BaseIconButton,
  },
  props: {
    genericProps: Object,
    editErrorMessage: String,
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
    isGcnet() {
      return this.genericProps?.isGcnet;
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
    showFullscreenButton() {
      return this.genericProps?.showFullscreenButton;
    },
  },
  methods: {
    triggerFullscreen() {
      eventBus.$emit(INJECT_MAP_FULLSCREEN, { site: this.site, layerConfig: this.layerConfig });
    },
    selectLayer(layerName) {
      this.selectedLayerName = layerName;
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
