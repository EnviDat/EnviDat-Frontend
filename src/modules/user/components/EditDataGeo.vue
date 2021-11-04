<template>
  <v-container id="EditDataGeo" fluid class="pa-0">
    <v-row>
      <v-col>
        <MetadataGeo :genericProps="genericProps" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * EditDataGeo.vue is a wrapper around MetadataGeo.vue for modify geospatial information in the Edit workflow.
 *
 *
 * @summary wrapper for geospatial metadata editing
 * @author Sam Woodcock
 *
 * Created        : 2021-10-08
 * Last modified  : 2021-10-08 13:19:00
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_DATA_GEO,
  MAP_GEOMETRY_MODIFIED,
  eventBus,
} from '@/factories/eventBus';

import { parseAsGeomCollection } from '@/factories/metaDataFactory';

import MetadataGeo from '@/modules/metadata/components/Geoservices/MetadataGeo';

export default {
  name: 'EditDataGeo',
  props: {
    mapDivId: {
      type: String,
      default: 'map-small',
    },
    mapHeight: {
      type: Number,
      default: 450,
    },
    mapEditable: {
      type: Boolean,
      default: true,
    },
    showFullscreenButton: {
      type: Boolean,
      default: true,
    },
    layerConfig: {
      type: Object,
      default: null,
    },
    error: {
      type: Object,
      default: null,
    },
    location: {
      type: Object,
      default: null,
    },
  },
  mounted() {
    eventBus.$on(MAP_GEOMETRY_MODIFIED, this.notifyChange);
  },
  beforeDestroy() {
    eventBus.$off(MAP_GEOMETRY_MODIFIED, this.notifyChange);
  },
  computed: {
    genericProps() {
      return {
        mapDivId: this.mapDivId,
        mapHeight: this.mapHeight,
        mapEditable: this.mapEditable,
        showFullscreenButton: this.showFullscreenButton,
        layerConfig: this.layerConfig,
        error: this.error,
        site: this.location.geomCollection,
        // site: thislocalGeoms,
      };
    },
  },
  methods: {
    notifyChange(geomArray) {
      // Parse updated geometries, add to existing props, update via event bus

      const updatedGeometries = parseAsGeomCollection(
        this.location.name,
        geomArray,
      );
      const updatedLocation = {
        ...this.location,
        geomCollection: updatedGeometries,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_GEO,
        data: {
          ...this.$props,
          location: updatedLocation,
        },
      });
    },
  },
  watch: {},
  components: {
    MetadataGeo,
  },
  data: () => ({}),
};
</script>
