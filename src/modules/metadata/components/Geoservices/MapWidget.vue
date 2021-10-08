<template>
    <div id="MapWidget" 
          class="pa-2 overlayInteraction">

    <v-row no-gutters >
      <v-col >

        <v-row no-gutters >
          <v-col class="shrink" >
            <BaseIconButton materialIconName="add"
                            iconColor="black"
                            fillColor="white"
                            color="secondary"
                            outlined
                            @clicked="triggerZoomIn" />
          </v-col>

          <v-col class="px-1 shrink" >
            <BaseIconButton materialIconName="remove"
                            iconColor="black"
                            fillColor="white"
                            color="secondary"
                            outlined
                            @clicked="triggerZoomOut" />
          </v-col>

          <v-col class="px-2 shrink" >
            <BaseIconButton materialIconName="filter_center_focus"
                            iconColor="black"
                            fillColor="white"
                            color="secondary"
                            outlined
                            @clicked="triggerZoomCenter" />
          </v-col>
        </v-row>

      </v-col>

      <v-col class="ml-auto" >

        <v-row no-gutters >
          <v-col v-if="showMapSplitButton"
                  class="shrink" >
                <!-- style="position: absolute; top: 0; left: 45%;" -->
            <BaseIconButton materialIconName="vertical_split"
                            iconColor="black"
                            :fillColor="$vuetify.theme.themes.light.accent"
                            @clicked="triggerSplit" />
          </v-col>

          <v-col v-if="showMapSplitCloseButton"
                  class="shrink" >
                <!-- style="position: absolute; top: 0; left: 45%;" -->
            <BaseIconButton materialIconName="close"
                            iconColor="red"
                            fillColor="white"
                            @clicked="triggerSplitEnd" />
          </v-col>
        </v-row>
      </v-col>

    </v-row>

    <v-row no-gutters
            class="pt-3" >
      <v-col class="shrink">

        <BaseIconButton color="black"
                        :fillColor="$vuetify.theme.themes.light.accent"
                        @clicked="toggle3D" >
                        {{ mapIs3D ? '2D' : '3D' }}
        </BaseIconButton>

      </v-col>


    </v-row>
    
    <v-row  v-if="layerConfig"
              class="d-flex flex-column"
              no-gutters >

      <v-col v-if="site" 
              cols="1"
              class="py-2 shrink" >
        <BaseIconButton materialIconName="location_on"
                        iconColor="black"
                        fillColor="white"
                        disabled
                        @clicked="showSite = !showSite" />
      </v-col>

      <v-col class="pb-2 shrink" >
        <v-row no-gutters>

          <v-col class="shrink"
                  cols="1" >
            <BaseIconButton materialIconName="layers"
                            iconColor="black"
                            fillColor="white"
                            @clicked="layerControlOpen = !layerControlOpen" />
          </v-col>

          <v-col v-if="layerControlOpen">
            <v-card >
              <v-card-text class="readableText">
                {{ layerConfigTitle }}
              </v-card-text>
            </v-card>
          </v-col>

        </v-row>
      </v-col>

      <v-col v-if="!layerControlOpen && selectedLayerName"
              class="pb-2 shrink" >
            <v-card max-width="25%">
              <v-card-text class="readableText">
                {{ `Active Layer: ${selectedLayerName}` }}
              </v-card-text>
            </v-card>
      </v-col>

      <v-col v-if="layerControlOpen"
              class="pb-2 shrink" >
        <map-layer-control :layers="layerConfig.layers"
                            :selectedLayerName="selectedLayerName"
                            @changeLayer="changeLayer"
                            @changeOpacity="changeOpacity"  />
      </v-col>

      <v-col v-if="featureinfo.length > 0"
              cols="12 shrink">

        <feature-info :div-id="`${mapDivId}_graph`"
                      :layers="layerConfig.layers"
                      :selectedLayerName="selectedLayerName" />

          <!-- style="position: absolute; top: 5px; z-index: 1000000; height: 200px; right: 50px; left: 50px;" -->
          
      </v-col>
    </v-row>

    <div style="position: absolute; bottom: 50px;" >
      <v-card ripple
              class="pa-0"
              style="width: 48px; height: 48px;"
              @click="toggleBaseMap">
        <img width="40"
              height="40"
              :src="baseMapImage"
              class="ma-1">
      </v-card>
    </div>

  </div>

</template>

<script>
  import BaseIconButton from '@/components/BaseElements/BaseIconButton';
  import {
    MAP_ZOOM_IN,
    MAP_ZOOM_OUT,
    MAP_ZOOM_CENTER,
    MAP_COMPARE_START,
    MAP_COMPARE_END,
    MAP_TOGGLE_BASE_LAYER,
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
      baseMapLayerName: String,
      layerConfig: Object,
      site: Object,
      mapDivId: {
        type: String,
        required: true,
      },
      selectedLayerName: { type: String },
      mapIs3D: Boolean,
      showMapSplitButton: Boolean,
      showMapSplitCloseButton: Boolean,
      showFullscreenButton: Boolean,
    },
    created() {
      // console.log(this.showMapSplitButton);
      this.loadBaseMapImages();
    },
    data: () => ({
      layerControlOpen: false,
      opacity: 100,
      showSite: true,
      mapIn3D: false,
    }),
    computed: {
      layerConfigTitle() {
        return `WMS Config Title: ${this.layerConfig?.title}`;
        // return `${this.layerConfig?.title} ${this.layerConfig?.ContactInformation?.ContactPersonPrimary?.ContactOrganization}`;
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
      baseMapImage() {
        return this.baseMapLayerName === 'streets' ? this.baseMapSatelliteImg : this.baseMapStreetsImg;
      },
    },
    methods: {
      loadBaseMapImages() {
        if (this.$store) {
          this.baseMapSatelliteImg = this.mixinMethods_getWebpImage('map/baseMap-satellite-icon', this.$store.state);
          this.baseMapStreetsImg = this.mixinMethods_getWebpImage('map/baseMap-streets-icon', this.$store.state);
        } else {
          // Fallback import .png
          import('@/assets/map/baseMap-satellite-icon.png')
          .then((imgImport) => {
            this.baseMapSatelliteImg = imgImport.default;
          });
          import('@/assets/map/baseMap-streets-icon.png')
          .then((imgImport) => {
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
        eventBus.$emit(MAP_ZOOM_IN, this.mapDivId);
      },
      triggerZoomOut() {
        eventBus.$emit(MAP_ZOOM_OUT, this.mapDivId);
      },
      triggerZoomCenter() {
        eventBus.$emit(MAP_ZOOM_CENTER, this.mapDivId);
      },
      triggerSplit() {
        eventBus.$emit(MAP_COMPARE_START, this.mapDivId);
        this.triggerZoomCenter();
      },
      triggerSplitEnd() {
        eventBus.$emit(MAP_COMPARE_END, this.mapDivId);
      },
      toggle3D() {
        this.$emit('toggleMapIn3D');
      },
      toggleBaseMap() {
        eventBus.$emit(MAP_TOGGLE_BASE_LAYER, this.mapDivId);
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

  .overlayInteraction .col,
  .overlayInteraction .v-card {
    pointer-events: auto;
  }

  /* .overlayInteraction .v-btn {
    pointer-events: auto !important;
  } */

</style>
