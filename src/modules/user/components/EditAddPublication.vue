<template>
  <v-container fluid
               id="EditAddPublication"
               class="pa-0"
  >

    <!-- horizontal layout -->
    <v-row v-if="$vuetify.breakpoint.mdAndUp"
           no-gutters
           align="center"
            >
      <v-col cols="5">
        <v-row no-gutters
                justify="start">

          <v-col cols="10" >
            <v-text-field
                v-model="pidField"
                :label="labels.pId"
                :disabled="!!doiField"
                outlined
                dense
                hide-details
                prepend-icon="account_circle"
                @input="pidChange"
            />
          </v-col>
        </v-row>

        <v-row no-gutters
               align="center"
               justify="start">

          <v-col cols="10"
                 style="text-align: center;"
                 class="text-h6 py-2 px-md-4 shrink" >
            Or
          </v-col>

          <v-col class="ma-auto ma-md-0 pl-md-4 pt-4 pt-md-0">
            <BaseIconButton material-icon-name="add"
                            :fillColor="addButtonActive ? $vuetify.theme.themes.light.primary : 'white'"
                            :icon-color="addButtonActive ? 'white' : 'black'"
                            color="primary"
                            :disabled="!addButtonActive"
                            outlined
                            isSmall
                            @clicked="addClick"
            />
          </v-col>

        </v-row>

        <v-row no-gutters
               align="center"
               justify="start">

          <v-col cols="10" >

            <v-text-field
                  v-model="doiField"
                  :label="labels.doi"
                  :disabled="!!pidField"
                  outlined
                  dense
                  hide-details
                  prepend-icon="fingerprint"
                  @input="doiChange"
                  />

          </v-col>

        </v-row>
      </v-col>

      <v-col cols="7">
        <v-row no-gutters >
          <v-col >
            <div class="text-subtitle-1"
                 v-html="labels.subtitlePreview">

            </div>
          </v-col>
        </v-row>

        <v-row no-gutters
               class="pt-2">
          <v-col >
            <v-card class="pa-4 pl-3">
              <BaseCitationView v-bind="citationViewProps" />
            </v-card>
          </v-col>
        </v-row>

      </v-col>
    </v-row>

    <!-- vertical layout -->
    <v-row v-if="$vuetify.breakpoint.smAndDown"
           no-gutters
            align="center"
            dense >

      <v-col cols="12"
              md="auto">
        <v-text-field
            v-model="pidField"
            :label="labels.pId"
            :disabled="!!doiField"
            outlined
            dense
            hide-details
            prepend-icon="account_circle"
            @input="pidChange"
        />
      </v-col>

      <v-col cols="12"
             md="auto"
             style="text-align: center;"
              class="text-h6 py-2 py-md-0 px-md-4 shrink" >
        Or
      </v-col>

      <v-col cols="12"
             md="auto">
        <v-text-field
            v-model="doiField"
            :label="labels.doi"
            :disabled="!!pidField"
            outlined
            dense
            hide-details
            prepend-icon="fingerprint"
            @input="doiChange"
        />
  <!--
            @change="doiField = $event"
            @input="validateProperty('doi', $event)"
        :readonly="mixinMethods_isFieldReadOnly('doi')"
        :hint="mixinMethods_readOnlyHint('doi')"
        :error-messages="validationErrors.doi"
  -->

      </v-col>

      <v-col cols="auto"
             class="ma-auto ma-md-0 pl-md-4 pt-4 pt-md-0">
        <BaseIconButton material-icon-name="add"
                        :fillColor="addButtonActive ? $vuetify.theme.themes.light.primary : 'white'"
                        :icon-color="addButtonActive ? 'white' : 'black'"
                        color="primary"
                        :disabled="!addButtonActive"
                        outlined
                        @clicked="addClick"
        />

      </v-col>

      <v-col cols="12 pt-4">
        <v-card class="pa-4 pl-3">
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
import { mapState } from 'vuex';

import {
  resolveDoiCitationObjectsViaDora,
  resolvePidCitationObjectsViaDora,
} from '@/factories/citationFactory';

export default {
  name: 'EditAddPublication',
  props: {
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
    /* prop to use without the $store in the storybook context */
    resolveBaseUrl: {
      type: String,
      default: undefined,
    },
    /* prop to use without the $store in the storybook context */
    resolveBaseDOIUrl: {
      type: String,
      default: undefined,
    },
  },
  mounted() {
    if (this.pid) {
      this.pidChange(this.pid);
    } else if (this.doi) {
      this.doiChange(this.doi);
    }
  },
  computed: {
    ...mapState(['config']),
    metadataConfig() {
      return this.$store ? this.config?.metadataConfig || {} : {};
    },
    publicationsConfig() {
      return this.metadataConfig?.publicationsConfig || {};
    },
    resolveBaseUrlField() {
      return this.publicationsConfig?.resolveBaseUrl || this.resolveBaseUrl;
    },
    resolveBaseDOIUrlField() {
      return this.publicationsConfig?.resolveBaseDOIUrl || this.resolveBaseDOIUrl;
    },
    addButtonActive() {
      return this.pidField || this.doiField;
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
        doi: this.previewCitation?.doi || this.doi,
        doiUrl: this.previewCitation?.doiUrl || this.doiUrl,
        citation: this.previewCitation?.citation || this.citation,
        abstract: this.previewCitation?.abstract || this.abstract,
      };
    },
  },
  methods: {
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
        const citationMap = await resolvePidCitationObjectsViaDora(pidMap, this.resolveBaseUrlField);
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
        const citationMap = await resolveDoiCitationObjectsViaDora(doiMap, this.resolveBaseDOIUrlField);
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
      });

    },
  },
  data: () => ({
    isResolving: false,
    previewCitation: null,
    previewPID: null,
    previewDOI: null,
    editingProperty: 'relatedPublicationsText',
    labels: {
      title: EDIT_METADATA_ADD_PUBLICATION_TITLE,
      cardInstructions: 'Add DORA permantant Id (PID) or a Data Object Identifer (DOI).',
      subtitlePreview: 'Preview Publications resolved via DORA',
      pId: 'Permant Id',
      doi: 'Data Object Identifier',
    },
    validationErrors: {
      relatedPublicationsText: null,
    },
  }),
  components: {
    BaseIconButton,
    BaseCitationView,
  },
};


</script>
