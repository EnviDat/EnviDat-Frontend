<template>
  <v-container id="MapRoot" fluid class="fill-height pa-0">
    <MapOverlayUI
      :style="
        `position: absolute; top: 0;
                        z-index: 1000;
                        width: ${showMapSplitCloseButton ? '50' : '95'}%;
                        height: 95%; `
      "
      :baseMapLayerName="currentBaseMapLayer"
      :layerConfig="layerConfig"
      :site="site"
      :mapDivId="mapDivId"
      :selectedLayerName="selectedLayerName"
      :mapIs3D="mapIn3D"
      :showMapSplitButton="showMapSplitButton"
      :showMapSplitCloseButton="showMapSplitCloseButton"
      @changeLayer="changeLayer"
      @changeOpacity="changeOpacity"
      @toggleMapIn3D="toggle3D"
    />

    <v-row no-gutters class="fill-height">
      <v-col class="fill-height">
<!--
        <map-cesium
          v-if="mapIn3D"
          :baseMapLayerName="currentBaseMapLayer"
          :wmsLayer="selectedLayer"
          :map-div-id="mapDivId"
          :opacity="opacity"
          :site="site"
          :max-extent="maxExtent"
          :mapHeight="mapHeight"
        >
        </map-cesium>
-->

        <map-leaflet
          v-if="!mapIn3D"
          :baseMapLayerName="currentBaseMapLayer"
          :wmsLayer="selectedLayer"
          :max-extent="maxExtent"
          :map-div-id="mapDivId"
          :opacity="opacity"
          :site="site"
          :mapHeight="mapHeight"
          :mapEditable="mapEditable"
          :isGcnet="isGcnet"
        >
          <!-- :featureInfoPts="featureinfo" -->
        </map-leaflet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  buffer as tBuffer,
  centroid as tCentroid,
  envelope as tEnvelope,
} from '@turf/turf';

import { eventBus,MAP_TOGGLE_BASE_LAYER } from '@/factories/eventBus';
import {
  LOCATION_TYPE_GEOMCOLLECTION,
  LOCATION_TYPE_MULTIPOINT,
  LOCATION_TYPE_POINT,
} from '@/factories/metaDataFactory';

/*
import MapCesium from './MapCesium.vue';
*/
import MapLeaflet from './MapLeaflet.vue';
import MapOverlayUI from './MapOverlayUI.vue';

export default {
  name: 'MapRoot',
  components: {
/*
    MapCesium,
*/
    MapLeaflet,
    MapOverlayUI,
  },
  props: {
    baseMapLayer: String,
    layerConfig: Object,
    site: Object,
    mapDivId: {
      type: String,
      default: 'map-small',
    },
    selectedLayerName: { type: String },
    showMapSplitButton: Boolean,
    showMapSplitCloseButton: Boolean,
    mapHeight: {
      type: Number,
      default: 0,
    },
    mapEditable: {
      type: Boolean,
      default: false,
    },
    isGcnet: {
      type: Boolean,
      default: false,
    },
    webpIsSupported: Boolean,
  },
  mounted() {
    eventBus.on(MAP_TOGGLE_BASE_LAYER, this.toggleBaseMapLayer);
  },
  beforeUnmount() {
    eventBus.off(MAP_TOGGLE_BASE_LAYER, this.toggleBaseMapLayer);
  },
  computed: {
    maxExtent() {
      let extent = null;
      if (this.site) {
        if (this.site.type === LOCATION_TYPE_GEOMCOLLECTION) {
          if (this.site.geometries.length === 0) {
            return extent;
          }
        }

        // default zoom distance for single Points 50km otherwise go closer
        let zoomDist = 10;
        if (this.site.type === LOCATION_TYPE_POINT) {
          zoomDist = 50;
        } else if (this.site.type === LOCATION_TYPE_MULTIPOINT) {
          zoomDist = 15;
        }
        // If the centroid of the geometry is above 60° or below -60°
        // zoom out even futher
        const centroid = tCentroid(this.site);
        if (Math.abs(centroid.geometry.coordinates[1]) > 60) {
          zoomDist = 200;
        }

        // Depending on points and their latitudinal location, we want a buffered maxExtent for the map
        // const bbox = tEnvelope(this.site);
        let envelope = tBuffer(this.site, zoomDist, { units: 'kilometers' });
        envelope = tEnvelope(envelope);

        // Convert from geometry to extent object
        extent = {
          minx: envelope.geometry.coordinates[0][0][0],
          miny: envelope.geometry.coordinates[0][0][1],
          maxx: envelope.geometry.coordinates[0][2][0],
          maxy: envelope.geometry.coordinates[0][2][1],
        };
      } else if (this.layerConfig) {
        extent = this.layerConfig.bbox;
      }

      return extent;
    },
    featureinfo() {
      return this.$store.state.geoservices.timeseries;
    },
    selectedLayer() {
      return null;
      /*
      if (!this.layerConfig || !this.selectedLayerName) {
        return null;
      }
      const layer = this.layerConfig.layers.find(
        (l) => l.name === this.selectedLayerName,
      );
      layer.baseURL = this.layerConfig.baseURL;
      layer.bbox = this.layerConfig.bbox;
      return layer;
*/
    },
  },
  methods: {
    toggle3D() {
      this.mapIn3D = !this.mapIn3D;
    },
    changeOpacity(value) {
      this.opacity = value;
    },
    changeLayer(layerName) {
      this.$emit('changeLayer', layerName, this.mapDivId);
    },
    toggleBaseMapLayer(mapId) {
      if (this.mapDivId !== mapId) {
        return;
      }

      if (this.currentBaseMapLayer === 'streets') {
        this.currentBaseMapLayer = 'satellite';
      } else {
        this.currentBaseMapLayer = 'streets';
      }
    },
  },
  data: () => ({
    layerControlOpen: false,
    opacity: 100,
    mapIn3D: false,
    currentBaseMapLayer: 'streets',
  }),
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
</style>
