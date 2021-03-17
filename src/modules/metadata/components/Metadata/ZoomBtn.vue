<template>
  <v-container class="elevation-10 pa-0 unselectable">
    <v-row justify="center" class="btn zoom_in" @click="$emit('zoomIn')">
      <v-icon>
        add
      </v-icon>
    </v-row>
    <v-divider light></v-divider>
    <v-row justify="center" class="btn zoom_out" @click="$emit('zoomOut')">
      <v-icon>
        remove
      </v-icon>
    </v-row>
    <v-row justify="center" class="btn zoom_geom mt-1" @click="$emit('zoomToGeometry')">
      <v-icon>
        zoom_out_map
      </v-icon>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'ZoomBtn',
  };
</script>

<style scoped>
  .btn {
    font-weight: bold;
    cursor: pointer;
    font-size: 10pt;
    background-color: white;
    transition: all 0.2s;
  }
  .btn:hover {
    background-color: gainsboro;
  }

  .zoom_in {
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
  }

  .zoom_out {
    border-bottom-right-radius: 5px;
    border-bottom-left-radius: 5px;
  }


  .zoom_geom {
    border-radius: 5px;
  }

  .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

</style>
