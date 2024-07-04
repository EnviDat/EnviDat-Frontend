<template>
  <v-card id="EditDataLicense" class="pa-0" :loading="loading">
    <v-container fluid class="pa-4 fill-height">
      <template slot="progress">
        <v-progress-linear color="primary" indeterminate />
      </template>

      <v-row>
        <v-col cols="8" class="text-h5">
          {{ labels.cardTitle }}
        </v-col>

        <v-col v-if="message">
          <BaseStatusLabelView
            statusIcon="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>
        <v-col v-if="error">
          <BaseStatusLabelView
            statusIcon="error"
            statusColor="error"
            :statusText="error"
            :expandedText="errorDetails"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div class="text-body-1" v-html="labels.instructionsLicense" >
          </div>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-select
            :items="activeLicenses"
            item-value="id"
            item-text="title"
            outlined
            hide-details="auto"
            :label="labels.dataLicense"
            :readonly="isDataLicenseReadonly"
            :hint="dataLicenseReadonlyExplanation"
            prepend-icon="policy"
            append-icon="arrow_drop_down"
            :value="selectedLicense"
            @input="changeLicense($event)"
            :error-messages="validationErrors.dataLicense"
          />
        </v-col>
      </v-row>

      <v-row class="pl-md-8">
        <v-col>
          <v-expansion-panels focusable>
            <v-expansion-panel>
              <v-expansion-panel-header expand-icon="arrow_drop_down"
              class="py-2 px-3">
                {{ dataSummaryClickInfo }}
              </v-expansion-panel-header>
              <!--              <v-expansion-panel-content>{{ this.getDataLicenseSummary }}</v-expansion-panel-content>-->
              <v-expansion-panel-content
                  class="pa-1 pa-md-2 licensePanel">
                <div v-html="getDataLicenseSummary" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="text-body-2">
          <div>{{ labels.dataLicenseUrl }}</div>
          
          <a v-if="dataLicenseLinkExists"
             :href="getDataLicenseLink" target="_blank">
            {{ getDataLicenseLink }}
          </a>
          
          <div v-if="!dataLicenseLinkExists" >
            {{ getDataLicenseLink }}
          </div>

        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * EditDataLicense.vue shows Additional Information
 *
 *
 * @summary Shows Additional Information (creation & collection dates, data license and summary)
 * @author Rebecca Kurup Buchholz, Sam Woodcock, Dominik Haas-Artho
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-11-08
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_DATA_LICENSE,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';

import { renderMarkdown } from '@/factories/stringFactory';

import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';

import {
  getAvailableLicensesForEditing,
  OTHER_UNDEFINED_LICENSE_ID,
  WSL_DATA_LICENSE_ID,
} from '@/factories/dataLicense';
import { EDIT_METADATA_DATALICENSE_TITLE, METADATA_DATALICENSE_PROPERTY } from '@/factories/metadataConsts';

export default {
  name: 'EditDataLicense',
  props: {
    dataLicenseId: {
      type: String,
      default: '',
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
  created() {
    eventBus.on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeDestroy() {
    eventBus.off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  computed: {
    dataSummaryClickInfo() {
      if (this.currentDataLicense) {
        return `${this.labels.dataLicenseSummary} of ${this.currentDataLicense.title}`;
      }

      return this.labels.dataLicenseSummary;
    },
    selectedLicense: {
      get() {
        if (!this.dataLicenseId) {
          return '';
        }

        const dataLicense = this.currentDataLicense;

        return {
          id: dataLicense?.id,
          title: dataLicense?.title,
        };
      },
    },
    currentDataLicense() {
      const id = this.previewDataLicenses !== null ? this.previewDataLicenses : this.dataLicenseId;
      return this.getLicenseById(id);
    },
    getDataLicenseLink() {
      if (!this.currentDataLicense) {
        return 'Please select a data license above to view link for more detailed information.';
      }

      return this.currentDataLicense?.link || 'Data license information unavailable';
    },
    getDataLicenseSummary() {
      if (!this.currentDataLicense) {
        return 'Please select a data license above to view data license summary.';
      }

      return this.markdownText(this.currentDataLicense?.summary) || 'Data summary information unavailable';
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_DATA_LICENSE);
    },
    dataLicenseLinkExists() {
      return !!this.currentDataLicense?.link;
    },
    activeLicenses() {
      return getAvailableLicensesForEditing();
    },
    isDataLicenseReadonly() {
      const readonlyBecausePublished = this.readOnlyFields?.includes(METADATA_DATALICENSE_PROPERTY) || false;

      if (readonlyBecausePublished) {
        return (this.dataLicenseId !== WSL_DATA_LICENSE_ID
                && this.dataLicenseId !== OTHER_UNDEFINED_LICENSE_ID);
      }

      return false;
    },
    dataLicenseReadonlyExplanation() {
      return this.isDataLicenseReadonly ? this.readOnlyExplanation : undefined;
    },
  },
  methods: {
    clearPreviews() {
      this.previewDataLicenses = null;
    },
    getLicenseById(id) {
      if (!id) {
        return null;
      }

      const dataLicense = this.activeLicenses.filter(x => x.id === id)[0];

      return dataLicense || null;
    },
    markdownText(mdText) {
      return renderMarkdown(mdText);
    },
    setDataLicenseInfo(value) {
      const currentLicense = this.getLicenseById(value);

      const id = currentLicense?.id || '';
      const title = currentLicense?.title || '';
      const url = currentLicense?.link || '';

      const newDataInfo = {
        ...this.$props,
        dataLicenseId: id,
        dataLicenseTitle: title,
        dataLicenseUrl: url,
      };

      eventBus.emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_LICENSE,
        data: newDataInfo,
      });
    },
    changeLicense(value) {
      const property = 'dataLicenseId';

      this.previewDataLicenses = value;

      if (isFieldValid(property, value, this.validations, this.validationErrors)) {
        this.setDataLicenseInfo(value);
      }
    },
  },
  components: {
    BaseStatusLabelView,
  },
  data: () => ({
    METADATA_DATALICENSE_PROPERTY,
    validationErrors: {
      dataLicense: null,
    },
    labels: {
      cardTitle: EDIT_METADATA_DATALICENSE_TITLE,
      instructionsLicense: 'Select a data license which reflects the terms of usage of your research data. CC-BY-SA is the recommend license, read the blog post about <a href="https://envidat.ch/#/blog/EnviDat_WSLIntern_2022q4.md" target="_blank">Data license</a> for more information. ',
      dataLicense: 'Click here to select a data license',
      dataLicenseSummary: 'Show a summary',
      dataLicenseUrl:
        'Link for more detailed information about selected Data License:',
    },
    previewDataLicenses: null,
  }),
};
</script>

<style >

.licensePanel div.v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
