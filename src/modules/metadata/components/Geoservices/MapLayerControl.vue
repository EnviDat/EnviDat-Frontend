<template>
    <v-card style="overflow-y: auto; max-height: 100%;">
      <v-list dense>
        <v-list-item>
          <v-slider min="0" max="100" :value="opacity" @change="setOpacity"></v-slider>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          v-for="(layer, key) in layers"
          :key="key"
          :class="{'primary lighten-2': layer.name === selected }"
          @click="select(layer.name)"
        >
          {{ layer.title }}
        </v-list-item>
      </v-list>
    </v-card>
</template>

<script>
    export default {
        name: 'MapLayerControl',
      props: {
          opacity: Number,
          layers: Array,
        selected: String,
        },
      methods: {
          select(layerName) {
            this.$emit('select', layerName);
          },
        setOpacity(value) {
            this.$emit('setOpacity', value);
        },
      },
    };
</script>

<style scoped>
</style>
