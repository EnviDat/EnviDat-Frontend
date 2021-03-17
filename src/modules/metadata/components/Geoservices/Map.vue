<template>
  <div style="height: 100%; width: 100%; z-index: 100; max-width: 100%; position: relative;">

    <div :class="config.timeseries ? 'map-container-timeslider' : 'map-container'">
      <v-row class="top-slot">
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
        style="position: absolute; z-index: 999; top: 95px; bottom: 150px; left: 35px;"
      ></map-layer-control>

      <div v-if="!hasGeom" style="color: red;">No data to show</div>
      <map-leaflet v-if="!show3d" :layer="selectedLayer" :map-div-id="mapDivId">
        <slot></slot><br>
        <v-btn fab small @click="show3d = true">3D</v-btn>
      </map-leaflet>
      <map-cesium v-if="show3d" :layer="selectedLayer" :map-div-id="mapDivId">
        <slot></slot><br>
        <v-btn fab small @click="show3d = false">2D</v-btn>
      </map-cesium>
    </div>
    <div class="timeslider-container" v-if="config.timeseries" style="position: relative;">
      <timeslider
        style="height: 120px; z-index: 10000; position: relative;"
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

  export default {
    name: 'Map',
    components: {
      Timeslider,
      MapLayerControl,
      MapCesium,
      MapLeaflet,
    },
    props: {
      config: { type: Object, required: true },
      mapDivId: { type: String, required: true },
      selected: { type: String },
    },
    data: () => ({
      layerControlOpen: false,
      show3d: false,
      selectedLayerName: null,
    }),
    computed: {
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
      select(layerName) {
        this.selectedLayerName = layerName;
      },
    },
    watch: {
      selectedLayerName() {
        this.$emit('changeLayer', this.selectedLayerName);
      },
    },
    mounted() {
      if (this.selected) {
        this.select(this.selected);
      } else {
        const layer = this.config.layers.find(l => l.visibility);
        this.select(layer.name);
      }
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
    height: calc(100% - 120px);
  }

  .timeslider-container {
    height: 120px;
  }


</style>
