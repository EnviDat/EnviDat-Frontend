<template>
  <v-card id="MetadataLocation" v-if="catalog">
    <v-card-title class="text-h6 metadata_title">
      {{ METADATA_LOCATION_TITLE }}
    </v-card-title>

    <v-card-text
      v-if="!hasGeom && !hasMapService"
      class="pa-4 pt-0"
      :style="`color: ${emptyTextColor};`"
    >
      {{ emptyText }}
    </v-card-text>

    <v-card-text
      v-else-if="hasGeom || (hasMapService && catalog)"
      class="pa-4 pt-0"
    >
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
        :selectedMapService="selectedMapService"
        :mapServiceUrl="genericProps.mapService.url"
      >
        <v-menu v-if="hasMapService" offset-x right top>
          <template v-slot:activator="{ on }">
            <v-btn icon small fab v-on="on" class="white elevation-4"
              ><v-icon>layers</v-icon></v-btn
            >
          </template>
          <metadata-location-catalog
            :selected="selectedMapService ? selectedMapService.id : null"
            :catalog="catalog"
            @select="selectMapService"
          ></metadata-location-catalog>
        </v-menu>
        <v-btn v-if="enabled3d" fab small @click="show3d = true">3D</v-btn>
      </metadata-location-leaflet>
    </v-card-text>
  </v-card>
</template>

<script>
import {
  buffer as tBuffer,
  centroid as tCentroid,
  distance as tDistance,
  envelope as tEnvelope,
  rewind as tRewind,
} from '@turf/turf';

import { METADATA_LOCATION_TITLE } from '@/factories/metadataConsts';

import { createWmsCatalog } from '../GeoservicesMVP/catalogWms';
import MetadataLocationCatalog from './MetadataLocationCatalog.vue';
// import MetadataLocationCesium from './MetadataLocationCesium.vue';
import MetadataLocationLeaflet from './MetadataLocationLeaflet.vue';

export default {
  name: 'MetadataLocation',
  components: {
    MetadataLocationCatalog,
    MetadataLocationLeaflet,
    // MetadataLocationCesium,
  },
  props: {
    genericProps: Object,
  },
  data: () => ({
    show3d: false,
    color: '#FFDA00',
    fillAlpha: 0.5,
    outlineWidth: 3,
    METADATA_LOCATION_TITLE,
    selectedMapService: null,
    catalog: null,
  }),
  methods: {
    selectMapService(value) {
      this.selectedMapService = value;
    },
  },
  computed: {
    emptyTextColor() {
      return this.mixinMethods_getGenericProp('emptyTextColor', 'red');
    },
    emptyText() {
      return this.mixinMethods_getGenericProp(
        'emptyText',
        'No location found for this dataset.',
      );
    },
    geom() {
      return this.genericProps ? tRewind(this.genericProps.geoJSON) : null;
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
      let extent = null;
      if (!this.hasMapService) {
        let dist = tDistance(
          this.bbox.geometry.coordinates[0][0],
          this.bbox.geometry.coordinates[0][2],
        );
        if (dist === 0) {
          dist = 100;
        }
        if (Math.abs(this.lat) > 60) {
          dist = 10000;
        }

        let enve = tBuffer(this.bbox, (dist + 1) / 4, { units: 'kilometers' });
        enve = tEnvelope(enve);
        extent = {
          minX: enve.geometry.coordinates[0][0][0],
          minY: enve.geometry.coordinates[0][0][1],
          maxX: enve.geometry.coordinates[0][2][0],
          maxY: enve.geometry.coordinates[0][2][1],
        };
      } else if (this.catalog) {
        extent = {
          minX: this.catalog.bbox[0],
          minY: this.catalog.bbox[1],
          maxX: this.catalog.bbox[2],
          maxY: this.catalog.bbox[3],
        };
      }
      return extent;
    },
    enabled3d() {
      return Math.abs(this.lat) > 60;
    },
    hasGeom() {
      return !!this.geom;
    },
    hasMapService() {
      return this.genericProps ? !!this.genericProps.mapService : false;
    },
    mapSize() {
      const heightSm = 300;
      const heightMd = 500;

      const fullWidth = 875;
      const lgWidth = 725;
      const mdWidth = 500;

      let width = lgWidth;
      if (this.$vuetify.breakpoint.xsOnly) {
        width = mdWidth;
      } else if (this.$vuetify.breakpoint.mdAndDown) {
        width = fullWidth;
      }

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
  watch: {
    genericProps() {
      createWmsCatalog(this.genericProps.mapService.url)
        // eslint-disable-next-line no-return-assign
        .then(res => {
          this.catalog = res;
          this.selectMapService(this.catalog.children[0]);
        });
    },
  },
};
</script>

<style scoped></style>
