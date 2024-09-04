<template>
  <v-container fluid id="EditAddPublication" class="pa-0">
    <v-row no-gutters align="center" :dense="dense">
      <v-col cols="12" md="auto">
        <v-text-field
          v-model="pidField"
          :label="labels.pId"
          :dense="dense"
          :disabled="!!doiField"
          outlined
          hide-details
          prepend-icon="account_circle"
          @input="pidChange"
        />
      </v-col>

      <v-col
        cols="12"
        md="auto"
        style="text-align: center;"
        class="text-h6 px-md-4 shrink"
      >
        Or
      </v-col>

      <v-col cols="12" md="auto">
        <v-text-field
          v-model="doiField"
          :label="labels.doi"
          :dense="dense"
          :disabled="!!pidField"
          outlined
          hide-details
          prepend-icon="fingerprint"
          @input="doiChange"
        />
      </v-col>

      <v-col cols="auto" class="ma-auto ma-md-0 pl-md-4 pt-4 pt-md-0">
        <BaseIconButton
          v-if="!isEditMode"
          material-icon-name="add"
          :fillColor="$vuetify.theme.themes.light.primary"
          icon-color="white"
          :is-small="dense && $vuetify.breakpoint.mdAndUp"
          @clicked="addClick"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <a
          id="textAreaController"
          class="text-caption"
          @click="toggleTextArea()"
          >{{ showTextArea ? 'Hide' : 'Add' }} plain text</a
        >
        <template v-if="isEditMode">
          <v-btn
            class="mr-4 ml-4"
            color="primary"
            x-small
            @click="editExistingData()"
            >edit</v-btn
          >
          <v-btn x-small @click="closeEditMode()">cancel</v-btn>
        </template>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- @changedText="catchChangedText($event)" -->
        <GenericTextareaPreviewLayout
          v-if="showTextArea"
          v-bind="genericTextAreaObject"
          @inputedText="catchInputedText($event)"
        >
        </GenericTextareaPreviewLayout>
      </v-col>
    </v-row>
    <v-row no-gutters class="pt-2">
      <v-col>
        <v-card class="pa-4">
          <BaseCitationView v-bind="citationViewProps" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * EditAddPublication.vue shows a text field for the PID or the DOI and gives a preview
 * of the publication
 *
 * @summary shows a widget to add publications
 * @author Dominik Haas-Artho
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import { EDIT_METADATA_ADD_PUBLICATION_TITLE } from '@/factories/metadataConsts';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import BaseCitationView from '@/components/BaseElements/BaseCitationView.vue';
// import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import GenericTextareaPreviewLayout from '@/components/Layouts/GenericTextareaPreviewLayout.vue';

import {
  eventBus,
  EDIT_RELATED_PUBLICATION_SEND,
  EDIT_RELATED_PUBLICATION_ACTION,
} from '@/factories/eventBus';

import {
  resolveDoiCitationObjectsViaDora,
  resolvePidCitationObjectsViaDora,
} from '@/factories/citationFactory';

export default {
  name: 'EditAddPublication',
  props: {
    selectedPlainText: {
      type: String,
      default: undefined,
    },
    pid: {
      type: String,
      default: undefined,
    },
    doi: {
      type: String,
      default: undefined,
    },
    abstract: {
      type: String,
      default: undefined,
    },
    citation: {
      type: String,
      default: undefined,
    },
    doiUrl: {
      type: String,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    eventBus.on(EDIT_RELATED_PUBLICATION_SEND, this.editData);
  },
  beforeDestroy() {
    eventBus.off(EDIT_RELATED_PUBLICATION_SEND, this.editData);
  },
  mounted() {
    if (this.pid) {
      this.pidChange(this.pid);
    } else if (this.doi) {
      this.doiChange(this.doi);
    }
  },
  computed: {
    genericTextAreaObject() {
      return {
        isVerticalLayout: true,
        textareaContent: this.selectedPlainText,
      };
    },
    pidField: {
      get() {
        return this.previewPID !== null ? this.previewPID : this.pid;
      },
      set(value) {
        this.previewPID = value;
      },
    },
    doiField: {
      get() {
        return this.previewDOI !== null ? this.previewDOI : this.doi;
      },
      set(value) {
        this.previewDOI = value;
      },
    },
    citationViewProps() {
      return {
        pid: this.previewCitation?.pid || this.pid,
        doi: this.previewCitation?.doi || this.doi,
        doiUrl: this.previewCitation?.doiUrl || this.doiUrl,
        citation: this.previewCitation?.citation || this.citation,
        abstract: this.previewCitation?.abstract || this.abstract,
      };
    },
  },
  methods: {
    editExistingData() {
      this.$emit('saveText', this.previewCitation?.citation || this.citation );
      this.closeEditMode();
    },
    closeEditMode() {
      this.isEditMode = false;
      this.plainText = null;
      this.previewCitation = null;
      this.showTextArea = false;
      this.filledTextArea = '';
      this.$emit('cancelText');
    },
    editData(citationText) {
      this.isEditMode = true;
      this.showTextArea = true;
      this.filledTextArea = citationText;

      this.previewCitation = {
        doi: null,
        doiUrl: null,
        citation: citationText,
        abstract: null,
      };

      // this.indexEditData = object.index;
    },
    toggleTextArea() {
      this.showTextArea = !this.showTextArea;
      this.plainText = null;
      this.previewCitation = null;
      this.filledTextArea = '';
      this.isEditMode = false;
    },
    catchInputedText(value) {
      const previewPlainText = {
        doi: null,
        doiUrl: null,
        citation: value,
        abstract: null,
      };
      this.previewCitation = previewPlainText;
      this.plainText = value;
    },
    pidChange(pid) {
      if (!this.isResolving) {
        this.resolvePIDs(pid);
      }
    },
    doiChange(doi) {
      if (!this.isResolving) {
        this.resolveDOIs(doi);
      }
    },
    async resolvePIDs(pid) {
      this.previewCitation = null;
      this.isResolving = true;
      const pidMap = new Map();
      pidMap.set(pid, pid);

      try {
        const citationMap = await resolvePidCitationObjectsViaDora(pidMap);
        this.previewCitation = citationMap.get(pid);
      } catch (e) {
        this.previewCitation = {
          citation: `Resolving citation was not possible ${e}`,
        };
      }

      this.isResolving = false;
    },
    async resolveDOIs(doi) {
      this.previewCitation = null;
      this.isResolving = true;

      const doiMap = new Map();
      doiMap.set(doi, doi);

      try {
        const citationMap = await resolveDoiCitationObjectsViaDora(doiMap);
        this.previewCitation = citationMap.get(doi);
      } catch (e) {
        this.previewCitation = {
          citation: `Resolving citation was not possible ${e}`,
        };
      }

      this.isResolving = false;
    },
    addClick() {
      this.$emit('addClicked', {
        pid: this.pidField,
        doi: this.doiField,
        plainText: this.plainText,
      });
      this.doiField = null;
      this.pidField = null;
      this.plainText = null;
      this.previewCitation = null;
      this.showTextArea = false;
    },
  },
  watch: {
    selectPlainText() {
      if (this.selectedPlainText) {
        this.editData(this.selectPlainText);
      }
    },
  },
  data: () => ({
    // indexEditData: false,
    isEditMode: false,
    showTextArea: false,
    isResolving: false,
    previewCitation: null,
    filledTextArea: '',
    previewPID: null,
    previewDOI: null,
    plainText: null,
    editingProperty: 'relatedPublicationsText',
    labels: {
      title: EDIT_METADATA_ADD_PUBLICATION_TITLE,
      cardInstructions:
        'Add DORA permanent Id (PID) or a Data Object Identifier (DOI).',
      subtitlePreview: 'Preview Publication resolved via DORA',
      pId: 'Permanent Id',
      doi: 'Data Object Identifier',
    },
    validationErrors: {
      relatedPublicationsText: null,
    },
  }),
  components: {
    BaseIconButton,
    BaseCitationView,
    // BaseStatusLabelView,
    GenericTextareaPreviewLayout,
  },
};
</script>
