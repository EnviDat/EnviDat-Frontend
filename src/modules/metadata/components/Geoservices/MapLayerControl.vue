<template>
    <v-card style="max-height: 225px;">

      <v-card-text class="py-2">
        <v-row no-gutters
                align="center">

          <v-col class="readableText">
            {{ selectedLayerName ? `Selected Layer: ${selectedLayerName}` : '' }}
          </v-col>

          <v-col v-if="selectedLayerName"
                  class="shrink"
                  cols="1">
            <BaseIconButton materialIconName="close"
                            iconColor="red"
                            fillColor="white"
                            @clicked="changeLayer(null)" />
          </v-col>

        </v-row>          
      </v-card-text>

      <v-list dense
              style="overflow-y: auto; max-height: 200px;"
              class="pt-0">

        <!-- <v-list-item>
          <v-slider min="0" max="100"
                    :value="opacity"
                    hide-details
                    @change="setOpacity" />
        </v-list-item> -->

        <v-list-item v-for="(layer, key) in layers"
                      :key="key"
                      :class="{'primary lighten-2': layer.name === selectedLayerName }"
                      @click="changeLayer(layer.name)"
                      style="min-height: 20px !important;" >
          {{ layer.title }}
        </v-list-item>
      </v-list>
    </v-card>
</template>

<script>
import BaseIconButton from '@/components/BaseElements/BaseIconButton';

export default {
  name: 'MapLayerControl',
  components: {
    BaseIconButton,
  },
  props: {
    opacity: Number,
    layers: Array,
    selectedLayerName: String,
  },
  methods: {
    changeLayer(layerName) {
      this.$emit('changeLayer', layerName);
    },
    setOpacity(value) {
      this.$emit('setOpacity', value);
    },
  },
};
</script>

<style scoped>
</style>
