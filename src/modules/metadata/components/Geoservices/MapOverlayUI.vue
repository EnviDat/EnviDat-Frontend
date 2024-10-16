<template>
  <div id="MapOverlayUI" class="pa-2 overlayInteraction">
    <v-row no-gutters>
      <v-col>
        <v-row no-gutters>
          <v-col class="flex-grow-0">
            <BaseIconButton
              :icon="mdiPlus"
              icon-color="black"
              color="highlight"
              outlined
              outlineColor="black"
              @clicked="triggerZoomIn" />
          </v-col>

          <v-col class="px-1 flex-grow-0">
            <BaseIconButton
              :icon="mdiMinus"
              icon-color="black"
              color="highlight"
              outlined
              outlineColor="black"
              @clicked="triggerZoomOut" />
          </v-col>

          <v-col class="px-2 flex-grow-0">
            <BaseIconButton
              :icon="mdiImageFilterCenterFocus"
              icon-color="black"
              color="highlight"
              outlined
              outlineColor="black"
              @clicked="triggerZoomCenter" />
          </v-col>
        </v-row>
      </v-col>

      <v-col class="ml-auto">
        <v-row no-gutters>

          <v-col v-if="showMapSplitCloseButton" class="flex-grow-0">
            <BaseIconButton
              :icon="mdiSimpleIcons"
              icon-color="red"
              @clicked="triggerSplitEnd" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>


    <v-row v-if="layerConfig" class="d-flex flex-column" no-gutters>
      <v-col v-if="site" cols="1" class="py-2 flex-grow-0">
        <BaseIconButton
          :icon="mdiMapMarker"
          icon-color="black"
          disabled
          @clicked="showSite = !showSite" />
      </v-col>
    </v-row>

    <div style="position: absolute; bottom: 50px;">
      <v-card
        ripple
        class="pa-0"
        style="width: 48px; height: 48px;"
        @click="toggleBaseMap">
        <img width="40" height="40" :src="baseMapImage" class="ma-1" alt="toggle map tiles" />
      </v-card>
    </div>
  </div>
</template>

<script>
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import {
  eventBus,
  MAP_COMPARE_END,
  MAP_COMPARE_START,
  MAP_TOGGLE_BASE_LAYER,
  MAP_ZOOM_CENTER,
  MAP_ZOOM_IN,
  MAP_ZOOM_OUT,
} from '@/factories/eventBus';
import { getImage } from '@/factories/imageFactory';
import { mdiImageFilterCenterFocus, mdiMapMarker, mdiMinus, mdiPlus, mdiSimpleIcons } from '@mdi/js';


export default {
  name: 'MapOverlayUI',
  components: {
    BaseIconButton,
  },
  props: {
    baseMapLayerName: String,
    layerConfig: Object,
    site: Object,
    mapDivId: {
      type: String,
      required: true,
    },
    selectedLayerName: { type: String },
    mapIs3D: {
      type: Boolean,
      default: false,
    },
    showMapSplitButton: Boolean,
    showMapSplitCloseButton: Boolean,
  },
  created() {
    this.loadBaseMapImages();
  },
  data: () => ({
    mdiImageFilterCenterFocus,
    mdiMapMarker,
    mdiMinus,
    mdiPlus,
    mdiSimpleIcons,
    layerControlOpen: false,
    opacity: 100,
    showSite: true,
    mapIn3D: false,
    baseMapStreetsImg: undefined,
    baseMapSatelliteImg: undefined,
  }),
  computed: {
    layerConfigTitle() {
      return `WMS Config Title: ${this.layerConfig?.title}`;
    },
    featureinfo() {
      return this.$store.state.geoservices.timeseries;
    },
    selectedLayer() {
      if (!this.layerConfig || !this.selectedLayerName) {
        return null;
      }
      const layer = this.layerConfig.layers.find(
        l => l.name === this.selectedLayerName,
      );
      layer.baseURL = this.layerConfig.baseURL;
      layer.bbox = this.layerConfig.bbox;
      return layer;
    },
    baseMapImage() {
      return this.baseMapLayerName === 'streets'
        ? this.baseMapSatelliteImg
        : this.baseMapStreetsImg;
    },
  },
  methods: {
    loadBaseMapImages() {
      if (this.$store) {
        this.baseMapSatelliteImg = getImage('baseMap-satellite-icon');
        this.baseMapStreetsImg = getImage('baseMap-streets-icon');
      } else {
        // Fallback import .png
        import('@/assets/map/baseMap-satellite-icon.png').then(imgImport => {
          this.baseMapSatelliteImg = imgImport.default;
        });
        import('@/assets/map/baseMap-streets-icon.png').then(imgImport => {
          this.baseMapStreetsImg = imgImport.default;
        });
      }
    },
    changeOpacity(value) {
      this.$emit('changeOpacity', value);
    },
    changeLayer(layerName) {
      this.$emit('changeLayer', layerName);
    },
    triggerZoomIn() {
      eventBus.emit(MAP_ZOOM_IN, this.mapDivId);
    },
    triggerZoomOut() {
      eventBus.emit(MAP_ZOOM_OUT, this.mapDivId);
    },
    triggerZoomCenter() {
      eventBus.emit(MAP_ZOOM_CENTER, this.mapDivId);
    },
    triggerSplit() {
      eventBus.emit(MAP_COMPARE_START, this.mapDivId);
      this.triggerZoomCenter();
    },
    triggerSplitEnd() {
      eventBus.emit(MAP_COMPARE_END, this.mapDivId);
    },
    toggle3D() {
      this.$emit('toggleMapIn3D');
    },
    toggleBaseMap() {
      eventBus.emit(MAP_TOGGLE_BASE_LAYER, this.mapDivId);
    },
  },
};
</script>

<style scoped>
.top-slot {
  left: 50%;
  position: absolute;
  z-index: 9999;
  cursor: pointer;
  top: 15px;
}

.map-container {
  height: 100%;
}

.map-container-timeslider {
  height: calc(100% - 100px);
}

.timeslider-container {
  height: 100px;
}

.overlayInteraction {
  pointer-events: none;
}

.overlayInteraction .v-col,
.overlayInteraction .v-btn {
  pointer-events: auto;
}
</style>
