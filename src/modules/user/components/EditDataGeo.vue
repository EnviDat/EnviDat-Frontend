<template>
  <v-card id="EditDataGeo"
          class="pa-0"
          :loading="loading">

    <v-container fluid
                 class="pa-4">
      <template slot="progress">
        <v-progress-linear color="primary"
                           indeterminate />
      </template>

      <v-row>
        <v-col cols="6" class="text-h5">
          {{ labels.cardTitle }}
        </v-col>

        <v-col v-if="message" >
          <BaseStatusLabelView statusIcon="check"
                               statusColor="success"
                               :statusText="message"
                               :expandedText="messageDetails" />
        </v-col>
        <v-col v-if="error"  >

          <BaseStatusLabelView statusIcon="error"
                               statusColor="error"
                               :statusText="error"
                               :expandedText="errorDetails" />
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-subtitle-1">
          {{ labels.cardInstructions }}
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <MetadataGeo :genericProps="genericProps" />
        </v-col>
      </v-row>
    </v-container>

  </v-card>
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
// eslint-disable-next-line import/no-cycle
import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingFactory';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';

import MetadataGeo from '@/modules/metadata/components/Geoservices/MetadataGeo';
import { EDIT_METADATA_GEODATA_TITLE } from '@/factories/metadataConsts';

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
/*
    error: {
      type: Object,
      default: null,
    },
*/
    location: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: '',
    },
    messageDetails: {
      type: String,
      default: null,
    },
    error: {
      type: String,
      default: '',
    },
    errorDetails: {
      type: String,
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
        error: this.editErrorMessage,
        site: this.location.geomCollection,
        // site: thislocalGeoms,
      };
    },
    editErrorMessage() {
      return this.validationErrors.geometries;
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_DATA_GEO);
    },
  },
  methods: {
    notifyChange(geomArray) {
      // Parse updated geometries, add to existing props, update via event bus

      if (isFieldValid( 'geometries', geomArray, this.validations, this.validationErrors)) {
/*
        const updatedGeometries = parseAsGeomCollection(
          this.location.name,
          geomArray,
        );
*/
        const updatedLocation = {
          ...this.location,
          geoJSON: geomArray,
        };

        eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
          object: EDITMETADATA_DATA_GEO,
          data: {
            location: updatedLocation,
          },
        });
      }
    },
  },
  components: {
    MetadataGeo,
    BaseStatusLabelView,
  },
  data: () => ({
    labels: {
      cardTitle: EDIT_METADATA_GEODATA_TITLE,
      cardInstructions: 'Choose the location(s) where the data was collected.',
    },
    validationErrors: {
      geometries: null,
    },
  }),
};
</script>
