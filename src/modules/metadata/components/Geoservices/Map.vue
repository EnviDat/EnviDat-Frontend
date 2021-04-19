<template>
  <div id="MapComponet"
        class="fill-height" >

    <MapWidget style="position: absolute; top: 0; z-index: 1000;"
                :layerConfig="layerConfig"
                :site="site"
                :mapDivId="mapDivId"
                :selectedLayerName="selectedLayerName"
                :mapIs3D="mapIn3D"
                @toggleMapIn3D="toggle3D" /> 

                 
    <div :class="layerConfig && layerConfig.timeseries ? 'map-container-timeslider' : 'map-container'">
      <!-- <v-row class="top-slot" no-gutters>
        <slot name="top"></slot>
      </v-row>

      <v-icon v-if="site && layerConfig" @click="showSite = !showSite" class="icon elevation-5" style="position: absolute; top: 125px; color: black; background-color: white; z-index: 999; margin-left: 10px; border-radius: 4px;">
        location_on
      </v-icon>

      <v-icon v-if="layerConfig" @click="layerControlOpen = !layerControlOpen" class="icon elevation-5" style="position: absolute; top: 95px; color: black; background-color: white; z-index: 999; margin-left: 10px; border-radius: 4px;">
        layers
      </v-icon>

      <map-layer-control
        v-if="layerConfig && layerControlOpen"
        :layers="layerConfig.layers"
        :selected="selectedLayerName"
        @select="select"
        @setOpacity="setOpacity"
        :opacity="opacity"
        style="position: absolute; z-index: 999; top: 95px; bottom: 150px; left: 35px;"
      ></map-layer-control>

      <feature-info
        :div-id="`${mapDivId}_graph`"
        v-if="featureinfo.length > 0"
        :layers="layerConfig.layers"
        :selected="selectedLayerName"
        style="position: absolute; top: 5px; z-index: 1000000; height: 200px; right: 50px; left: 50px;"
      ></feature-info> -->

      <map-leaflet v-if="!mapIn3D"
                    :wmsLayer="selectedLayer"
                    :max-extent="maxExtent"
                    :map-div-id="mapDivId"
                    :featureInfoPts="featureinfo"
                    :opacity="opacity"
                    :site="showSite ? site : null" >
        
        <!-- <slot></slot><br>
        
        <v-btn fab small @click="setShow3d(true)" class="my-1">3D</v-btn> -->
      </map-leaflet>

      <map-cesium v-if="mapIn3D"
                  :wmsLayer="selectedLayer"
                  :map-div-id="mapDivId"
                  :featureInfoPts="featureinfo"
                  :opacity="opacity"
                  :site="showSite ? site : null"
                  :max-extent="maxExtent" >
        <!-- <slot></slot><br>

        <v-btn fab small @click="setShow3d(false)" class="my-1">2D</v-btn> -->

      </map-cesium>

    <!-- </div>
    <div class="timeslider-container" v-if="layerConfig && layerConfig.timeseries" style="position: relative;">
      <timeslider
        style="height: 100px; z-index: 10000; position: relative;"
        @select="select"
        :chart-data="layerConfig.layers"
        :div-id="`timeslider_${mapDivId}`"
        :selected="selectedLayerName"
      ></timeslider> -->
      
    </div>

  </div>
</template>

<script>

  import {
    buffer as tBuffer,
    centroid as tCentroid,
    distance as tDistance,
    envelope as tEnvelope,
  } from '@turf/turf';
  import MapLeaflet from './MapLeaflet';
  import MapCesium from './MapCesium';
  // import MapLayerControl from './MapLayerControl';
  // import Timeslider from './Timeslider';
  // import FeatureInfo from './FeatureInfo';

  import MapWidget from './MapWidget';

  export default {
    name: 'Map',
    components: {
      // FeatureInfo,
      // Timeslider,
      // MapLayerControl,
      MapCesium,
      MapLeaflet,
      MapWidget,
    },
    props: {
      layerConfig: Object,
      site: Object,
      mapDivId: { type: String, required: true },
      selectedLayerName: { type: String },
      startMapIn3D: Boolean,
    },
    computed: {
      maxExtent() {
        let extent = null;
        if (this.site) {
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
        // this.$emit('setShow3d', !this.mapIn3D);
      },
      setOpacity(value) {
        this.opacity = value;
      },
      select(layerName) {
        this.$emit('changeLayer', layerName);
      },
    },
    data: () => ({
      layerControlOpen: false,
      opacity: 100,
      showSite: true,
      mapIn3D: false,
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
