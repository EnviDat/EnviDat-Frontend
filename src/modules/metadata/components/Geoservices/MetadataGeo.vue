<template>
  <v-card id="MetadataGeo">
    <v-card-title>
      <v-row justify="end" align="center" no-gutters>
        <v-col class="text-h6 metadata_title grow" align-self="start">
          {{ METADATA_LOCATION_TITLE }}
        </v-col>

        <v-col v-if="mapEditable"
               class="shrink pl-2 pr-4">
          <BaseRectangleButton
            :color="$vuetify.theme.themes.light.secondary"
            buttonText="Upload GeoJSON"
            tooltipText="File Drop Also Possible"
            tooltipPosition="top"
            @clicked="triggerFileUpload"
          />
        </v-col>

        <v-col v-if="mapEditable"
               class="shrink pl-2">
          <BaseIconButton
            :disabled="!undoButtonEnabled"
            materialIconName="undo"
            iconColor="black"
            :fillColor="$vuetify.theme.themes.light.accent"
            tooltipText="Undo"
            @clicked="triggerGeomUndo"
          />
        </v-col>

        <v-col v-if="mapEditable"
                class="shrink pl-2">
          <BaseIconButton
            :disabled="!saveButtonEnabled"
            :loading="saveButtonInProgress"
            materialIconName="save"
            iconColor="black"
            :fillColor="$vuetify.theme.themes.light.accent"
            tooltipText="Save"
            @clicked="triggerGeomSave"
          />
        </v-col>

        <v-col class="shrink pl-2">
          <BaseIconButton
            v-if="showFullscreenButton"
            materialIconName="zoom_out_map"
            iconColor="black"
            :fillColor="$vuetify.theme.themes.light.accent"
            @clicked="triggerFullscreen"
          />
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text
      v-if="error"
      class="py-1 text-caption readableText"
      :style="
        `line-height: 1rem; background-color: ${$vuetify.theme.themes.light.error};`
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
          `line-height: 1rem; background-color: ${$vuetify.theme.themes.light.error};`
        "
      >
        {{ editErrorMessage }}
      </v-card-text>
    </v-row>
  </v-card>
</template>

<script>
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import { eventBus, INJECT_MAP_FULLSCREEN } from '@/factories/eventBus';
import { METADATA_LOCATION_TITLE } from '@/factories/metadataConsts';
import MapRoot from '@/modules/metadata/components/Geoservices/MapRoot.vue';

export default {
  name: 'MetadataGeo',
  components: {
    MapRoot,
    BaseIconButton,
    BaseRectangleButton,
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
      return this.genericProps?.isGcnet || false;
    },
    mapHeight() {
      return this.genericProps?.mapHeight || 450;
    },
    mapEditable() {
      return this.genericProps?.mapEditable || false;
    },
    mapDivId() {
      return this.genericProps?.mapDivId || 'metadata-map-small';
    },
    saveButtonEnabled() {
      return this.genericProps?.saveButtonEnabled || false;
    },
    saveButtonInProgress() {
      return this.genericProps?.saveButtonInProgress || false;
    },
    undoButtonEnabled() {
      return this.genericProps?.undoButtonEnabled || false;
    },
    showFullscreenButton() {
      return this.genericProps?.showFullscreenButton || false;
    },
  },
  methods: {
    triggerGeomSave() {
      this.$emit('saveGeoms');
    },
    triggerGeomUndo() {
      this.$emit('undoGeoms');
    },
    triggerFileUpload() {
      this.$emit('uploadGeomFile');
    },
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
