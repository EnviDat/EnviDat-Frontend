<template>
  <v-card id="MetadataLocation" >

    <v-card-title class="title metadata_title">Location</v-card-title>

    <v-card-text v-if="!hasGeom" style="color: red;">{{ emptyText }}</v-card-text>

    <v-card-text v-else-if="hasGeom">

      <metadata-location-cesium
        v-show="show3d"
        v-bind="mapSize"
        :geom="geom"
        :bbox="bbox"
        :centroid="centroid"
        :zoomExtent="zoomExtent"
        :color="color"
        :fillAlpha="fillAlpha"
        :outline-width="outlineWidth"
      >
        <v-btn v-if="enabled3d" fab small @click="show3d = false">2D</v-btn>
      </metadata-location-cesium>
      <metadata-location-leaflet
        v-show="!show3d"
        v-bind="mapSize"
        :geom="geom"
        :zoomExtent="zoomExtent"
        :color="color"
        :fillAlpha="fillAlpha"
        :outline-width="outlineWidth"
      >
        <v-btn v-if="enabled3d" fab small @click="show3d = true">3D</v-btn>
      </metadata-location-leaflet>
    </v-card-text>

  </v-card>
</template>

<script>
  // eslint-disable new-cap

  import {
 rewind as tRewind, centroid as tCentroid, distance as tDistance, buffer as tBuffer, envelope as tEnvelope,
} from '@turf/turf';

const MetadataLocationCesium = () => import('./MetadataLocationCesium');
const MetadataLocationLeaflet = () => import('./MetadataLocationLeaflet');


export default {
  name: 'MetadataLocation',
  components: { MetadataLocationLeaflet, MetadataLocationCesium },
  props: {
    genericProps: Object,
  },
  data: () => ({
    show3d: false,
    color: '#FFDA00',
    fillAlpha: 0.5,
    outlineWidth: 3,
    emptyText: 'No location found for this dataset',
  }),
  computed: {
    geom() {
      return this.genericProps ? tRewind(JSON.parse(this.genericProps.geoJSON)) : null;
    },
    centroid() {
      return tCentroid(this.geom);
    },
    bbox() {
      return tEnvelope(this.geom);
    },
    lat() {
      return this.centroid.geometry.coordinates[1];
    },
    zoomExtent() {
      let dist = tDistance(this.bbox.geometry.coordinates[0][0], this.bbox.geometry.coordinates[0][2]);
      if (dist === 0) { dist = 100; }
      if (Math.abs(this.lat) > 60) { dist = 10000; }

      let enve = tBuffer(this.bbox, ((dist + 1) / 4), { units: 'kilometers' });
      enve = tEnvelope(enve);
      return {
        minX: enve.geometry.coordinates[0][0][0],
        minY: enve.geometry.coordinates[0][0][1],
        maxX: enve.geometry.coordinates[0][2][0],
        maxY: enve.geometry.coordinates[0][2][1],
      };
    },
    enabled3d() {
      return Math.abs(this.lat) > 60;
    },
    title() {
      return this.mixinMethods_getGenericProp('title');
    },
    hasGeom() {
      return !!this.geom;
    },
    mapSize() {
      const heightSm = 300;
      const heightMd = 500;

      const fullWidth = 875;
      const lgWidth = 725;
      const mdWidth = 500;

      let width = lgWidth;
      if (this.$vuetify.breakpoint.xsOnly) { width = mdWidth; } else if (this.$vuetify.breakpoint.mdAndDown) { width = fullWidth; }

      let height = heightMd;
      if (this.$vuetify.breakpoint.smAndDown) {
        height = heightSm;
      }

      return {
        style: `width: ${width}px !important;
                  max-width: 100%;
                  height: ${height}px !important;`,
      };
    },
  },
};
</script>

<style scoped>

</style>
