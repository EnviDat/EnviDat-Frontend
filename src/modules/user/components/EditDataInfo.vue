<template>
  <v-card id="EditDataInfo"
          class="pa-0"
          :loading="loading">

    <v-container fluid
                 class="pa-4 fill-height">

      <template slot="progress">
        <v-progress-linear color="primary"
                           indeterminate />
      </template>

      <v-row>
        <v-col cols="8"
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
        <v-col>
          <div class="text-body-1" v-html="labels.instructions" />
        </v-col>
      </v-row>

      <v-row >
        <v-container fluid class="py-2 px-4 heightAndScroll">

        <v-row v-for="(item, index) in datesField"
                :key="`${item}_${index}`"
                dense >
          <v-col cols="3">
            <v-text-field
              dense
              readonly
              outlined
              prepend-icon="category"
              :value="item.dateType"
              :error-messages="validationErrors.dates[index].dateType"
            />
          </v-col>

          <v-col class="pl-4">

            <BaseStartEndDate :startDate="item.dateStart"
                              :startDateProperty="startDateProperty"
                              :endDate="item.dateEnd"
                              :endDateProperty="endDateProperty"
                              :clearableEndDate="true"
                              @dateChange="dateChanged(index, ...arguments)"
                              @clearClick="clearDate(index, ...arguments)"
                              :readOnlyFields="readOnlyFields"
                              :readOnlyExplanation="readOnlyExplanation"
                              />

          </v-col>

        </v-row>

        </v-container>
      </v-row>

      <v-row>
        <v-col>
          <div class="text-body-1">{{ labels.instructionsLicense }}</div>
        </v-col>
      </v-row>

      <v-row >
        <v-col>
          <v-select
            :items="dataLicenses"
            item-value="id"
            item-text="title"
            outlined
            hide-details
            :label="labels.dataLicense"
            :readonly="mixinMethods_isFieldReadOnly('dataLicenseId')"
            :hint="mixinMethods_readOnlyHint('dataLicenseId')"
            prepend-icon="data_usage"
            append-icon="arrow_drop_down"
            :value="selectedLicence"
            @input="changeLicense($event)"
            :error-messages="validationErrors.dataLicense"
          />
        </v-col>
      </v-row>

      <v-row class="pl-8" >
        <v-col >
          <v-expansion-panels focusable>
            <v-expansion-panel>

              <v-expansion-panel-header expand-icon="arrow_drop_down">
                {{ this.labels.dataLicenseSummary }}
              </v-expansion-panel-header>
              <!--              <v-expansion-panel-content>{{ this.getDataLicenseSummary }}</v-expansion-panel-content>-->
              <v-expansion-panel-content>
                <div v-html="getDataLicenseSummary" />
              </v-expansion-panel-content>

            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div v-if="!this.selectedLicence" class="text-body-3">
            {{ this.getDataLicenseLink }}
          </div>

          <div v-if="this.selectedLicence && this.dataLicenseLinkExists()"
                class="text-body-3" >
            {{ this.labels.dataLicenseEmail }}
          </div>
          <div
            v-if="this.selectedLicence && this.dataLicenseLinkExists()"
            class="text-body-3"
          >
            <a v-bind:href="this.getDataLicenseLink" target="_blank">{{
              this.getDataLicenseLink
            }}</a>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * EditDataInfo.vue shows Additional Information
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

import {
  EDITMETADATA_CLEAR_PREVIEW,
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';
// eslint-disable-next-line import/no-cycle
import {
  getValidationMetadataEditingObject,
  isFieldValid,
} from '@/factories/userEditingValidations';

import { renderMarkdown } from '@/factories/stringFactory';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';

import BaseStartEndDate from '@/components/BaseElements/BaseStartEndDate';
import {
  DATE_PROPERTY_DATE_TYPE,
  DATE_PROPERTY_END_DATE,
  DATE_PROPERTY_START_DATE,
} from '@/factories/mappingFactory';

export default {
  name: 'EditDataInfo',
  props: {
    dataLicenseId: {
      type: String,
      default: '',
    },
    dates: {
      type: Array,
      default: () => [],
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
    eventBus.$on(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  beforeDestroy() {
    eventBus.$off(EDITMETADATA_CLEAR_PREVIEW, this.clearPreviews);
  },
  computed: {
    selectedLicence: {
      get() {
        if (!this.dataLicenseId) {
          return ''
        }

        const dataLicense = this.getLicenseById(this.dataLicenseId);

        return {
          id: dataLicense.id,
          title: dataLicense.title,
        }
      },
    },
    datesField: {
      get() {
        const dates = this.previewDates?.length > 0 ? this.previewDates : [...this.dates];

        const createdType = 'created'
        const createdAmount = dates.filter((dObj) => dObj.dateType === createdType).length;

        if (createdAmount <= 0) {
          dates.push({
            [DATE_PROPERTY_DATE_TYPE]: createdType,
            [DATE_PROPERTY_START_DATE]: '',
            [DATE_PROPERTY_END_DATE]: '',
          });
        }

        const collectedType = 'collected'
        const collectedAmount = dates.filter((dObj) => dObj.dateType === collectedType).length;

        if (collectedAmount <= 0) {
          dates.push({
            [DATE_PROPERTY_DATE_TYPE]: collectedType,
            [DATE_PROPERTY_START_DATE]: '',
            [DATE_PROPERTY_END_DATE]: '',
          });
        }

        return dates;
      },
    },
    getDataLicenseLink() {
      if (!this.dataLicenseId) {
        return 'Please select a data license above to view link for more detailed information.';
      }

      const currentLicense = this.getLicenseById(this.dataLicenseId);

      return currentLicense?.link || 'Data license information unavailable.';
    },
    getDataLicenseSummary() {
      if (!this.dataLicenseId) {
        return 'Please select a data license above to view data license summary.';
      }

      const currentLicense = this.getLicenseById(this.dataLicenseId);

      return this.markdownText(currentLicense?.summary) || 'Data summary information unavailable.';
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_DATA_INFO);
    },
  },
  methods: {
    clearPreviews() {
      this.previewDates = [];
    },
    getIsoDate(index, property) {
      if (this.isoDates?.length > 0) {
        return this.isoDates[index][property] || null;
      }

      return null;
    },
    getLicenseById(id) {
      if (!id) {
        return null;
      }

      const dataLicense = this.dataLicenses.filter(x => x.id === id)[0];

      return dataLicense || null;
    },
    dataLicenseLinkExists() {
      const currentLicense = this.getLicenseById(this.dataLicenseId);
      if (!currentLicense) {
        return false;
      }

      return currentLicense.link || false;
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

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_INFO,
        data: newDataInfo,
      });
    },
    setDataInfo(property, value) {

      const newDataInfo = {
        ...this.$props,
        [property]: value,
      };

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_INFO,
        data: newDataInfo,
      });
    },
    changeLicense(value) {
      const property = 'dataLicenseId';

      if (isFieldValid(property, value, this.validations, this.validationErrors)) {
        this.setDataLicenseInfo(value);
      }
    },
    dateChangedTextField(index, property, value) {
      const dateValue = this.formatToCKANDate(value);
      this.dateChanged(index, property, dateValue);
    },
    dateChanged(index, property, value) {
      // Update indexed object in array, with updated dates

      const localCopy = [...this.datesField];
      const newDates = this.updateDatesArray(localCopy, index, property, value);

      this.previewDates = newDates;

      this.setDataInfo('dates', newDates);

/*
      const errorArray = this.validationErrors.dates;

      if (isArrayContentValid(newDates, 'dates', index, property, this.validations, errorArray)) {
        console.log('valid');
        this.setDataInfo('dates', newDates);
      }
*/

    },
    updateDatesArray(array, index, property, value) {

      const currentEntry = array[index];

      array[index] = {
        ...currentEntry,
        [property]: value,
      };

      const cleanCopy = [];

      for (let i = 0; i < array.length; i++) {
        const entry = array[i];
        if (!!entry[DATE_PROPERTY_START_DATE]
            || !!entry[DATE_PROPERTY_END_DATE]) {
          cleanCopy.push(entry);
        }
      }

      return cleanCopy;
    },
    clearDate(index, property) {
      this.dateChanged(index, property, '');
    },
  },
  components: {
    BaseStartEndDate,
    BaseStatusLabelView,
  },
  data: () => ({
    validationErrors: {
      dataLicense: null,
      dates: [
        {
          dateType: null,
          [DATE_PROPERTY_START_DATE]: null,
          [DATE_PROPERTY_END_DATE]: null,
        },
        {
          dateType: null,
          [DATE_PROPERTY_START_DATE]: null,
          [DATE_PROPERTY_END_DATE]: null,
        },
      ],
    },
    labels: {
      cardTitle: 'Additional Information about the Resources',
      instructions: 'Select a date range for the collection and / or the creation of your research data.' +
          ' This helps researcher better to categorize your data. ' +
          ' (Dates are in <b>"DD-MM-YYYY"</b> format).',
      instructionsCollection:
        '"Collection Date" should be used for data collected from the field.',
      instructionsCreation:
        '"Creation Date" should be used for data created from models or other sources.',
      dateType: 'Date Type',
      instructionsLicense: 'Select a data license which reflects the terms of usage of your research data.',
      creationDate: 'Creation Date',
      collectionDate: 'Collection Date',
      dataLicense: 'Click here to select a data license',
      dataLicenseSummary: 'Click here to view Data License Summary',
      dataLicenseEmail:
        'Link for more detailed information about selected Data License:',
    },
    startDateProperty: DATE_PROPERTY_START_DATE,
    endDateProperty: DATE_PROPERTY_END_DATE,
    previewDates: [],
    dataLicenses: [
      {
        id: 'odc-odbl',
        title: 'ODbL with Database Contents License (DbCL)',
        summary:
          'This is a human-readable summary of the ODbL 1.0 license. Please see the disclaimer below.\n' +
          '\n' +
          'You are free:\n' +
          '\n' +
          '-*To share*: To copy, distribute and use the database.\n' +
          '\n' +
          '-*To create*: To produce works from the database.\n' +
          '\n' +
          '-*To adapt*: To modify, transform and build upon the database.\n' +
          '\n' +
          'As long as you:\n' +
          '\n' +
          '*-Attribute*: You must attribute any public use of the database, or works produced from the database, in the manner specified in the ODbL. For any use or redistribution of the database, or works produced from it, you must make clear to others the license of the database and keep intact any notices on the original database.\n' +
          '\n' +
          '*-Share-Alike*: If you publicly use any adapted version of this database, or works produced from an adapted database, you must also offer that adapted database under the ODbL.\n' +
          '\n' +
          '-*Keep open*: If you redistribute the database, or an adapted version of it, then you may use technological measures that restrict the work (such as DRM) as long as you also redistribute a version without such measures.\n' +
          '\n' +
          '**Disclaimer**\n' +
          '\n' +
          'This is not a license. It is simply a handy reference for understanding the ODbL 1.0 — it is a human-readable expression of some of its key terms. This document has no legal value, and its contents do not appear in the actual license. Read the full ODbL 1.0 license text (see link below) for the exact terms that apply.',
        link: 'https://opendatacommons.org/licenses/odbl/1-0/',
      },
      {
        id: 'cc-by-sa',
        title: 'Creative Commons Attribution Share-Alike (CC-BY-SA)',
        summary:
          'This is a human-readable summary of (and not a substitute for) the license.\n' +
          '\n' +
          '**You are free to:**\n' +
          '\n' +
          '*Share*: copy and redistribute the material in any medium or format\n' +
          '\n' +
          '*Adapt*: remix, transform, and build upon the material for any purpose, even commercially.\n' +
          '\n' +
          'The licensor cannot revoke these freedoms as long as you follow the license terms.\n' +
          '\n' +
          '**Under the following terms:**\n' +
          '\n' +
          '*Attribution*: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.\n' +
          '\n' +
          '*ShareAlike*: If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.\n' +
          '\n' +
          '*No additional restrictions*: You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.\n' +
          '\n' +
          '**Notices:**\n' +
          '\n' +
          'You do not have to comply with the license for elements of the material in the public domain or where your use is permitted by an applicable exception or limitation.\n' +
          '\n' +
          'No warranties are given. The license may not give you all of the permissions necessary for your intended use. For example, other rights such as publicity, privacy, or moral rights may limit how you use the material.',
        link: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode',
      },
      {
        id: 'CC0-1.0',
        title: 'Creative Commons Zero - No Rights Reserved (CC0 1.0)',
        summary:
          'This is a human-readable summary of (and not a substitute for) the license.\n' +
          '\n' +
          '**No Copyright**\n' +
          '\n' +
          'The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law.\n' +
          '\n' +
          'You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission. See Other Information below.\n' +
          '\n' +
          '**Other Information**\n' +
          '\n' +
          '- In no way are the patent or trademark rights of any person affected by CC0, nor are the rights that other persons may have in the work or in how the work is used, such as publicity or privacy rights.\n' +
          '\n' +
          '- Unless expressly stated otherwise, the person who associated a work with this deed makes no warranties about the work, and disclaims liability for all uses of the work, to the fullest extent permitted by applicable law.\n' +
          '\n' +
          '- When using or citing the work, you should not imply endorsement by the author or the affirmer.\n',
        link: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode',
      },
      {
        id: 'wsl-data',
        title: 'WSL Data Policy',
        summary:
          'The WSL Data Policy kindly asks data users to attribute and precludes data redistribution unless otherwise agreed with data originators.\n' +
          '\n' +
          'Users may not share WSL research data or place them in data repositories that are accessible to third parties without the prior consent of the WSL data producers. \n' +
          '\n' +
          'Exclusive rights to reuse or publish WSL research data may not be transferred to commercial publishers or their agents.\n' +
          '\n' +
          'WSL reserves the right to use its research data itself or make it accessible to third parties for reuse.\n',
        link: 'https://www.envidat.ch/#/about/policies',
      },
    ],
  }),
};
</script>

<style scoped>
.heightAndScroll {
  max-height: 160px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
}
</style>
