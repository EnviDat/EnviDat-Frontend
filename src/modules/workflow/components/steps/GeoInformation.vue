<template>
  <v-container id="EditDataGeo" fluid class="pa-4">
    <!-- Title box -->
    <v-row class="mb-0">
      <v-col class="text-h5 font-weight-bold" cols="12" v-html="labels.cardTitle" />
    </v-row>

    <!-- Info Banner -->
    <v-row>
      <InfoBanner :show="showInfoBanner" :icon="mdiInformationOutline" @setInfoBanner="$emit('setInfoBanner', $event)">
        <p>
          This section allows you to specify the geographic area relevant to your dataset. Accurate geospatial data
          improves discoverability and helps users understand the spatial context of your research.
        </p>

        <p><strong>Tips:</strong></p>
        <ol>
          <li>
            - Use the map tools to draw or adjust geometries directly. You can zoom, pan, and switch tile layers for
            better accuracy.
          </li>
          <li>
            - If your dataset covers a large or complex area, consider uploading a valid
            <strong>GeoJSON</strong> file.
          </li>
          <li>
            - The default geometry includes Switzerland. Replace or modify it to better reflect your dataset's scope.
          </li>
          <li>
            - Use the <strong>text editor</strong> for fine-tuned control over coordinates, or switch to the tree/table
            view for easier navigation.
          </li>
          <li>- Ensure the geometry is valid GeoJSON. Invalid JSON will prevent you from proceeding.</li>
        </ol>

        <p class="mt-2">
          Also provide <strong>Time Information</strong> about when the data was collected or created. These fields help
          contextualize your dataset for future reuse.
        </p>
      </InfoBanner>
    </v-row>

    <!-- Map + errors -->
    <v-col data-field="geometries" cols="12" class="editDataGeo customPadding mt-5">
      <MetadataGeo :elevation="0" :showTitle="false" :showError="false" v-bind="metadataGeoProps" />
      <v-col class="pl-0" v-if="validationErrors.geometries != null">
        <v-alert type="error">
          {{ validationErrors.geometries }}
        </v-alert>
      </v-col>
    </v-col>

    <v-row v-show="isDefaultLocation" class="mt-5">
      <v-col>
        <v-alert type="warning">{{ labels.defaultInstructions }}</v-alert>
      </v-col>
    </v-row>

    <!-- Editor + Dates -->
    <v-row>
      <v-col cols="12" xl="6">
        <v-row>
          <v-col>
            <div class="font-weight-bold">Editor</div>
            <div class="text-caption">
              {{ labels.editorInstructions }}
            </div>
          </v-col>

          <v-col cols="12">
            <v-expansion-panels v-model="activePanel" rounded="md">
              <v-expansion-panel eager>
                <v-expansion-panel-title>Open Editor</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <!-- JSON EDITOR -->
                  <div
                    class="editorHeight mb-2"
                    :style="`scrollbar-color: ${scrollbarColorFront} ${scrollbarColorBack};`"
                  >
                    <div class="columns">
                      <div class="column">
                        <div class="jsoneditor-vue" ref="editorRef"></div>
                      </div>
                    </div>
                  </div>
                  <!-- local parse / validation error -->
                  <div v-if="inputError">
                    <v-alert type="warning">{{ inputError }}</v-alert>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>

          <!-- hidden file input -->
          <v-file-input style="display: none" ref="filePicker" accept=".geojson,.json" v-model="geoFile" />

          <v-col cols="12">
            <v-row no-gutters align="center">
              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="12">{{ labels.uploadInstructions }}</v-col>
                  <v-col cols="12" class="pt-2">
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
                </v-row>
              </v-col>

              <v-col cols="6">
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

      <v-col cols="12" xl="6">
        <v-row
          v-for="(item, index) in datesField"
          :key="index"
          :class="`d-flex flex-column ${index > 0 ? 'pt-4' : ''}`"
          no-gutters
          dense
        >
          <v-col cols="11" class="flex-grow-0 mb-3">
            <div class="text-body-1 font-weight-bold text-capitalize">Time Information - {{ item.dateType }}</div>
            <div class="text-body-1 text-caption">
              {{ item.dateExplanation }}.
              <b>{{ datesField[index].dateType === 'created' ? 'This field is mandatory' : '' }}</b>
            </div>
          </v-col>
          <v-col cols="12">
            <BaseStartEndDate
              data-field="dates"
              :startDate="item.dateType === 'created' ? item.date : item.dateStart"
              :endDate="item.dateType === 'created' ? item.endDate : item.dateEnd"
              :startDateProperty="item.dateType === 'created' ? 'date' : 'dateStart'"
              :endDateProperty="item.dateType === 'created' ? 'endDate' : 'dateEnd'"
              :error-messages="validationErrors.dates"
              :endDateLabel="`${item.dateType} end date`"
              :clearableEndDate="false"
              :clearableStartDate="false"
              rowLayout
              @dateChange="(prop, val) => dateChanged(index, prop, val)"
              @clearClick="(prop) => clearDate(index, prop)"
              :readOnlyFields="readOnlyFields"
              :readOnlyExplanation="readOnlyExplanation"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col v-show="validationErrors.dates" cols="12">
            <v-alert type="error">
              {{ validationErrors.dates }}
            </v-alert>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiContentSave, mdiFileUpload, mdiInformationOutline } from '@mdi/js';
import { check } from '@placemarkio/check-geojson';
import { createJSONEditor, SelectionType } from 'vanilla-jsoneditor';
import { useDropZone } from '@vueuse/core';

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
} from '@/factories/eventBus';

import { getValidationMetadataEditingObject, isFieldValid } from '@/factories/userEditingValidations';

import { convertGeoJSONToGeoCollection, defaultSwissLocation } from '@/factories/geoFactory';

import { useDatasetWorkflowStore } from '@/modules/workflow/datasetWorkflow';

import InfoBanner from '@/modules/workflow/components/steps/InformationBanner.vue';

export default {
  name: 'EditDataGeo',
  components: { MetadataGeo, BaseRectangleButton, BaseStartEndDate, InfoBanner },
  props: {
    mapDivId: { type: String, default: 'map-small' },
    dates: { type: Array, default: () => [] },
    geometries: { type: [Array, Object], default: () => [] },
    mapHeight: { type: Number, default: 450 },
    mapEditable: { type: Boolean, default: true },
    showFullscreenButton: { type: Boolean, default: false },
    layerConfig: { type: Object, default: null },
    location: { type: Object, default: () => ({ geoJSON: defaultSwissLocation }) },
    validationErrors: { type: Object, default: () => ({}) },
    loading: Boolean,
    message: String,
    messageDetails: String,
    error: String,
    errorDetails: String,
    readOnlyFields: { type: Array, default: () => [] },
    readOnlyExplanation: { type: String, default: '' },
    showInfoBanner: { type: Boolean, default: true },
  },
  data() {
    return {
      mdiInformationOutline,
      mdiContentSave,
      mdiFileUpload,
      activePanel: null,
      workflowStore: null,

      newGeoInfo: { geometries: convertGeoJSONToGeoCollection(defaultSwissLocation).geometries },
      geomsForMap: convertGeoJSONToGeoCollection(defaultSwissLocation),
      jsonEditor: undefined,
      editorSelection: undefined,
      lastSavedGeomsString: '',
      saveButtonEnabled: false,
      saveButtonInProgress: false,
      geoFile: undefined,
      isOverDropZone: false,
      inputError: null,
      geometryError: null,
      startDateProperty: 'dateStart',
      endDateProperty: 'dateEnd',
      previewDates: [],
      labels: {
        cardTitle: 'Geospatial Information',
        cardInstructions:
          'Define the location(s) where the research data was collected or refers to. Use the map tools or upload a GeoJSON.',
        defaultInstructions:
          'You are using the default location (Switzerland). Consider adjusting the geo information.',
        editorInstructions:
          'Use the text editor for fine adjustments. Only values are editable; for structural changes use the map or upload.',
        uploadInstructions: 'Upload GeoJSON if you have many geometries.',
        fileDropLabel: '…or drop a GeoJSON file here',
      },
      initializing: true,
    };
  },
  computed: {
    getMode() {
      return this.workflowStore?.mode;
    },
    loadingColor() {
      return this.loading ? 'accent' : undefined;
    },
    scrollbarColorFront() {
      return this.$vuetify ? this.$vuetify.theme.themes.light.colors.highlight : 'auto';
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
      return JSON.stringify(this.geomsForMap) === JSON.stringify(defaultSwissLocation);
    },
    geomsForMapString() {
      return this.geomsForMap ? JSON.stringify(this.geomsForMap) : '';
    },
    datesField() {
      const dates = this.previewDates.length ? this.previewDates : [...this.dates];

      this.ensureDateEntry(dates, 'created', 'Date range during the research data was finalized or formally created');

      this.ensureDateEntry(dates, 'collected', 'Date range during the research data was gathered or collected.');

      const order = ['created', 'collected'];
      dates.sort((a, b) => order.indexOf(a.dateType) - order.indexOf(b.dateType));
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
    vuetifyHighlight() {
      return this.$vuetify.theme.themes.light.colors.highlight;
    },
  },
  mounted() {
    eventBus.on(MAP_GEOMETRY_MODIFIED, this.changedGeoViaEditor);
    eventBus.on(EDITMETADATA_DATA_GEO_MAP_ERROR, this.triggerValidationError);

    // GET initial geometry
    const initial = this.resolveInitialGeo();

    this.applyCollection(initial, { emit: false });

    this.initEditor(this.geomsForMapString);
    this.initializing = false;

    this.lastSavedGeomsString = JSON.stringify(this.geomsForMap);

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
    toCollection(input) {
      if (!input) return convertGeoJSONToGeoCollection(defaultSwissLocation);

      let val = input;
      if (typeof val === 'string') {
        try {
          val = JSON.parse(val);
        } catch {
          // fallBack to default
        }
      }

      if (Array.isArray(val)) {
        return { type: 'GeometryCollection', geometries: val };
      }

      return convertGeoJSONToGeoCollection(val);
    },

    // GET initial geometry
    resolveInitialGeo() {
      if (this.geometries && (Array.isArray(this.geometries) || this.geometries.type)) {
        return this.toCollection(this.geometries);
      }

      if (this.location?.geoJSON) {
        return this.toCollection(this.location.geoJSON);
      }
      return convertGeoJSONToGeoCollection(defaultSwissLocation);
    },

    applyCollection(coll, { emit = false } = {}) {
      this.geomsForMap = coll;
      this.newGeoInfo.geometries = coll.geometries;

      if (this.jsonEditor) this.jsonEditor.update({ json: this.geomsForMap });

      const currentStr = JSON.stringify(this.geomsForMap);
      this.saveButtonEnabled = currentStr !== this.lastSavedGeomsString;

      if (emit && !this.initializing) this.$emit('save', this.newGeoInfo);
    },

    ensureDateEntry(arr, type, explanation) {
      let obj = arr.find((d) => d.dateType === type);
      if (!obj) {
        obj = { dateType: type, dateStart: '', dateEnd: '' };
        arr.push(obj);
      }
      obj.dateExplanation = explanation;
    },

    dateChanged(index, prop, val) {
      const copy = [...this.datesField];
      copy[index] = { ...copy[index], [prop]: val };
      this.previewDates = copy;
      this.newGeoInfo.dates = this.previewDates;
      this.$emit('save', this.newGeoInfo);
    },
    clearDate(index, prop) {
      this.dateChanged(index, prop, '');
    },

    initEditor(text) {
      const json = text ? JSON.parse(text) : convertGeoJSONToGeoCollection(defaultSwissLocation);
      this.jsonEditor = createJSONEditor({
        target: this.$refs.editorRef,
        props: { content: { json }, ...this.editorOptions },
      });
    },

    jsonEditorOnChange(updated, previous, status) {
      this.inputError = null;

      if (status.contentErrors?.parseError) {
        const pErr = status.contentErrors.parseError;
        this.inputError = Array.isArray(pErr) ? pErr.map((e) => e.message).join(' • ') : pErr.message || String(pErr);
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

      if (!accept) return;

      const nextJson = updated.json || (updated.text ? JSON.parse(updated.text) : null);
      if (!nextJson) return;

      try {
        check(nextJson);
        this.inputError = null;
      } catch (e) {
        this.inputError = e.message;
      }

      const coll = convertGeoJSONToGeoCollection(nextJson);

      this.applyCollection(coll, { emit: false });
    },

    changedGeoViaEditor(geoArray) {
      const coll = convertGeoJSONToGeoCollection(geoArray);
      this.applyCollection(coll, { emit: !this.initializing });
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
        this.applyCollection(convertGeoJSONToGeoCollection(defaultSwissLocation), { emit: false });
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
      const valid = isFieldValid('geometries', coll.geometries, this.validations, this.validationErrors);
      if (valid) {
        if (!coll.properties || !Object.keys(coll.properties).length) {
          coll.properties = { name: this.location.name };
        }
        this.applyCollection(coll, { emit: !this.initializing });
        return true;
      }
      return false;
    },

    triggerFilePicker() {
      const el = this.$refs.filePicker?.$el?.querySelector('input[type="file"]');
      if (el) el.click();
    },

    triggerFileUpload(file) {
      const reader = new FileReader();
      reader.onload = () => this.changeGeoViaText(reader.result);
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

      this.$emit('save', this.newGeoInfo);

      this.lastSavedGeomsString = JSON.stringify(this.geomsForMap);
      this.saveButtonEnabled = false;

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
      if (this.jsonEditor) this.jsonEditor.update({ json: this.geomsForMap });
    },

    location: {
      deep: true,
      handler(nv) {
        const g = nv?.geoJSON;
        if (g) this.applyCollection(this.toCollection(g), { emit: false });
      },
    },

    geometries: {
      deep: true,
      handler(nv) {
        if (!nv) return;
        const coll = this.toCollection(nv);
        this.applyCollection(coll, { emit: false });
      },
    },

    geoFile() {
      this.triggerFileUpload(this.geoFile);
    },
  },
  created() {
    this.workflowStore = useDatasetWorkflowStore();
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
