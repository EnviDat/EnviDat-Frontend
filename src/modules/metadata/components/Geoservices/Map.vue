<template>
  <div style="height: 100%; width: 100%; z-index: 100; max-width: 100%; position: relative;">

    <div :class="config.timeseries ? 'map-container-timeslider' : 'map-container'">
      <v-row class="top-slot" no-gutters>
        <slot name="top"></slot>
      </v-row>

      <v-icon @click="layerControlOpen = !layerControlOpen" class="icon elevation-5" style="position: absolute; top: 95px; color: black; background-color: white; z-index: 999; margin-left: 10px; border-radius: 4px;">
        layers
      </v-icon>

      <map-layer-control
        v-if="layerControlOpen"
        :layers="config.layers"
        :selected="selectedLayerName"
        @select="select"
        @setOpacity="setOpacity"
        :opacity="opacity"
        style="position: absolute; z-index: 999; top: 95px; bottom: 150px; left: 35px;"
      ></map-layer-control>

      <feature-info
        :div-id="`${mapDivId}_graph`"
        v-if="featureinfo.length > 0"
        :layers="config.layers"
        :selected="selectedLayerName"
        style="position: absolute; top: 5px; z-index: 1000000; height: 200px; right: 50px; left: 50px;"
      ></feature-info>

      <div v-if="!hasGeom" style="color: red;">No data to show</div>
      <map-leaflet v-if="!show3d" :layer="selectedLayer" :map-div-id="mapDivId" :points="featureinfo" :opacity="opacity">
        <slot></slot><br>
        <v-btn fab small @click="setShow3d(true)" class="my-1">3D</v-btn>
      </map-leaflet>
      <map-cesium v-if="show3d" :layer="selectedLayer" :map-div-id="mapDivId" :opacity="opacity">
        <slot></slot><br>
        <v-btn fab small @click="setShow3d(false)" class="my-1">2D</v-btn>
      </map-cesium>
    </div>
    <div class="timeslider-container" v-if="config.timeseries" style="position: relative;">
      <timeslider
        style="height: 100px; z-index: 10000; position: relative;"
        @select="select"
        :chart-data="config.layers"
        :div-id="`timeslider_${mapDivId}`"
        :selected="selectedLayerName"
      ></timeslider>
    </div>

  </div>
</template>

<script>
  import MapLeaflet from './MapLeaflet';
  import MapCesium from './MapCesium';
  import MapLayerControl from './MapLayerControl';
  import Timeslider from './Timeslider';
  import FeatureInfo from './FeatureInfo';

  export default {
    name: 'Map',
    components: {
      FeatureInfo,
      Timeslider,
      MapLayerControl,
      MapCesium,
      MapLeaflet,
    },
    props: {
      config: { type: Object, required: true },
      mapDivId: { type: String, required: true },
      selectedLayerName: { type: String },
      show3d: { type: Boolean },
    },
    data: () => ({
      layerControlOpen: false,
      opacity: 100,
    }),
    computed: {
      featureinfo() {
        return this.$store.state.geoservices.timeseries;
      },
      selectedLayer() {
        if (!this.selectedLayerName) {
          return null;
        }
        const layer = this.config.layers.find(l => l.name === this.selectedLayerName);
        layer.baseURL = this.config.baseURL;
        layer.bbox = this.config.bbox;
        layer.type = 'wms'; // this.config.type || 'wms';
        return layer;
      },
      hasGeom() {
        return !!this.config;
      },
    },
    methods: {
      setShow3d(value) {
        this.$emit('setShow3d', value);
      },
      setOpacity(value) {
        this.opacity = value;
      },
      select(layerName) {
        this.$emit('changeLayer', layerName);
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

</style>
