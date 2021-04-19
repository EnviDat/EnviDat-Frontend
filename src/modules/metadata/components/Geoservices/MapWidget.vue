<template>
  <v-container fluid
                id="MapWidget">
                
                <!-- class="fill-height"  -->
    <!-- <v-row class="top-slot" no-gutters>
      <v-col>
        <slot name="top"></slot>
      </v-col>
    </v-row> -->

    <v-row no-gutters
            align="start" >

      <v-col class="shrink" >
        <BaseIconButton materialIconName="add"
                        iconColor="black"
                        fillColor="white"
                        @clicked="triggerZoomIn" />
      </v-col>

      <v-col class="px-1 shrink" >
        <BaseIconButton materialIconName="remove"
                        iconColor="black"
                        fillColor="white"
                        @clicked="triggerZoomOut" />
      </v-col>

      <v-col class="px-2 shrink" >
        <BaseIconButton materialIconName="zoom_out_map"
                        iconColor="black"
                        fillColor="white"
                        @clicked="triggerZoomCenter" />
      </v-col>

    </v-row>
    
    <v-row no-gutters >
      <v-col v-if="site && layerConfig" 
              cols="12"
              class="py-1" >
        <BaseIconButton materialIconName="location_on"
                        iconColor="black"
                        fillColor="white"
                        @clicked="showSite = !showSite" />

        <!-- <v-icon v-if="site && layerConfig"
                @click="showSite = !showSite"
                class="icon elevation-5" >
            location_on
        </v-icon> -->
      </v-col>

      <v-col v-if="layerConfig"
              cols="12"
              class="pb-1" >
        <BaseIconButton materialIconName="layers"
                        iconColor="black"
                        fillColor="white"
                        @clicked="layerControlOpen = !layerControlOpen" />

        <!-- <v-icon v-if="layerConfig"
                @click="layerControlOpen = !layerControlOpen"
                class="icon elevation-5" >
          layers
        </v-icon> -->
      </v-col>
    <!-- </v-row> -->

    <!-- <v-row no-gutters > -->
      <v-col v-if="layerConfig && layerControlOpen"
              cols="12"
              class="py-1" >
        <map-layer-control
          :layers="layerConfig.layers"
          :selected="selectedLayerName"
          @select="select"
          @setOpacity="setOpacity"
          :opacity="opacity" 
        ></map-layer-control>
      </v-col>
    <!-- </v-row> -->

    <!-- <v-row no-gutters > -->
      <v-col v-if="featureinfo.length > 0"
              cols="12">

        <feature-info
          :div-id="`${mapDivId}_graph`"
          :layers="layerConfig.layers"
          :selected="selectedLayerName"
        ></feature-info>

          <!-- style="position: absolute; top: 5px; z-index: 1000000; height: 200px; right: 50px; left: 50px;" -->
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12">

        <BaseIconButton materialIconName="fullscreen"
                        iconColor="white"
                        :fillColor="$vuetify.theme.themes.light.primary"
                        @clicked="triggerFullscreen" />

      </v-col>

      <v-col cols="12">

        <BaseIconButton color="black"
                        fillColor="white"
                        @clicked="$emit('toggleMapIn3D')" >
                        {{ mapIs3D ? '2D' : '3D' }}
        </BaseIconButton>

      </v-col>

    </v-row>

    <!-- <v-row no-gutters >
      <v-col>

        <div class="timeslider-container" v-if="layerConfig && layerConfig.timeseries" style="position: relative;">
          <timeslider
            @select="select"
            :chart-data="layerConfig.layers"
            :div-id="`timeslider_${mapDivId}`"
            :selected="selectedLayerName"
          ></timeslider>

        </div>

      </v-col>
    </v-row> -->
  </v-container>

</template>

<script>
  import BaseIconButton from '@/components/BaseElements/BaseIconButton';
  import {
    INJECT_MAP_FULLSCREEN,
    MAP_ZOOM_IN,
    MAP_ZOOM_OUT,
    MAP_ZOOM_CENTER,
    eventBus,
  } from '@/factories/eventBus';

  import MapLayerControl from './MapLayerControl';
  // import Timeslider from './Timeslider';
  import FeatureInfo from './FeatureInfo';

  export default {
    name: 'MapWidget',
    components: {
      FeatureInfo,
      // Timeslider,
      MapLayerControl,
      BaseIconButton,
    },
    props: {
      layerConfig: Object,
      site: Object,
      mapDivId: { type: String, required: true },
      selectedLayerName: { type: String },
      mapIs3D: { type: Boolean },
    },
    data: () => ({
      layerControlOpen: false,
      opacity: 100,
      showSite: true,
    }),
    computed: {
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
      setOpacity(value) {
        this.opacity = value;
      },
      select(layerName) {
        this.$emit('changeLayer', layerName);
      },
      triggerFullscreen() {
        // console.log(`triggerFullscreen ${this.layerConfig}`);
        eventBus.$emit(INJECT_MAP_FULLSCREEN, this.layerConfig);
      },
      triggerZoomIn() {
        eventBus.$emit(MAP_ZOOM_IN, this.mapDivId);
      },
      triggerZoomOut() {
        eventBus.$emit(MAP_ZOOM_OUT, this.mapDivId);
      },
      triggerZoomCenter() {
        eventBus.$emit(MAP_ZOOM_CENTER, this.mapDivId);
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
