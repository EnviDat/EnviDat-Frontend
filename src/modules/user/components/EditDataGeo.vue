<template>
  <v-card id="EditDataGeo" class="pa-0" :loading="loadingColor">
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
          <v-row>
            <v-col cols="12" class="text-h6"> Editor </v-col>

            <v-col cols="12">
              {{ labels.uploadInstructions }}
            </v-col>

            <v-col v-show="false" cols="12" md="12">
              <!-- intentionally use v-show="false" here to hide it, but make it accessible
                   when clicking the button -->
              <v-file-input
                ref="filePicker"
                accept=".geojson,.json"
                v-model="geoFile"
              />
            </v-col>

            <v-col cols="12">
              <v-row no-gutters align="center">
                <v-col class="flex-grow-0 mr-4">
                  <BaseRectangleButton
                    color="highlight"
                    buttonText="Upload File"
                    tooltipText="File Drop Also Possible"
                    tooltipPosition="top"
                    :icon="mdiFileUpload"
                    icon-color="black"
                    @clicked="triggerFilePicker"
                  />
                </v-col>

                <v-col class="flex-grow-1">
                  <v-row align="center" justify="center" no-gutters>
                    <v-col>
                      <div
                        ref="dropZoneRef"
                        class="dropZone"
                        :style="`border-color: ${$vuetify.theme.themes.light.colors.highlight};
                                    background-color: ${isOverDropZone ? $vuetify.theme.themes.light.colors.highlight : 'transparent'};
                                  `"
                      >
                        {{ labels.fileDropLabel }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12">
              {{ labels.editorInstructions }}
            </v-col>

            <v-col
              cols="12"
              class="editorHeight"
              :style="`scrollbar-color: ${this.scrollbarColorFront} ${this.scrollbarColorBack};`"
            >
              <div class="columns">
                <div class="column">
                  <div
                    class="jsoneditor-vue"
                    id="jsoneditor-vue"
                    ref="editorRef"
                  ></div>
                </div>
              </div>
            </v-col>

            <v-col v-show="validationErrors.input" cols="12">
              <v-alert type="warning">
                {{ validationErrors.input }}
              </v-alert>
            </v-col>
          </v-row>

          <v-row no-gutters class="mt-4">
            <v-col>
              <BaseRectangleButton
                :disabled="!saveButtonEnabled"
                :loading="saveButtonInProgress"
                :icon="mdiContentSave"
                color="primary"
                buttonText="Save Changes"
                tooltipText="Save the changes you have made"
                iconColor="black"
                @clicked="commitGeometriesToAPI"
              />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="7">
          <v-row>
            <v-col cols="12" class="text-h6"> Preview </v-col>

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
import { mdiContentSave, mdiUndo, mdiFileUpload } from '@mdi/js';
import { check } from '@placemarkio/check-geojson';
import { createJSONEditor, SelectionType } from 'vanilla-jsoneditor';
import { useDropZone } from '@vueuse/core';

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

import { EDIT_METADATA_GEODATA_TITLE } from '@/factories/metadataConsts';

import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';

import {
  convertGeoJSONToGeoCollection,
  defaultSwissLocation,
} from '@/factories/geoFactory';

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

/*
    console.log(this.location);
    console.log(this.location?.geoJSON);
*/

    const jsonString = this.location?.geoJSON
      ? JSON.stringify(this.location?.geoJSON)
      : '';

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
    });
  },
  beforeUnmount() {
    if (this.saveButtonEnabled) {
      this.commitGeometriesToAPI();
    }
    eventBus.off(MAP_GEOMETRY_MODIFIED, this.changedGeoViaEditor);
    eventBus.off(EDITMETADATA_DATA_GEO_MAP_ERROR, this.triggerValidationError);

    this.jsonEditor?.destroy();
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
    editorOptions() {
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
          this.validationErrors.input = err.message;

          console.error(err);
          // emit('editorError', err);
        },
      };
    },
    scrollbarColorFront() {
      return this.$vuetify
        ? this.$vuetify.theme.themes.light.colors.highlight
        : 'auto';
    },
    scrollbarColorBack() {
      return this.$vuetify ? '#F0F0F0' : 'auto';
    },
  },
  errorCaptured(err, vm, info) {
    this.validationErrors.input = err.message;

    // console.error('Error captured in parent:', err);
    console.error('Error source component:', vm.$options.name);
    console.error('Error info:', info);

    // return `false` to stop the error from propagating to further ancestors.
    return false;
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
        const { parseError, validationErrors } = contentErrors;

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
        const contentAsString = updatedContent.text
          ? updatedContent.text
          : JSON.stringify(updatedContent.json);
        this.changeGeoViaText(contentAsString);
        return true;
      }

      return false;
    },
    changedGeoViaEditor(geoJSONArray) {
      const geoJsonStr = JSON.stringify(geoJSONArray);
      this.changeGeoViaText(geoJsonStr);
    },
    changeGeoFromFileUpload(text) {
      this.isValidateGeoJSON(text);
      this.changeGeoViaText(text);
    },
    changeGeoViaText(text, skipUpdateSaveButton) {
      const inputGeoJSON = JSON.parse(text);

      const geoColl = convertGeoJSONToGeoCollection(inputGeoJSON);

      const validationOk = this.parseGeoCollection(geoColl);

      if (!skipUpdateSaveButton) {
        this.saveButtonEnabled = validationOk;
      }
    },
    isValidateGeoJSON(text) {
      this.validationErrors.input = undefined;

      try {
        const geoJson = check(text);
        return !!geoJson;
      } catch (err) {
        this.validationErrors.input = err.message;
        return false;
      }
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
        const propsKeys = geoCollection.properties
          ? Object.keys(geoCollection.properties)
          : [];
        if (propsKeys?.length <= 0) {
          geoCollection.properties = { name: this.location.name };
        }

        this.geomsForMap = geoCollection;

        return true;
      }

      return false;
    },
    /**
     * Update spatial metadata in API via event bus
     */
    commitGeometriesToAPI() {
      this.saveButtonInProgress = true;
      this.saveButtonEnabled = false;

      const obj = this.geomsForMap;

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
      const fileInputElement =
        this.$refs.filePicker?.$el.querySelector('input[type="file"]');

      if (fileInputElement) {
        fileInputElement.click();
      }
    },
    onFileDrop(files) {
      if (files?.length > 0) {
        const file = files[0];
        this.triggerFileUpload(file);
      }
    },
    triggerFileUpload(file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.changeGeoFromFileUpload(reader.result);
      };

      reader.onerror = (e) => {
        this.validationErrors.geometries = `Could not load file. Is it GeoJSON? ${e}`;
      };

      reader.readAsText(file);
    },
    triggerValidationError(errorMsg) {
      this.validationErrors.geometries = errorMsg;
    },
  },
  watch: {
    geomsForMapString() {
      this.jsonEditor.update({ text: this.geomsForMapString });
    },
    location() {
      this.saveButtonInProgress = false;
    },
    geoFile() {
      this.triggerFileUpload(this.geoFile);
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
        'Define the location(s) where the research data was collected or were it is refeering to.',
      defaultInstructions:
        'You are using the default location (Switzerland). Consider adjusting the geo information to represent your research data as accurate as possible.',
      editorInstructions:
        'Use the text editor for fine adjustments, Undo or Redo. Only changing the values of geometries is allowed to edit. If you need to make needs of the structure upload a new file or change it on the map.',
      uploadInstructions:
        'Upload geo-JSON from a file if you have large changes or many geometries.',
      mapInstructions:
        'Use the tools on the right side of the map to define locations. You can mix Points and Polygons. Or pick predefined locations. Use the eraser icon to remove geometries.',
      fileDropLabel: 'Or drop a file with geo-JSON here',
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

.editorHeight {
  max-height: 600px;
  overflow: auto auto;
  scrollbar-width: thin;
}
</style>
