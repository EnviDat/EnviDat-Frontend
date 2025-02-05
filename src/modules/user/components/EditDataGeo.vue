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
        <v-col>
          <v-alert type="warning">
            {{ labels.defaultInstructions }}
          </v-alert>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="5">
          <v-row >
            <v-col cols="12"
                   class="text-h6">
              Editor
            </v-col>

            <v-col cols="12">
              {{ labels.uploadInstructions }}
            </v-col>

            <v-col v-show="false"
                   cols="12" md="12">
              <!-- intentionally use v-show="false" here to hide it, but make it accessible
                   when clicking the button -->
              <v-file-input
                ref="filePicker"
                accept=".geojson,.json"
                v-model="geoFile"
              />

            </v-col>

            <v-col cols="12">
              <v-row class="mt-4"
                     no-gutters
              >
                <v-col cols="12">
                  <BaseRectangleButton
                    :color="$vuetify.theme.themes.light.colors.highlight"
                    buttonText="Upload GeoJSON"
                    tooltipText="File Drop Also Possible"
                    tooltipPosition="top"
                    :icon="mdiFileUpload"
                    icon-color="black"
                    @clicked="triggerFilePicker"
                  />
                </v-col>

                <v-col cols="12"
                       class="mt-2"
                >
                  <v-row align="center" justify="center">
                    <v-col >
                      <div ref="dropZoneRef"
                           class="dropZone"
                           :style="`border-color: ${$vuetify.theme.themes.light.colors.highlight};
                                    background-color: ${ isOverDropZone ? $vuetify.theme.themes.light.colors.highlight : 'transparent' };
                                  `">
                        Or drop a file with geoJSONO here
                      </div>

                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

            </v-col>

            <v-col cols="12">
              {{ labels.editorInstructions }}
            </v-col>

            <v-col cols="12">
              <div class="columns">
                <div class="column">
                  <div class="jsoneditor-vue" id="jsoneditor-vue" ref="editorRef"></div>
                </div>
              </div>
            </v-col>

            <v-col v-show="validationErrors.input"
                   cols="12">
              <v-alert type="warning">
                {{ validationErrors.input }}
              </v-alert>
            </v-col>

          </v-row>

          <v-row >
            <v-col >
              <BaseRectangleButton
                :disabled="!saveButtonEnabled"
                :loading="saveButtonInProgress"
                :icon="mdiContentSave"
                :color="$vuetify.theme.themes.light.colors.primary"
                buttonText="Save Changes"
                tooltipText="Save the changes you have made"
                iconColor="black"
                @clicked="commitGeometriesToAPI"
              />
            </v-col>

          </v-row>
        </v-col>

        <v-col cols="7">
          <v-row >

            <v-col cols="12"
                   class="text-h6">
              Preview
            </v-col>

            <v-col cols="12">
              {{ labels.mapInstructions }}
            </v-col>

            <v-col cols="12" md="12" class="editDataGeo">
              <MetadataGeo v-bind="metadataGeoProps" />
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
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
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

import { mdiContentSave, mdiUndo, mdiFileUpload } from '@mdi/js';

import geojsonhint from '@mapbox/geojsonhint';
import { createJSONEditor, expandAll, SelectionType } from 'vanilla-jsoneditor';
import { useDropZone } from '@vueuse/core'


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

    this.changeGeoViaText(jsonString, true);

    // don't use jsonString because it going to be wrapped
    this.initEditor(this.geomsForMapString);

    useDropZone(this.$refs.dropZoneRef, {
      onDrop: this.onFileDrop,
      // specify the types of data to be received.
      // dataTypes: ['image/jpeg'],
      // control multi-file drop
      multiple: false,
      // whether to prevent default behavior for unhandled events
      preventDefaultForUnhandled: false,
      onEnter: () => {
        this.isOverDropZone = true;
      },
      onLeave: () => {
        this.isOverDropZone = false;
      },
    })

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
        showFullscreenButton: this.showFullscreenButton,
        layerConfig: this.layerConfig,
        error: this.editErrorMessage,
        site: this.geomsForMap,
      };
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
        mode: 'tree',
        indentation: 2,
        navigationBar: false,
        mainMenuBar: true,
        statusBar: true,
        onSelect: (selection) => {
          this.editorSelection = selection;
        },
        onChange: (updatedContent, previousContent, status) => {
          // content is an object { json: unknown } | { text: string }
          this.jsonEditorOnChange(updatedContent, previousContent, status);
        },
        onError: (err) => {
          console.error(err)
          // emit('editorError', err);
        },
      }
    },
  },
  errorCaptured(err, vm, info) {
    this.validationErrors.input = err;

    // console.error('Error captured in parent:', err);
    console.log('Error source component:', vm.$options.name);
    console.log('Error info:', info);

    // return `false` to stop the error from propagating to further ancestors.
    return false
  },
  methods: {
    initEditor(textContent) {

      const content = { text: textContent }; // ? { text: textContent } : { json: jsonContent };

      try {
        // console.log('JSONEditor init');

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
    jsonEditorOnChange(updatedContent, previousContent, status) {
      this.validationErrors.input = undefined;

      const {
        contentErrors,
        // patchResult,
      } = status;

/*
      console.log('onChange', {
        updatedContent,
        previousContent,
        contentErrors,
        patchResult,
      })
*/

      if (contentErrors) {
        const {
          parseError,
          validationErrors,
        } = contentErrors;

        if (parseError) {
          this.validationErrors.input = parseError.toString();
        }

        if (validationErrors) {
          this.validationErrors.input = validationErrors.toString();
        }

        return false;
      }

      let acceptChange = false;

      if (this.editorSelection) {
        if (this.editorSelection.type === SelectionType.value) {
          acceptChange = true;
          this.editorSelection = undefined;

        } else {
          acceptChange = false;
          this.validationErrors.input = 'Only editing of values is allowed';

          // revert to the previous state
          this.jsonEditor.update({ json: previousContent.json });
        }
      } else {
        // accept changes from indirect user changes, like the click on redo / undo
        acceptChange = true;
      }

      if (acceptChange) {
        const contentAsString = updatedContent.text ? updatedContent.text : JSON.stringify(updatedContent.json);
        this.changeGeoViaText(contentAsString);
        return true;
      }

      return false;
    },
    changedGeoViaEditor(geoJSONArray) {
      const geoJsonStr = JSON.stringify(geoJSONArray)
      this.changeGeoViaText(geoJsonStr);
    },
    changeGeoFromFileUpload(text) {
      this.isValidateGeoJSON(text);
      this.changeGeoViaText(text)
    },
    changeGeoViaText(text, skipUpdateSaveButton) {
      const inputGeoJSON = JSON.parse(text);

      const geoColl = this.converGeoJSONToGeoCollection(inputGeoJSON);

      const validationOk = this.parseGeoCollection(geoColl);

      if (!skipUpdateSaveButton) {
        this.saveButtonEnabled = validationOk;
      }
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
    parseGeoCollection(geoCollection) {
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

        this.geomsForMap = geoCollection;

        return true
      }

      return false
    },
    /**
     * Update spatial metadata in API via event bus
     */
    commitGeometriesToAPI() {
      this.saveButtonInProgress = true;
      this.saveButtonEnabled = false;

      const obj = this.geomsForMap

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_GEO,
        data: {
          location: {
            ...this.location,
            geoJSON: obj,
          },
        },
      });
    },
    triggerFilePicker() {
      // select the hidden file input
      const fileInputElement = this.$refs.filePicker?.$el.querySelector('input[type="file"]');

      if (fileInputElement) {
        fileInputElement.click();
      }
    },
    onFileDrop(files) {
      // called when files are dropped on zone
      console.log('files', files);

      if (files?.length > 0) {
        const file = files[1];
        this.triggerFileUpload(file);
      }
    },
    triggerFileUpload(file) {

      const reader = new FileReader();
      reader.onload = () => {
        this.changeGeoFromFileUpload(reader.result);
      }

      reader.onerror = (e) => {
        this.validationErrors.geometries = `Could not load file. Is it GeoJSON? ${e}`;
      }

      reader.readAsText(file);
   },
    triggerValidationError(errorMsg) {
      this.validationErrors.geometries = errorMsg;
    },
  },
  watch: {
    geomsForMapString() {
      this.jsonEditor.update({ text: this.geomsForMapString });
      expandAll();
    },
    location() {
      this.saveButtonInProgress = false;
    },
    geoFile() {
      this.triggerFileUpload(this.geoFile)
    },
  },
  components: {
    MetadataGeo,
    BaseStatusLabelView,
    BaseRectangleButton,
  },
  data: () => ({
    mdiUndo,
    mdiContentSave,
    mdiFileUpload,
    geomsForMap: undefined,
    jsonEditor: undefined,
    editorSelection: undefined,
    wasRedoOrUndo: false,
    geoJSONValid: false,
    labels: {
      cardTitle: EDIT_METADATA_GEODATA_TITLE,
      cardInstructions:
        'Choose the location(s) where the research data was collected.',
      defaultInstructions: 'You are using the default location (Switzerland). Consider adjusting the geo information to represent your research data as accurate as possible.',
      editorInstructions: 'Use the text editor for fine adjustments',
      uploadInstructions: 'Upload geojson from a file.',
      mapInstructions: 'Use the tools on the right side of the map to define locations. You can mix Points and Polygons. Or pick predefined locations.',
    },
    validationErrors: {
      input: null,
      geometries: null,
    },
    saveButtonEnabled: false,
    saveButtonInProgress: false,
    undoButtonEnabled: false,
    geoFile: undefined,
    isOverDropZone: false,
  }),
};
</script>

<style>
.editDataGeo .leaflet-bar a,
.leaflet-bar a:hover {
  width: 32px;
  height: 32px;
}

.dropZone {
  min-height: 100px;
  border-radius: 5px;
  border: 1px solid;
  text-align: center;
  align-content: center;
}
</style>
