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
        <v-col cols="6"
               class="text-h5">
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
          <MetadataGeo :genericProps="genericProps"
                        @saveGeometries="updateGeometriesInMetadata"
                        @undoSaveGeometries="revertGeometriesInMetadata" />
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

// eslint-disable-next-line import/no-cycle
import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingFactory';
import { parseAsGeomCollection } from '@/factories/metaDataFactory';

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
      default: false,
    },
    layerConfig: {
      type: Object,
      default: null,
    },
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
    readOnlyFields: {
      type: Array,
      default: () => [],
    },
    readOnlyExplanation: {
      type: String,
      default: '',
    },
  },
  mounted() {
    eventBus.$on(MAP_GEOMETRY_MODIFIED, this.parseAndStoreUpdatedGeometries);
  },
  beforeDestroy() {
    if (this.saveButtonEnabled) {
      this.updateGeometriesInMetadata();
    }
    eventBus.$off(MAP_GEOMETRY_MODIFIED, this.parseAndStoreUpdatedGeometries);
  },
  computed: {
    genericProps() {
      return {
        mapDivId: this.mapDivId,
        mapHeight: this.mapHeight,
        mapEditable: this.mapEditable,
        saveButtonEnabled: this.saveButtonEnabled,
        saveButtonInProgress: this.saveButtonInProgress,
        undoButtonEnabled: this.undoButtonEnabled,
        showFullscreenButton: this.showFullscreenButton,
        layerConfig: this.layerConfig,
        error: this.editErrorMessage,
        site: this.location?.geomCollection,
      };
    },
    editErrorMessage() {
      return this.validationErrors.geometries;
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_DATA_GEO);
    },
  },
  watch: {
    location() {
      this.saveButtonInProgress = false;
    },
  },
  methods: {
    /**
     * Parse updated geometries, validate, and store in local variable
     *
     * @param {Array} geomArray array of valid GeoJSON geometries
     */
    parseAndStoreUpdatedGeometries(geomArray) {

      if (isFieldValid( 'geometries', geomArray, this.validations, this.validationErrors)) {

        this.localGeomCollection = parseAsGeomCollection(geomArray, {
          name: this.location.name,
        });

        this.saveButtonEnabled = true;

      } else {

        this.saveButtonEnabled = false;
      }
    },
    /**
     * Merge locally saved geometries with existing props, trigger update event
     */
    updateGeometriesInMetadata() {

      this.previousLocation = {...this.location};

      const updatedLocation = {
        ...this.location,
        geoJSON: this.localGeomCollection,
      };
      this.commitGeometries(updatedLocation)

      this.undoButtonEnabled = true;
    },
    /**
     * Revert to initial geometry, trigger update event
     */
    revertGeometriesInMetadata() {
      this.commitGeometries(this.previousLocation);
      this.undoButtonEnabled = false;
    },
    /**
     * Update spatial metadata via event bus
     */
    commitGeometries(updatedLocation) {

      this.saveButtonInProgress = true;

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_GEO,
        data: {
          location: updatedLocation,
        },
      });

      this.saveButtonEnabled = false;
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
    previousLocation: null,
    localGeomCollection: null,
    saveButtonEnabled: false,
    saveButtonInProgress: false,
    undoButtonEnabled: false,
  }),
};
</script>
