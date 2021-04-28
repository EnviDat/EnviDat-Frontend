<template>
  <v-container id="MapComponet"
                fluid
                class="fill-height pa-0" >

    <MapWidget :style="`position: absolute; top: 16px;
                        z-index: 1000;
                        width: ${showMapSplitCloseButton ? '50' : '96'}%;
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
                @toggleMapIn3D="toggle3D" /> 

    <v-row no-gutters
            class="fill-height" >
      <v-col class="fill-height">

        <!-- <div style="height:100%; background-color: green;" ></div> -->

    <!-- <div class="fill-height" :class="layerConfig && layerConfig.timeseries ? 'map-container-timeslider' : 'map-container'"> -->

      <map-cesium v-if="mapIn3D"
                  :baseMapLayerName="currentBaseMapLayer"
                  :wmsLayer="selectedLayer"
                  :map-div-id="mapDivId"
                  :featureInfoPts="featureinfo"
                  :opacity="opacity"
                  :site="site"
                  :max-extent="maxExtent" 
                  :height="height" >
      </map-cesium>

      <map-leaflet v-else
                    :baseMapLayerName="currentBaseMapLayer"
                    :wmsLayer="selectedLayer"
                    :max-extent="maxExtent"
                    :map-div-id="mapDivId"
                    :featureInfoPts="featureinfo"
                    :opacity="opacity"
                    :site="site"
                    :height="height" >
      </map-leaflet>

    <!-- </div> -->

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
    distance as tDistance,
    envelope as tEnvelope,
  } from '@turf/turf';
  import MapLeaflet from './MapLeaflet';
  import MapCesium from './MapCesium';

  import MapWidget from './MapWidget';
/* eslint-disable vue/no-unused-components */

  export default {
    name: 'Map',
    components: {
      MapCesium,
      MapLeaflet,
      MapWidget,
    },
    props: {
      baseMapLayer: String,
      layerConfig: Object,
      site: Object,
      mapDivId: { type: String, required: true },
      selectedLayerName: { type: String },
      startMapIn3D: Boolean,
      showMapSplitButton: Boolean,
      showMapSplitCloseButton: Boolean,
      showFullscreenButton: Boolean,
      height: {
        type: Number,
        default: 0,
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
        if (this.site && this.site.geoJSON) {
          // Depending on points and their latitudinal location, we want a buffered maxExtent for the map
          const bbox = tEnvelope(this.site.geoJSON);
          // Get the distance of the diagonal (lower left and upper right)
          let dist = tDistance(bbox.geometry.coordinates[0][0], bbox.geometry.coordinates[0][2]);
          // If there is only one point (distance = 0)
          if (dist === 0) {
              dist = 100;
            }
            // If the centroid of the geometry is above 60° or below -60°
            if (Math.abs(tCentroid(this.site.geoJSON).geometry.coordinates[1]) > 60) {
              dist = 10000;
            }
            // Buffer
            let enve = tBuffer(bbox, ((dist + 1) / 4), { units: 'kilometers' });
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
      setOpacity(value) {
        this.opacity = value;
      },
      select(layerName) {
        this.$emit('changeLayer', layerName);
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
