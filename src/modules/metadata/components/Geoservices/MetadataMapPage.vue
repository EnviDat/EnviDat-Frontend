<template>
  <div style="height: 100%; width: 100%;" v-if="layerConfig && ready">
    <v-card
      style="position: absolute; top: 0; right: 0; z-index: 200; background-color: rgba(255, 255, 255, 0.6);"
      class="ma-2">
      <base-icon-button class="ma-2"
                        material-icon-name="close"
                        icon-color="primary"
                        color="primary"
                        outlined
                        tool-tip-text="Close Metadata"
                        :tool-tip-bottom="true"
                        @clicked="close"/>
    </v-card>
    <v-card v-if="splitScreen"
            class="pa-0 ma-0" style="height: 100%;" :key="'split'">
      <div style="width: 50%; max-width: 50%; float: left; height: 100%; position: relative;">
        <Map
          :layer-config="layerConfig"
          :map-div-id="'map1'"
          @changeLayer="setLayer"
          :key="'map1'"
          :selected-layer-name="selectedLayer"
          @setShow3d="setShow3d"
          :show3d="show3d"
          :site="site"
        >
          <template v-slot:top>
            <v-btn icon outlined color="red" style="display: inline-block; background-color: #cccccc" @click="quitSplitFrom(1)">
              <v-icon>close</v-icon>
            </v-btn>
          </template>
        </Map>
      </div>
      <div style="width: 50%; float: left; position: relative; border-left: 1px solid gray;">
        <Map
          :layer-config="layerConfig"
          :map-div-id="'map2'"
          @changeLayer="setLayerSplit"
          :key="'map2'"
          :selected-layer-name="splitLayer"
          @setShow3d="setShow3dSplit"
          :show3d="show3dSplit"
          :site="site"
        >
          <template v-slot:top>
            <v-btn icon outlined color="red" style="background-color: #cccccc" @click="quitSplitFrom(2)">
              <v-icon>close</v-icon>
            </v-btn>
          </template>
        </Map>
      </div>
    </v-card>

    <v-card v-else
          class="pa-0 ma-0"
          style="height: 100%; width: 100%; top: 0; position: absolute;"
          :key="'map0'">
      <div style="width: 100%; height: 100%;">
        <Map
          :layer-config="layerConfig"
          @changeLayer="setLayer"
          :map-div-id="'map0'"
          :selected-layer-name="selectedLayer"
          @setShow3d="setShow3d"
          :show3d="show3d"
          :site="site"
        >
          <v-btn color="primary" @click="startSplit" fab small>
            <v-icon style="height:auto;">vertical_split</v-icon>
          </v-btn>
        </Map>
      </div>
    </v-card>
  </div>
</template>

<script>
  import BaseIconButton from '@/components/BaseElements/BaseIconButton';
  import Map from './Map';

  export default {
    name: 'MetadataMapPage',
    components: {
      Map,
      BaseIconButton,
    },
    data() {
      return {
        ready: false,
      };
    },
    computed: {
      site() {
        return this.$store.state.geoservices.site;
      },
      splitScreen() {
        return this.$store.state.geoservices.splitScreen;
      },
      splitLayer() {
        return this.$store.state.geoservices.splitLayer;
      },
      selectedLayer() {
        return this.$store.state.geoservices.selectedLayer;
      },
      layerConfig() {
        return this.$store.state.geoservices.layerConfig;
      },
      show3d() {
        return this.$store.state.geoservices.show3d;
      },
      show3dSplit() {
        return this.$store.state.geoservices.show3dSplit;
      },
    },
    methods: {
      setShow3d(value) {
        this.$store.commit('setShow3d', value);
      },
      setShow3dSplit(value) {
        this.$store.commit('setShow3dSplit', value);
      },
      setLayer(name) {
        this.$store.commit('setSelectedLayer', name);
      },
      setLayerSplit(name) {
        this.$store.commit('setSplitLayer', name);
      },
      quitSplitFrom(mapId) {
        if (mapId === 1) {
          this.$store.commit('setSelectedLayer', this.splitLayer);
        }
        this.$store.commit('setSplitScreen', false);
      },
      startSplit() {
        this.$store.commit('setSelectedLayer', this.selectedLayer);
        this.$store.commit('setSplitScreen', true);
      },
      close() {
        this.$emit('close');
      },
    },
    mounted() {
      // Wait for dialog transition to complete
      setTimeout(() => { this.ready = true; }, 50);
    },
  };
</script>

<style scoped>

</style>
