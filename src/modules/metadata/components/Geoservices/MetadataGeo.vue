<template>
  <v-card id="MetadataGeo"
          class="pa-0"
  >
    <v-card-title class="py-4">
      <v-row justify="end" align="center" no-gutters>
        <v-col class="text-h6 metadata_title grow" align-self="start">
          {{ METADATA_LOCATION_TITLE }}
        </v-col>

        <v-col v-if="showFullscreenButton"
               class="flex-grow-0 pl-2">
          <BaseIconButton
            :icon="mdiArrowExpandAll"
            outlined
            outline-color="secondary"
            icon-color="black"
            @clicked="triggerFullscreen"
          />
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text
      v-if="error"
      class="py-1 text-caption readableText"
      :style="
        `line-height: 1rem; background-color: ${$vuetify.theme.themes.light.colors.error};`
      "
    >
      {{ error }}
    </v-card-text>

    <v-card-text style="position: relative">
      <MapRoot
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

    <v-row v-if="editErrorMessage" justify="end" align="center" no-gutters>
      <v-card-text
        class="text-caption readableText"
        align="center"
        :style="
          `line-height: 1rem; background-color: ${$vuetify.theme.themes.light.colors.error};`
        "
      >
        {{ editErrorMessage }}
      </v-card-text>
    </v-row>
  </v-card>
</template>

<script>
import { mdiArrowExpandAll } from '@mdi/js';
import { eventBus, INJECT_MAP_FULLSCREEN } from '@/factories/eventBus';
import { METADATA_LOCATION_TITLE } from '@/factories/metadataConsts';
import MapRoot from '@/modules/metadata/components/Geoservices/MapRoot.vue';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

export default {
  name: 'MetadataGeo',
  components: {
    MapRoot,
    BaseIconButton,
  },
  props: {
    site: {
      type: Object,
      default: undefined,
    },
    layerConfig: {
      type: Object,
      default: () => {},
    },
    mapHeight: {
      type: Number,
      default: 450,
    },
    editErrorMessage: {
      type: String,
      default: undefined,
    },
    error: {
      type: String,
      default: undefined,
    },
    isGcnet: {
      type: Boolean,
      default: false,
    },
    mapEditable: {
      type: Boolean,
      default: false,
    },
    mapDivId: {
      type: String,
      default: 'metadata-map-small',
    },
    showFullscreenButton: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
  },
  methods: {
    triggerFullscreen() {
      eventBus.emit(INJECT_MAP_FULLSCREEN, {
        site: this.site,
        layerConfig: this.layerConfig,
      });
    },
    selectLayer(layerName) {
      this.selectedLayerName = layerName;
    },
  },
  data: () => ({
    mdiArrowExpandAll,
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
