<template>
  <v-card id="EditDataGeo"
          class="pa-0"
          :loading="loadingColor">

    <v-container fluid class="pa-4">

      <v-row>
        <v-col cols="6" class="text-h5">
          {{ labels.cardTitle }}
        </v-col>

        <v-col v-if="message">
          <BaseStatusLabelView
            status="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>
        <v-col v-if="error">
          <BaseStatusLabelView
            status="error"
            statusColor="error"
            :statusText="error"
            :expandedText="errorDetails"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-subtitle-1">
          {{ labels.cardInstructions }}
        </v-col>
      </v-row>

      <v-row v-show="isDefaultLocation">
        <v-col :style="`background-color: ${$vuetify.theme.themes.light.colors.warning}`">
          {{ labels.defaultInstructions }}
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="12" class="editDataGeo">
          <v-file-input
              ref="filePicker"
              multiple
              accept=".geojson,.json"
              @change="triggerFileUpload"
              v-show="false"
            />

            <MetadataGeo
              v-bind="metadataGeoProps"
              @saveGeoms="commitGeometriesToAPI"
              @undoGeoms="undoGeomEdits"
              @uploadGeomFile="triggerFilePicker"
            />
        </v-col>
      </v-row>

<!--
        <v-row >
          <v-col >
            <ExpandableTextLayout title="Text Preview of Geospatial Information"
                                  :text="geoJSONHintPreview"
                                  />
          </v-col>
        </v-row>
-->

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
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
/*
import ExpandableTextLayout from '@/components/Layouts/ExpandableTextLayout.vue';
*/
import MetadataGeo from '@/modules/metadata/components/Geoservices/MetadataGeo.vue';
import {
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
  MAP_GEOMETRY_MODIFIED,
  EDITMETADATA_DATA_GEO_MAP_ERROR,
  EDITMETADATA_DATA_GEO_SPATIAL,
} from '@/factories/eventBus';

import { EDIT_METADATA_GEODATA_TITLE } from '@/factories/metadataConsts';
import { defaultSwissLocation, parseAsGeomCollection } from '@/factories/metaDataFactory';

import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';

/*
import geojsonhint from '@mapbox/geojsonhint';
*/

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
    eventBus.on(MAP_GEOMETRY_MODIFIED, this.parseGeomCollectionAddToBuffer);
    eventBus.on(EDITMETADATA_DATA_GEO_MAP_ERROR, this.triggerValidationError);
    this.originalGeom = this.location?.geoJSON;
  },
  beforeUnmount() {
    if (this.saveButtonEnabled) {
      this.commitGeometriesToAPI();
    }
    eventBus.off(MAP_GEOMETRY_MODIFIED, this.parseGeomCollectionAddToBuffer);
    eventBus.off(EDITMETADATA_DATA_GEO_MAP_ERROR, this.triggerValidationError);
  },
  computed: {
    loadingColor() {
      if (this.loading) {
        return 'accent';
      }

      return undefined;
    },
    metadataGeoProps() {
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
        site: this.geomsForMap,
      };
    },
    geomsForMap() {
      return (
        this.editedGeomBuffer[this.editedGeomBuffer.length - 1] ||
        this.originalGeom
      );
    },
    editErrorMessage() {
      return this.validationErrors.geometries;
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_DATA_GEO_SPATIAL);
    },
    isDefaultLocation() {
      const defaultGeoJSONString = JSON.stringify(defaultSwissLocation);
      return this.geomsForMapString === defaultGeoJSONString;
    },
    geomsForMapString() {
      return this.geomsForMap ? JSON.stringify(this.geomsForMap) : '';
    },
/*
    geoJSONHintPreview() {
      const geomString = this.geomsForMapString;

      if (geomString) {
        const hints = geojsonhint.hint(geomString, {});

        if (hints) {
          return `${geomString} \n\n\n ${JSON.stringify(hints)}`;
        }
      }

      return geomString;
    },
*/
  },
  watch: {
    location() {
      this.saveButtonInProgress = false;
    },
  },
  methods: {
    /**
     * Validate updated geometries, and store in local variable
     *
     * @param {Array} geomArray array of valid GeoJSON geometries
     */
    parseGeomCollectionAddToBuffer(geomArray) {
      if (
        isFieldValid(
          'geometries',
          geomArray,
          this.validations,
          this.validationErrors,
        )
      ) {
        this.editedGeomBuffer.push(
          parseAsGeomCollection(geomArray, {
            name: this.location.name,
          }),
        );

        this.undoButtonEnabled = true;
        this.saveButtonEnabled = true;
      } else {
        this.saveButtonEnabled = false;
      }
    },
    /**
     * Undo geometry edits, either local, or saved
     */
    undoGeomEdits() {
      this.editedGeomBuffer.pop();

      if (this.editedGeomBuffer.length === 0) {
        this.commitGeometriesToAPI();
        this.undoButtonEnabled = false;
      }
    },
    /**
     * Update spatial metadata in API via event bus
     */
    commitGeometriesToAPI() {
      this.saveButtonInProgress = true;

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_GEO,
        data: {
          location: {
            ...this.location,
            geoJSON: this.geomsForMap,
          },
        },
      });

      this.saveButtonEnabled = false;
    },
    triggerFilePicker() {
      const fileInputElement = this.$refs.filePicker?.$el.querySelector('input[type="file"]');

      if (fileInputElement) {
        fileInputElement.click();
      }
    },
    triggerFileUpload(fileArray) {
      // Loop through each dropped file
      for (const file of fileArray) {
        const reader = new FileReader();
        reader.onload = () => {
          // Attempt GeoJSON
          try {
            const geoJSON = JSON.parse(reader.result);
            const geomArray = JSON.parse(
              JSON.stringify(this.geomsForMap.geometries),
            );
            geomArray.push(geoJSON);
            this.parseGeomCollectionAddToBuffer(geomArray);
          } catch {
            this.validationErrors.geometries =
              'Could not load file. Is it GeoJSON?';
          }
        };

        reader.readAsText(file);
      }
    },
    triggerValidationError(errorMsg) {
      this.validationErrors.geometries = errorMsg;
    },
  },
  components: {
    MetadataGeo,
    BaseStatusLabelView,
/*
    ExpandableTextLayout,
*/
  },
  data: () => ({
    labels: {
      cardTitle: EDIT_METADATA_GEODATA_TITLE,
      cardInstructions:
        'Choose the location(s) where the research data was collected.',
      defaultInstructions: 'You are using the default location (Switzerland). Consider adjusting the geo information to represent your research data as accurate as possible.',
    },
    validationErrors: {
      geometries: null,
    },
    originalGeom: null,
    editedGeomBuffer: [],
    saveButtonEnabled: false,
    saveButtonInProgress: false,
    undoButtonEnabled: false,
  }),
};
</script>

<style>
.editDataGeo .leaflet-bar a,
.leaflet-bar a:hover {
  width: 32px;
  height: 32px;
}
</style>
