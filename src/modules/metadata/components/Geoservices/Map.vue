<template>
  <v-container id="MapComponent"
                fluid
                class="fill-height pa-0" >

    <MapOverlayUI :style="`position: absolute; top: 16px;
                        z-index: 1000;
                        width: ${showMapSplitCloseButton ? '50' : '95'}%;
                        height: 95%; `"
                :baseMapLayerName="currentBaseMapLayer"
                :layerConfig="layerConfig"
                :site="site"
                :mapDivId="mapDivId"
                :selectedLayerName="selectedLayerName"
                :mapIs3D="mapIn3D"
                :showMapSplitButton="showMapSplitButton"
                :showFullscreenButton="showFullscreenButton"
                :showMapSplitCloseButton="showMapSplitCloseButton"
                @changeLayer="changeLayer"
                @changeOpacity="changeOpacity"
                @toggleMapIn3D="toggle3D" /> 

    <v-row no-gutters
            class="fill-height" >
      <v-col class="fill-height">

        <map-cesium v-if="mapIn3D"
                    :baseMapLayerName="currentBaseMapLayer"
                    :wmsLayer="selectedLayer"
                    :map-div-id="mapDivId"
                    :opacity="opacity"
                    :site="site"
                    :max-extent="maxExtent" 
                    :height="height" >
                    <!-- :featureInfoPts="featureinfo" -->
        </map-cesium>

        <map-leaflet v-if="!mapIn3D"
                      :baseMapLayerName="currentBaseMapLayer"
                      :wmsLayer="selectedLayer"
                      :max-extent="maxExtent"
                      :map-div-id="mapDivId"
                      :opacity="opacity"
                      :site="site"
                      :mapHeight="mapHeight" 
                      :mapEditable="mapEditable" >
                      <!-- :featureInfoPts="featureinfo" -->
        </map-leaflet>

      </v-col>
    </v-row>

  </v-container>
</template>

<script>
  import {
    MAP_TOGGLE_BASE_LAYER,
    eventBus,
  } from '@/factories/eventBus';

  import {
    buffer as tBuffer,
    centroid as tCentroid,
    envelope as tEnvelope,
  } from '@turf/turf';

  import { 
    LOCATION_TYPE_POINT,
    LOCATION_TYPE_MULTIPOINT,
  } from '@/factories/metaDataFactory';

  import MapLeaflet from './MapLeaflet';
  // import MapCesium from './MapCesium';
  import MapOverlayUI from './MapOverlayUI';

  export default {
    name: 'Map',
    components: {
      // MapCesium,
      MapLeaflet,
      MapOverlayUI,
    },
    props: {
      baseMapLayer: String,
      layerConfig: Object,
      site: Object,
      mapDivId: {
        type: String, 
        default: 'map-small'
      },
      selectedLayerName: { type: String },
      showMapSplitButton: Boolean,
      showMapSplitCloseButton: Boolean,
      showFullscreenButton: {
        type: Boolean,
        default: true,
      },
      mapHeight: {
        type: Number,
        default: 0,
      },
      mapEditable: {
        type: Boolean,
        default: false,
      },
      webpIsSupported: Boolean,
    },
    mounted() {
      eventBus.$on(MAP_TOGGLE_BASE_LAYER, this.toggleBaseMapLayer);
    },
    beforeDestroy() {
      eventBus.$off(MAP_TOGGLE_BASE_LAYER, this.toggleBaseMapLayer);
    },
    computed: {
      maxExtent() {
        let extent = null;

        if (this.site) {

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
          let enve = tBuffer(this.site, zoomDist, { units: 'kilometers' });
          enve = tEnvelope(enve);

          // Convert from geometry to extent object
          extent = {
            minx: enve.geometry.coordinates[0][0][0],
            miny: enve.geometry.coordinates[0][0][1],
            maxx: enve.geometry.coordinates[0][2][0],
            maxy: enve.geometry.coordinates[0][2][1],
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
        // return null;

        if (!this.layerConfig || !this.selectedLayerName) {
          return null;
        }
        const layer = this.layerConfig.layers.find(l => l.name === this.selectedLayerName);
        layer.baseURL = this.layerConfig.baseURL;
        layer.bbox = this.layerConfig.bbox;
        return layer;
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
