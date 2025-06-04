<template>
  <v-card id="EditDataGeo" class="pa-0" elevation="0" :loading="loadingColor">
    <v-container fluid class="pa-4">
      <!-- MAP PREVIEW -->
      <v-col cols="12" class="editDataGeo customPadding">
        <MetadataGeo
          :elevation="0"
          :showTitle="false"
          :showError="false"
          v-bind="metadataGeoProps"
        />
        <v-col class="pl-0" v-if="validationErrors.geometries != null">
          <div
            :style="{ color: 'red', fontSize: '0.75rem' }"
            class="error--text text-caption mt-1"
          >
            {{ validationErrors.geometries }}
          </div>
        </v-col>
      </v-col>

      {{ validationErrors }}
      <!-- TITLE + STATUS -->
      <v-row>
        <v-col cols="6" v-html="labels.cardTitle" class="text-h5" />
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

      <!-- INSTRUCTIONS -->
      <v-row>
        <v-col v-html="labels.cardInstructions" class="text-subtitle-1" />
      </v-row>

      <!-- WARNING FOR DEFAULT LOCATION -->
      <v-row v-show="isDefaultLocation">
        <v-col>
          <v-alert type="warning">{{ labels.defaultInstructions }}</v-alert>
        </v-col>
      </v-row>

      <v-row>
        <!-- LEFT COLUMN — JSON-EDITOR & UPLOAD -->
        <v-col cols="12" md="6">
          <v-row>
            <v-col cols="12" class="text-h6">Editor</v-col>
            <v-col cols="12">{{ labels.editorInstructions }}</v-col>

            <v-col
              cols="12"
              class="editorHeight"
              :style="`scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack};`"
            >
              <div class="columns">
                <div class="column">
                  <div class="jsoneditor-vue" ref="editorRef"></div>
                </div>
              </div>
            </v-col>

            <!-- local parse / validation error -->
            <v-col v-if="inputError" cols="12">
              <v-alert type="warning">{{ inputError }}</v-alert>
            </v-col>

            <!-- hidden file input -->
            <v-file-input
              style="display: none"
              ref="filePicker"
              accept=".geojson,.json"
              v-model="geoFile"
            />

            <v-col cols="12">
              <v-row no-gutters align="center">
                <v-col class="mt-5 mb-5">{{ labels.uploadInstructions }}</v-col>
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
                        :style="`border-color: ${vuetifyHighlight}; background-color: ${isOverDropZone ? vuetifyHighlight : 'transparent'};`"
                      >
                        {{ labels.fileDropLabel }}
                      </div>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" class="mt-4 d-flex justify-end">
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

        <!-- RIGHT COLUMN — DATES -->
        <v-col cols="12" md="6">
          <v-col cols="12" class="text-h6"
            >Time information about the research data</v-col
          >
          <v-row
            v-for="(item, index) in datesField"
            :key="index"
            class="d-flex flex-column"
            no-gutters
            dense
          >
            <v-col cols="11" class="pt-2 px-sm-2 flex-grow-0 mb-3">
              <div class="text-body-1 font-weight-bold text-capitalize">
                {{ item.dateType }}
              </div>
              <div class="text-body-1 text-caption">
                {{ item.dateExplanation }}
              </div>
            </v-col>
            <v-col cols="11">
              <BaseStartEndDate
                :startDate="item.dateStart"
                :startDateLabel="`${item.dateType} start date`"
                :startDateProperty="startDateProperty"
                :endDate="item.dateEnd"
                :error-messages="validationErrors.dates"
                :endDateLabel="`${item.dateType} end date`"
                :endDateProperty="endDateProperty"
                :clearableEndDate="false"
                :clearableStartDate="false"
                rowLayout
                @dateChange="(prop, val) => dateChanged(index, prop, val)"
                @clearClick="(prop) => clearDate(index, prop)"
                :readOnlyFields="readOnlyFields"
                :readOnlyExplanation="readOnlyExplanation"
              />
            </v-col>
            <v-col v-if="datesField[index].dateType === 'created'">
              <div
                :style="{ color: 'red', fontSize: '0.75rem' }"
                class="error--text text-caption mt-1"
              >
                {{ validationErrors.dates }}
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mdiContentSave, mdiUndo, mdiFileUpload } from '@mdi/js';
import { check } from '@placemarkio/check-geojson';
import { createJSONEditor, SelectionType } from 'vanilla-jsoneditor';
import { useDropZone } from '@vueuse/core';

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import MetadataGeo from '@/modules/metadata/components/Geoservices/MetadataGeo.vue';
import BaseStartEndDate from '@/components/BaseElements/BaseStartEndDate.vue';

import {
  EDITMETADATA_DATA_GEO,
  EDITMETADATA_OBJECT_UPDATE,
  EDITMETADATA_DATA_GEO_SPATIAL,
  eventBus,
  MAP_GEOMETRY_MODIFIED,
  EDITMETADATA_DATA_GEO_MAP_ERROR,
  EDITMETADATA_DATA_INFO,
} from '@/factories/eventBus';

import {
  EDIT_METADATA_GEODATA_TITLE,
  DATE_PROPERTY_COLLECTED_TYPE,
  DATE_PROPERTY_COLLECTED_TYPE_EXPLANATION,
  DATE_PROPERTY_CREATED_TYPE,
  DATE_PROPERTY_CREATED_TYPE_EXPLANATION,
  DATE_PROPERTY_DATE_TYPE,
  DATE_PROPERTY_END_DATE,
  DATE_PROPERTY_START_DATE,
} from '@/factories/metadataConsts';

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
  components: {
    MetadataGeo,
    BaseStatusLabelView,
    BaseRectangleButton,
    BaseStartEndDate,
  },
  props: {
    mapDivId: { type: String, default: 'map-small' },
    dates: { type: Array, default: () => [] },
    mapHeight: { type: Number, default: 450 },
    mapEditable: { type: Boolean, default: true },
    showFullscreenButton: { type: Boolean, default: false },
    layerConfig: { type: Object, default: null },
    location: {
      type: Object,
      default: () => ({ geoJSON: defaultSwissLocation }),
    },
    validationErrors: { type: Object, default: () => ({}) },
    loading: Boolean,
    message: String,
    messageDetails: String,
    error: String,
    errorDetails: String,
    readOnlyFields: { type: Array, default: () => [] },
    readOnlyExplanation: { type: String, default: '' },
  },
  data() {
    return {
      mdiUndo,
      mdiContentSave,
      mdiFileUpload,
      newGeoInfo: {
        geometries:
          convertGeoJSONToGeoCollection(defaultSwissLocation).geometries,
      },
      geomsForMap: convertGeoJSONToGeoCollection(defaultSwissLocation),
      jsonEditor: undefined,
      editorSelection: undefined,
      saveButtonEnabled: false,
      saveButtonInProgress: false,
      geoFile: undefined,
      isOverDropZone: false,
      inputError: null,
      geometryError: null,
      startDateProperty: DATE_PROPERTY_START_DATE,
      endDateProperty: DATE_PROPERTY_END_DATE,
      previewDates: [],
      labels: {
        cardTitle: EDIT_METADATA_GEODATA_TITLE,
        cardInstructions:
          'Define the location(s) where the research data was collected or refers to. Use the map tools or upload a GeoJSON.',
        defaultInstructions:
          'You are using the default location (Switzerland). Consider adjusting the geo information.',
        editorInstructions:
          'Use the text editor for fine adjustments. Only values are editable; for structural changes use the map or upload.',
        uploadInstructions: 'Upload GeoJSON if you have many geometries.',
        fileDropLabel: '…or drop a GeoJSON file here',
      },
    };
  },
  computed: {
    loadingColor() {
      return this.loading ? 'accent' : undefined;
    },
    scrollbarColorFront() {
      return this.$vuetify
        ? this.$vuetify.theme.themes.light.colors.highlight
        : 'auto';
    },
    scrollbarColorBack() {
      return this.$vuetify ? '#F0F0F0' : 'auto';
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_DATA_GEO_SPATIAL);
    },
    editErrorMessage() {
      return this.geometryError || this.validationErrors.geometries;
    },
    isDefaultLocation() {
      return (
        JSON.stringify(this.geomsForMap) ===
        JSON.stringify(defaultSwissLocation)
      );
    },
    geomsForMapString() {
      return this.geomsForMap ? JSON.stringify(this.geomsForMap) : '';
    },
    datesField() {
      const dates = this.previewDates.length
        ? this.previewDates
        : [...this.dates];
      this.ensureDateEntry(
        dates,
        DATE_PROPERTY_CREATED_TYPE,
        DATE_PROPERTY_CREATED_TYPE_EXPLANATION,
      );
      this.ensureDateEntry(
        dates,
        DATE_PROPERTY_COLLECTED_TYPE,
        DATE_PROPERTY_COLLECTED_TYPE_EXPLANATION,
      );
      const order = [DATE_PROPERTY_CREATED_TYPE, DATE_PROPERTY_COLLECTED_TYPE];
      dates.sort(
        (a, b) => order.indexOf(a.dateType) - order.indexOf(b.dateType),
      );
      return dates;
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
    editorOptions() {
      return {
        mode: 'tree',
        indentation: 2,
        navigationBar: false,
        mainMenuBar: true,
        statusBar: true,
        onSelect: (sel) => {
          this.editorSelection = sel;
        },
        onChange: this.jsonEditorOnChange,
        onError: (err) => {
          this.inputError = err.message;
        },
      };
    },
  },
  mounted() {
    eventBus.on(MAP_GEOMETRY_MODIFIED, this.changedGeoViaEditor);
    eventBus.on(EDITMETADATA_DATA_GEO_MAP_ERROR, this.triggerValidationError);
    this.emitFullGeoInfo();
    const jsonString = this.location?.geoJSON
      ? JSON.stringify(this.location.geoJSON)
      : '';
    this.changeGeoViaText(jsonString, true);
    this.initEditor(this.geomsForMapString);
    useDropZone(this.$refs.dropZoneRef, {
      onDrop: (files) => {
        if (files?.length) this.triggerFileUpload(files[0]);
      },
      multiple: false,
      onEnter: () => {
        this.isOverDropZone = true;
      },
      onLeave: () => {
        this.isOverDropZone = false;
      },
    });
  },
  beforeUnmount() {
    if (this.saveButtonEnabled) this.commitGeometriesToAPI();
    eventBus.off(MAP_GEOMETRY_MODIFIED, this.changedGeoViaEditor);
    eventBus.off(EDITMETADATA_DATA_GEO_MAP_ERROR, this.triggerValidationError);
    this.jsonEditor?.destroy();
  },
  methods: {
    emitFullGeoInfo() {
      this.$emit('validate', { ...this.newGeoInfo });
    },
    ensureDateEntry(arr, type, explanation) {
      let obj = arr.find((d) => d.dateType === type);
      if (!obj) {
        obj = {
          [DATE_PROPERTY_DATE_TYPE]: type,
          [DATE_PROPERTY_START_DATE]: '',
          [DATE_PROPERTY_END_DATE]: '',
        };
        arr.push(obj);
      }
      obj.dateExplanation = explanation;
    },
    dateChanged(index, prop, val) {
      const copy = [...this.datesField];
      copy[index] = { ...copy[index], [prop]: val };
      this.previewDates = copy;
      this.setDataInfo('dates', copy);
      this.newGeoInfo.dates = copy;
      this.emitFullGeoInfo();
    },
    clearDate(index, prop) {
      this.dateChanged(index, prop, '');
    },
    setDataInfo(property, value) {
      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_INFO,
        data: { ...this.$props, [property]: value },
      });
    },
    initEditor(text) {
      this.jsonEditor = createJSONEditor({
        target: this.$refs.editorRef,
        props: { content: { json: JSON.parse(text) }, ...this.editorOptions },
      });
    },
    jsonEditorOnChange(updated, previous, status) {
      this.inputError = null;
      if (status.contentErrors?.parseError) {
        const pErr = status.contentErrors.parseError;
        this.inputError = Array.isArray(pErr)
          ? pErr.map((e) => e.message).join(' • ')
          : pErr.message || String(pErr);
        return;
      }
      let accept = false;
      if (this.editorSelection) {
        if (this.editorSelection.type === SelectionType.value) {
          accept = true;
          this.editorSelection = undefined;
        } else {
          this.inputError = 'Only editing of values is allowed';
          this.jsonEditor.update({ json: previous.json });
        }
      } else {
        accept = true;
      }
      if (accept) {
        const tex = updated.text || JSON.stringify(updated.json);
        this.changeGeoViaText(tex);
      }
    },
    changedGeoViaEditor(geoArray) {
      this.geomsForMap = convertGeoJSONToGeoCollection(geoArray);
      if (this.jsonEditor) this.jsonEditor.update({ json: this.geomsForMap });
      this.newGeoInfo.geometries = this.geomsForMap.geometries;
      this.emitFullGeoInfo();
      this.saveButtonEnabled = true;
    },
    changeGeoViaText(text = '', skipSaveFlag = false) {
      if (typeof text === 'object') {
        const ok = this.parseGeoCollection(convertGeoJSONToGeoCollection(text));
        if (!skipSaveFlag) this.saveButtonEnabled = ok;
        return;
      }
      if (typeof text !== 'string') text = text ? JSON.stringify(text) : '';
      if (!text.trim()) {
        this.geomsForMap = convertGeoJSONToGeoCollection(defaultSwissLocation);
        return;
      }
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (e) {
        this.inputError = `Invalid JSON: ${e.message}`;
        return;
      }
      try {
        check(parsed);
      } catch (e) {
        this.inputError = e.message;
        return;
      }
      const ok = this.parseGeoCollection(convertGeoJSONToGeoCollection(parsed));
      if (!skipSaveFlag) this.saveButtonEnabled = ok;
    },
    parseGeoCollection(coll) {
      if (
        isFieldValid(
          'geometries',
          coll.geometries,
          this.validations,
          this.validationErrors,
        )
      ) {
        if (!coll.properties || !Object.keys(coll.properties).length)
          coll.properties = { name: this.location.name };
        this.geomsForMap = coll;
        this.newGeoInfo.geometries = coll.geometries;
        this.emitFullGeoInfo();
        return true;
      }
      return false;
    },
    triggerFilePicker() {
      const el =
        this.$refs.filePicker?.$el?.querySelector('input[type="file"]');
      if (el) el.click();
    },
    triggerFileUpload(file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.changeGeoViaText(reader.result);
      };
      reader.onerror = () => {
        this.inputError = 'Could not load file. Is it GeoJSON?';
      };
      reader.readAsText(file);
    },
    onFileDrop(files) {
      if (files?.length) this.triggerFileUpload(files[0]);
    },
    commitGeometriesToAPI() {
      this.saveButtonInProgress = true;
      this.saveButtonEnabled = false;
      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_GEO,
        data: { location: { ...this.location, geoJSON: this.geomsForMap } },
      });
      setTimeout(() => {
        this.saveButtonInProgress = false;
      }, 400);
    },
    triggerValidationError(msg) {
      this.geometryError = msg;
    },
  },
  watch: {
    geomsForMapString() {
      this.jsonEditor.update({ json: this.geomsForMap });
    },
    location() {
      this.saveButtonInProgress = false;
    },
    geoFile() {
      this.triggerFileUpload(this.geoFile);
    },
  },
};
</script>

<style lang="scss">
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
  transition: background-color 0.15s ease-in-out;
}
.editorHeight {
  max-height: 600px;
  overflow: auto auto;
  scrollbar-width: thin;
}
.editDataGeo {
  padding: 0;
}
.customPadding {
  .v-card-text.map-wrapper {
    padding: 0;
  }
}
</style>
