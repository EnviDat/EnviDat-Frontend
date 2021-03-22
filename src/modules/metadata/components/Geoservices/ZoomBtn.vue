<template>
  <v-container class="pa-0 unselectable">

    <v-row justify="center" class="btn zoom_in elevation-10" @click="$emit('zoomIn')">
      <v-icon class="icon">
        add
      </v-icon>
    </v-row>
    <v-divider light></v-divider>

    <v-row justify="center" class="btn zoom_out elevation-10" @click="$emit('zoomOut')">
      <v-icon class="icon">
        remove
      </v-icon>
    </v-row>

    <v-row justify="center" class="btn zoom_geom mt-1 elevation-10" @click="$emit('zoomToGeometry')">
      <v-icon class="icon">
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
    height: 25px;
    width: 25px;
    font-weight: bold;
    cursor: pointer;
    font-size: 10pt;
    background-color: white;
    transition: all 0.2s;
  }
  .icon {
    height:auto;
    align-self: center;
    color: black;
    font-weight: bold;
    font-size: 14pt;
  }
  .btn:hover {
    background-color: gainsboro;
  }
  .zoom_in {
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
  }
  .zoom_out {
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .zoom_geom {
    border-radius: 4px;
  }
  .unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
  }
</style>
