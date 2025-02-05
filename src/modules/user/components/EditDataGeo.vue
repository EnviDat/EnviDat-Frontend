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
        <v-col cols="5">
          <v-row >
            <v-col cols="12"
                   class="text-h6">
              Text Editor
            </v-col>

            <v-col cols="12">
              <v-textarea
                :modelValue="geomsForMapString"
                @change="changeGeoViaText($event.target.value)"
                auto-grow
                hide-details
              />
            </v-col>

            <v-col v-show="geoJSONValid"
                   cols="12">
              <v-alert type="info" >GeoJson is valid!</v-alert>
            </v-col>

            <v-col v-show="validationErrors.input"
                   cols="12">
              <v-alert type="warning">
                {{ validationErrors.input }}
              </v-alert>
            </v-col>

            <v-col cols="12"
                   class="text-h6">
              Preview
            </v-col>

            <v-col cols="12">
              <div class="columns">
                <div class="column">
                  <div class="jsoneditor-vue" id="jsoneditor-vue" ref="editorRef"></div>
                </div>
              </div>
            </v-col>

          </v-row>

        </v-col>

        <v-col cols="7">
          <v-row no-gutters>
            <v-col cols="12" md="12">
              <v-file-input
                v-show="false"
                ref="filePicker"
                accept=".geojson,.json"
                @change="triggerFileUpload"
                v-model="geoFile"
              />

            </v-col>
            <v-col cols="12" md="12" class="editDataGeo">
              <MetadataGeo
                v-bind="metadataGeoProps"
                @saveGeoms="commitGeometriesToAPI"
                @undoGeoms="undoGeomEdits"
                @uploadGeomFile="triggerFilePicker"
              />
            </v-col>
          </v-row>
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

import {
  EDIT_METADATA_GEODATA_TITLE,
  LOCATION_TYPE_FEATCOLLECTION,
  LOCATION_TYPE_GEOMCOLLECTION, LOCATION_TYPE_MULTIPOINT, LOCATION_TYPE_POINT, LOCATION_TYPE_POLYGON,
} from '@/factories/metadataConsts';

import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';

import {
  defaultSwissLocation,
  fetureCollectionToGeoCollection,
  createGeomCollection,
} from '@/factories/geoFactory';

import geojsonhint from '@mapbox/geojsonhint';
import { createJSONEditor } from 'vanilla-jsoneditor';

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
    eventBus.on(MAP_GEOMETRY_MODIFIED, this.changedGeoViaEditor);
    eventBus.on(EDITMETADATA_DATA_GEO_MAP_ERROR, this.triggerValidationError);

    const jsonString = JSON.stringify(this.location.geoJSON);

    this.changeGeoViaText(jsonString);

    this.initEditor(jsonString);
  },
  beforeUnmount() {
    if (this.saveButtonEnabled) {
      this.commitGeometriesToAPI();
    }
    eventBus.off(MAP_GEOMETRY_MODIFIED, this.changedGeoViaEditor);
    eventBus.off(EDITMETADATA_DATA_GEO_MAP_ERROR, this.triggerValidationError);

    this.jsonEditor.destroy()
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
      return this.editedGeomBuffer[this.editedGeomBuffer.length - 1];
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
    editorOptions(){
      return {
/*
        readOnly: props.readOnly,
        mode: props.mode,
*/
        selection: {
          type: 'key',
          edit: false,
          path: [],
        },
        indentation: 2,
        navigationBar: false,
        mainMenuBar: true,
        statusBar: true,
        /*
        tabSize,
        askToFormat,
        escapeControlCharacters,
        escapeUnicodeCharacters,
        flattenColumns,
        */
        onSelect: (selection) => {
          console.log('selection', selection);
        },
        onChange: (updatedContent, previousContent, status) => {
          // content is an object { json: unknown } | { text: string }
          // const { contentErrors, patchResult } = status;
          // console.log('onChange', { updatedContent, previousContent, contentErrors, patchResult })
          // contentRef.value = updatedContent;

          const contentAsString = updatedContent.text ? updatedContent.text : JSON.stringify(updatedContent.json);
          this.changeGeoViaText(contentAsString);

          // emit('editorChange', updatedContent);
        },
        onError: (err) => {
          console.error(err)
          // emit('editorError', err);
        },
      }
    },
  },
  watch: {
    location() {
      this.saveButtonInProgress = false;
    },
  },
  methods: {
    initEditor (textContent, jsonContent) {

      const content = textContent ? { text: textContent } : { json: jsonContent };

      try {
        if (this.jsonEditor) {
          console.log('JSONEditor update');
          this.jsonEditor.update(content);

          return;
        }

        console.log('JSONEditor init');

        this.jsonEditor = createJSONEditor({
          target: this.$refs.editorRef,
          props: {
            content,
            ...this.editorOptions,
          },
        });
      } catch (err) {
        console.error(err);
        // emit('editorError', err);
      }

    },
    changedGeoViaEditor(geoJSONArray) {
      const geoJsonStr = JSON.stringify(geoJSONArray)
      this.changeGeoViaText(geoJsonStr);
    },
    changeGeoViaText(text) {
      this.geoJSONValid = this.isValidateGeoJSON(text);

      // if (this.geoJSONValid) {

        const inputGeoJSON = JSON.parse(text);

        const geoColl = this.converGeoJSONToGeoCollection(inputGeoJSON);

        this.parseGeomCollectionAddToBuffer(geoColl);
      // }
    },
    isValidateGeoJSON(text) {
      const hint = geojsonhint.hint(text, {
        noDuplicateMembers: true,
      })

      if (hint?.length > 0) {
        let errMsg = '';

        for (let i = 0; i < hint.length; i++) {
          const err = hint[i];
          errMsg += `${err.message} \n`;
        }

        this.validationErrors.input = errMsg;
        return false;
      }

      this.validationErrors.input = null;
      return true;
    },
    converGeoJSONToGeoCollection(inputGeoJSON) {
      let geoColl;

      if (inputGeoJSON.type === LOCATION_TYPE_FEATCOLLECTION) {
        geoColl = fetureCollectionToGeoCollection(inputGeoJSON);
      } else if(inputGeoJSON.type === LOCATION_TYPE_GEOMCOLLECTION) {
        geoColl = inputGeoJSON;
      } else if(inputGeoJSON.type === LOCATION_TYPE_POINT
        || inputGeoJSON.type === LOCATION_TYPE_MULTIPOINT
        || inputGeoJSON.type === LOCATION_TYPE_POLYGON
      ) {
//        geoColl = creationGeometry(inputGeoJSON).geomCollection;
        geoColl = createGeomCollection(inputGeoJSON, inputGeoJSON.properties);
      } else {
        geoColl = createGeomCollection(inputGeoJSON, inputGeoJSON.properties);
      }

      return geoColl;
    },
    /**
     * Validate updated geometries, and store in local variable
     *
     * @param {Array} geoCollection array of valid GeoJSON geometries
     */
    parseGeomCollectionAddToBuffer(geoCollection) {
      if (
        isFieldValid(
          'geometries',
          geoCollection.geometries,
          this.validations,
          this.validationErrors,
        )
      ) {

        const propsKeys = geoCollection.properties ? Object.keys(geoCollection.properties) : [];
        if (propsKeys?.length <= 0) {
          geoCollection.properties = { name: this.location.name }
        }

        this.newObjectToSend = geoCollection

        this.editedGeomBuffer.push(geoCollection);

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
/*
        this.commitGeometriesToAPI();
*/
        this.undoButtonEnabled = false;
      }
    },
    /**
     * Update spatial metadata in API via event bus
     */
    commitGeometriesToAPI() {
      this.saveButtonInProgress = true;

      const obj = this.newObjectToSend
      // const mapToSend = createGeomCollection(obj, { name: this.location.name })

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_GEO,
        data: {
          location: {
            ...this.location,
            geoJSON: obj,
          },
        },
      });

      this.saveButtonEnabled = false;
    },
    triggerFilePicker() {
      // select the hidden file input
      const fileInputElement = this.$refs.filePicker?.$el.querySelector('input[type="file"]');

      if (fileInputElement) {
        fileInputElement.click();
      }
    },
    triggerFileUpload() {

      const reader = new FileReader();
      reader.onload = () => {
        this.changeGeoViaText(reader.result);
      }

      reader.onerror = (e) => {
        this.validationErrors.geometries = `Could not load file. Is it GeoJSON? ${e}`;
      }

      reader.readAsText(this.geoFile);
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
    jsonEditor: undefined,
    geoJSONValid: false,
    labels: {
      cardTitle: EDIT_METADATA_GEODATA_TITLE,
      cardInstructions:
        'Choose the location(s) where the research data was collected.',
      defaultInstructions: 'You are using the default location (Switzerland). Consider adjusting the geo information to represent your research data as accurate as possible.',
    },
    validationErrors: {
      input: null,
      geometries: null,
    },
    newObjectToSend: null,
    editedGeomBuffer: [],
    saveButtonEnabled: false,
    saveButtonInProgress: false,
    undoButtonEnabled: false,
    geoFile: undefined,
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
