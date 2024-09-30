<template>
  <v-card id="MetadataGeo">
    <v-card-title>
      <v-row justify="end" align="center" no-gutters>
        <v-col class="text-h6 metadata_title grow" align-self="start">
          {{ METADATA_LOCATION_TITLE }}
        </v-col>

        <v-col v-if="mapEditable"
               class="flex-grow-0 pl-2 pr-4">
          <BaseRectangleButton
            :color="$vuetify.theme.themes.light.colors.secondary"
            buttonText="Upload GeoJSON"
            tooltipText="File Drop Also Possible"
            tooltipPosition="top"
            @clicked="triggerFileUpload"
          />
        </v-col>

        <v-col v-if="mapEditable"
               class="flex-grow-0 pl-2">
          <BaseIconButton
            :disabled="!undoButtonEnabled"
            :icon="mdiUndo"
            color="accent"
            icon-color="black"
            outlined
            outline-color="black"
            tooltip-text="Undo"
            @clicked="triggerGeomUndo"
          />
        </v-col>

        <v-col v-if="mapEditable"
                class="flex-grow-0 pl-2">
          <BaseIconButton
            :disabled="!saveButtonEnabled"
            :loading="saveButtonInProgress"
            :icon="mdiContentSave"
            icon-color="black"
            color="accent"
            outlined
            outline-color="black"
            tooltip-text="Save"
            @clicked="triggerGeomSave"
          />
        </v-col>

        <v-col class="flex-grow-0 pl-2">
          <BaseIconButton
            v-if="showFullscreenButton"
            :icon="mdiArrowCollapseAll"
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
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import { eventBus, INJECT_MAP_FULLSCREEN } from '@/factories/eventBus';
import { METADATA_LOCATION_TITLE } from '@/factories/metadataConsts';
import MapRoot from '@/modules/metadata/components/Geoservices/MapRoot.vue';
import { mdiArrowCollapseAll, mdiContentSave, mdiUndo } from '@mdi/js';

export default {
  name: 'MetadataGeo',
  components: {
    MapRoot,
    BaseIconButton,
    BaseRectangleButton,
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
    saveButtonEnabled: {
      type: Boolean,
      default: false,
    },
    saveButtonInProgress: {
      type: Boolean,
      default: false,
    },
    undoButtonEnabled: {
      type: Boolean,
      default: false,
    },
    showFullscreenButton: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
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
    mdiArrowCollapseAll,
    mdiContentSave,
    mdiUndo,
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
