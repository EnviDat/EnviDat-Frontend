<template>
  <v-card id="MetadataGeo" >

    <v-card-title >
      <v-row justify="end"
              align="center"
              no-gutters>

        <v-col class="title metadata_title grow"
                align-self="start">
          {{ METADATA_LOCATION_TITLE }}
        </v-col>

        <v-col class="shrink metadataTitleIcons" >
          <BaseIconLabelView :icon="getGeoJSONIcon()" />
        </v-col>

        <v-col class="shrink pl-2">

          <BaseIconButton materialIconName="zoom_out_map"
                          iconColor="black"
                          :fillColor="$vuetify.theme.themes.light.accent"
                          @clicked="triggerFullscreen" />

        </v-col>

      </v-row>
    </v-card-title>

    <v-card-text class="py-1 text-caption readableText"
                  :style="`line-height: 1rem; background-color: ${ $vuetify.theme.themes.light.accent };`" >
      Checkout the new experimental Geoservice Features: 3D Map, Fullscreen with map comparison. There might be bugs.
    </v-card-text>

    <v-card-text v-if="error"
                  class="py-1 text-caption readableText"
                  :style="`line-height: 1rem; background-color: ${ $vuetify.theme.themes.light.error };`" >
      {{ error }}
    </v-card-text>

    <v-card-text style="position: relative;" >

      <Map :layer-config="layerConfig"
            :mapDivId="'map-small'"
            :selectedLayerName="selectedLayerName"
            @changeLayer="selectLayer"
            :site="site"
            :showFullscreenButton="true"
            :height="450" />
    </v-card-text>

  </v-card>
</template>

<script>
  import { METADATA_LOCATION_TITLE } from '@/factories/metadataConsts';

  import {
    INJECT_MAP_FULLSCREEN,
    eventBus,
  } from '@/factories/eventBus';

  import BaseIconButton from '@/components/BaseElements/BaseIconButton';
  import BaseIconLabelView from '@/components/BaseElements/BaseIconLabelView';
  import Map from './Map';

  export default {
    name: 'MetadataGeo',
    components: {
      Map,
      BaseIconButton,
      BaseIconLabelView,
    },
    props: {
      genericProps: Object,
    },
    mounted() {

    },
    computed: {
      error() {
        return this.genericProps?.error;
      },
      site() {
        return this.genericProps?.site;
      },

      layerConfig() {
        return this.genericProps?.layerConfig;
      },
    },
    methods: {
      triggerFullscreen() {
        // console.log(`triggerFullscreenEvent ${this.layerConfig}`);
        eventBus.$emit(INJECT_MAP_FULLSCREEN, this.layerConfig);
      },
      selectLayer(layerName) {
        this.selectedLayerName = layerName;
      },
      getGeoJSONIcon() {
        return this.mixinMethods_getGeoJSONIcon(this.site?.type);
      },
    },
    data: () => ({
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
