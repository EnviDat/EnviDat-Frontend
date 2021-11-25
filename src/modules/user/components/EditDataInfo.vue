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
          <div class="text-body-1">{{ labels.instructions }}</div>
        </v-col>
      </v-row>

      <v-row class="pt-2 heightAndScroll">
        <v-row
          v-for="(item, index) in datesField"
          :key="`${item}_${index}`"
          dense
        >
          <v-col class="pr-4 mr-10" cols="3">
            <v-text-field
              dense
              readonly
              outlined
              prepend-icon="category"
              :value="item.dateType"
              :error-messages="validationErrors.dates[index].dateType"
            />
          </v-col>

          <v-col class="pr-4 mr-10">
            <template>
              <v-menu>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :label="labels.dateStart"
                    dense
                    prepend-icon="date_range"
                    readonly
                    outlined
                    :value="item.dateStart"
                    v-on="on"
                    :error-messages="validationErrors.dates[index].dateStart"
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  @input="dateChanged(index, 'dateStart', $event)"
                  no-title
                ></v-date-picker>
              </v-menu>
            </template>
          </v-col>

          <v-col class="pr-4">
            <template>
              <v-menu>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :label="labels.dateEnd"
                    prepend-icon="date_range"
                    readonly
                    dense
                    outlined
                    :value="item.dateEnd"
                    v-on="on"
                    :error-messages="validationErrors.dates[index].dateEnd"
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  :min="reformatDate(item.dateStart)"
                  @input="dateChanged(index, 'dateEnd', $event)"
                  no-title
                ></v-date-picker>
              </v-menu>
            </template>
          </v-col>
        </v-row>
      </v-row>

      <v-row>
        <v-col>
          <div class="text-body-1">{{ labels.instructionsLicense }}</div>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col>
          <v-select
            :items="dataLicenses"
            item-value="id"
            item-text="title"
            outlined
            :label="labels.dataLicense"
            required
            prepend-icon="data_usage"
            append-icon="arrow_drop_down"
            :value="selectedLicence"
            @input="notifyChange('dataLicenseId', $event)"
            :error-messages="validationErrors.dataLicense"
          />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col>
          <v-expansion-panels focusable>
            <v-expansion-panel>
              <v-expansion-panel-header expand-icon="arrow_drop_down">{{
                this.labels.dataLicenseSummary
              }}</v-expansion-panel-header>
              <!--              <v-expansion-panel-content>{{ this.getDataLicenseSummary }}</v-expansion-panel-content>-->
              <v-expansion-panel-content
                ><div v-html="getDataLicenseSummary"
              /></v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div v-if="!this.selectedLicence" class="text-body-3">
            {{ this.getDataLicenseLink }}
          </div>
          <div
            v-if="this.selectedLicence && this.dataLicenseLinkExists()"
            class="text-body-3"
          >
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
 * @author Rebecca Kurup Buchholz
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-11-08
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {
  EDITMETADATA_DATA_INFO,
  EDITMETADATA_OBJECT_UPDATE,
  eventBus,
} from '@/factories/eventBus';
// eslint-disable-next-line import/no-cycle
import {
  getValidationMetadataEditingObject,
  isFieldValid,
  isArrayValid,
} from '@/factories/userEditingFactory';

import { renderMarkdown } from '@/factories/stringFactory';
import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView';

export default {
  name: 'EditDataInfo',
  props: {
    dataLicenseId: {
      type: String,
      default: '',
    },
    dates: {
      type: Array,
      default: () => [
        {
          dateType: '',
          dateStart: '',
          dateEnd: '',
        },
      ],
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
  },
  computed: {
    selectedLicence: {
      get() {

        if (this.dataLicenseId === '') {
          return ''
        }

        const dataLicense = this.dataLicenses.filter(x => x.id === this.dataLicenseId)[0]
        return {
          id: dataLicense.id,
          title: dataLicense.title,
        }
      },
    },
    datesField: {
      get() {
        console.log('current dates :', this.dates)
        return this.dates;
      },
    },
    getDataLicenseLink() {
      const currentLicense = this.dataLicenseId;

      if (currentLicense === '') {
        return 'Please select a data license above to view link for more detailed information.';
      }

      for (let i = 0; i < this.dataLicenses.length; i++) {
        if (currentLicense === this.dataLicenses[i].id) {
          return this.dataLicenses[i].link;
        }
      }

      return 'Data license information unavailable.';
    },
    getDataLicenseSummary() {
      const currentLicense = this.dataLicenseId;

      if (currentLicense === '') {
        return 'Please select a data license above to view data license summary.';
      }

      for (let i = 0; i < this.dataLicenses.length; i++) {
        if (currentLicense === this.dataLicenses[i].id) {
          return this.markdownText(this.dataLicenses[i].summary);
        }
      }

      return 'Data summary information unavailable.';
    },
    validations() {
      return getValidationMetadataEditingObject(EDITMETADATA_DATA_INFO);
    },
  },
  methods: {
    dataLicenseLinkExists() {
      const currentLicense = this.dataLicenseId;

      for (let i = 0; i < this.dataLicenses.length; i++) {
        if (
          currentLicense === this.dataLicenses[i].id &&
          'link' in this.dataLicenses[i]
        ) {
          return true;
        }
      }
      return false;
    },
    markdownText(mdText) {
      return renderMarkdown(mdText);
    },
    setDataInfo(property, value) {

      const newDataInfo = {
        ...this.$props,
        [property]: value,
      };
      console.log('new data: ', newDataInfo)

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_INFO,
        data: newDataInfo,
      });
    },
    notifyChange(property, value) {

      if (isFieldValid(property, value, this.validations, this.validationErrors)) {
        this.setDataInfo(property, value);
      }
    },
    dateChanged(index, property, value) {
      // Update indexed object in array, with updated dates

      const newDates = this.updateDatesArray(this.datesField, index, property, value);
      const errorArray = this.validationErrors.dates;
      console.log('validation errors: ', this.validationErrors)
      if (isArrayValid(newDates, 'dates', index, property, this.validations, errorArray)) {
        this.setDataInfo('dates', newDates);
      }

    },
    updateDatesArray(array, index, property, value) {

      // Format dates to CKAN format "MM.DD.YYYY"
      if (property === 'dateStart' || property === 'dateEnd') {
        value = this.formatDate(value);
      }

      const currentEntry = array[index];
      array[index] = {
        ...currentEntry,
        [property]: value,
      };

      return array
    },
    formatDate(date) {
      // Change Vuetify date format "YYYY-MM-DD" to CKAN date format "DD.MM.YYYY"
      if (!date) {
        return null;
      }
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`;
    },
    reformatDate(date) {
      // Change CKAN date format "DD.MM.YYYY" to Vuetify date format "YYYY-MM-DD"
      if (!date) {
        return null;
      }
      const [day, month, year] = date.split('.');
      return `${year}-${month}-${day}`;
    },
  },
  components: {
    BaseStatusLabelView,
  },
  data: () => ({
    validationErrors: {
      dataLicense: null,
      dates: [{
        dateType: null,
        dateStart: null,
        dateEnd: null,
      }],
    },
    labels: {
      cardTitle: 'Additional Information about the Resources',
      instructions:
        'Please select dates for collection and/or creation dates. Dates are in "MM.DD.YYYY" format.',
      instructionsCollection:
        '"Collection Date" should be used for data collected from the field.',
      instructionsCreation:
        '"Creation Date" should be used for data created from models or other sources.',
      dateType: 'Date Type',
      dateStart: 'Start Date',
      dateEnd: 'End Date',
      instructionsLicense:
        'Please select a data license from the dropdown list.',
      creationDate: 'Creation Date',
      collectionDate: 'Collection Date',
      dataLicense: 'Click here to select a data license',
      dataLicenseSummary: 'Click here to view Data License Summary',
      dataLicenseEmail:
        'Link for more detailed information about selected Data License:',
    },
    dateTypes: ['Collection Date', 'Creation Date'],
    maxYears: 30,
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
  max-height: 120px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
}
</style>
