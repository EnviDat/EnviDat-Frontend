<template>

  <v-card id="EditDataInfo" class="pa-4">

    <v-container fluid
                 class="pa-0 fill-height" >

      <v-row>

        <v-col cols="12">
          <div class="text-h5">{{ labels.cardTitle }}</div>
        </v-col>

      </v-row>


      <v-row>

        <v-col>
          <div class="text-body-1">{{ labels.instructions }}</div>
        </v-col>

      </v-row>


      <v-row dense >

        <v-col>
          <div class="text-body-2">{{ labels.instructionsCollection }}</div>
        </v-col>

      </v-row>


      <v-row dense>

        <v-col class="pr-4">
          <v-text-field
                    outlined
                    dense
                    :label="labels.dateType"
                    readonly
                    prepend-icon="category"
                    :value="labels.collectionDate"
          />
        </v-col>

        <v-col class="pr-4">
          <template>
              <v-menu>
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :label="labels.startDate"
                    dense
                    prepend-icon="date_range"
                    readonly
                    outlined
                    :value="collectionDateStartField"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="en-in"
                  @input="setDataInfo('collectionDateStart', $event)"
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
                  :label="labels.endDate"
                  prepend-icon="date_range"
                  readonly
                  dense
                  outlined
                  :value="collectionDateEndField"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                locale="en-in"
                :min="collectionDateStartField"
                @input="setDataInfo('collectionDateEnd', $event)"
                no-title
              ></v-date-picker>
            </v-menu>
          </template>
        </v-col>

      </v-row>


      <v-row dense >

        <v-col>
          <div class="text-body-2">{{ labels.instructionsCreation }}</div>
        </v-col>

      </v-row>


      <v-row dense>

        <v-col class="pr-4">
          <v-text-field
            outlined
            dense
            :label="labels.dateType"
            readonly
            prepend-icon="category"
            :value="labels.creationDate"
          />
        </v-col>

        <v-col class="pr-4">
          <template>
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-text-field
                  :label="labels.startDate"
                  prepend-icon="date_range"
                  readonly
                  dense
                  outlined
                  :value="creationDateStartField"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                locale="en-in"
                @input="setDataInfo('creationDateStart', $event)"
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
                  :label="labels.endDate"
                  prepend-icon="date_range"
                  readonly
                  dense
                  outlined
                  :value="creationDateEndField"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                locale="en-in"
                :min="creationDateStartField"
                @input="setDataInfo('creationDateEnd', $event)"
                no-title
              ></v-date-picker>
            </v-menu>
          </template>
        </v-col>

      </v-row>


      <v-row dense>

        <v-col class="pr-4">
          <v-text-field
            outlined
            :label="labels.dateType"
            readonly
            dense
            prepend-icon="category"
            :value="labels.publicationDate"
          />
        </v-col>

        <v-col class="pr-4">
          <template>
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-text-field
                  :label="labels.startDate"
                  prepend-icon="date_range"
                  readonly
                  dense
                  outlined
                  :value="publicationDateStartField"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                locale="en-in"
                disabled
                @input="setDataInfo('publicationDateStart', $event)"
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
                  :label="labels.endDate"
                  prepend-icon="date_range"
                  readonly
                  dense
                  outlined
                  :value="publicationDateEndField"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                locale="en-in"
                disabled
                :min="publicationDateStartField"
                @input="setDataInfo('publicationDateEnd', $event)"
                no-title
              ></v-date-picker>
            </v-menu>
          </template>
        </v-col>

      </v-row>


      <v-row>

        <v-col>
          <div class="text-body-1">{{ labels.instructionsLicense }}</div>
        </v-col>

      </v-row>


      <v-row dense>

        <v-col >
          <v-select :items="dataLicensesNameList"
                    outlined
                    :label="labels.dataLicense"
                    required
                    prepend-icon="data_usage"
                    append-icon="arrow_drop_down"
                    :value="dataLicenseField"
                    @input="setDataInfo('dataLicense', $event)"
          />
        </v-col>

      </v-row>

      <v-row dense>

        <v-col >

          <v-expansion-panels focusable>

            <v-expansion-panel>
              <v-expansion-panel-header expand-icon="arrow_drop_down">{{ this.labels.dataLicenseSummary }}</v-expansion-panel-header>
<!--              <v-expansion-panel-content>{{ this.getDataLicenseSummary }}</v-expansion-panel-content>-->
              <v-expansion-panel-content><div v-html="getDataLicenseSummary" /></v-expansion-panel-content>
            </v-expansion-panel>

          </v-expansion-panels>

        </v-col>

      </v-row>


      <v-row>

        <v-col >
          <div v-if="!this.dataLicense" class="text-body-3">{{ this.getDataLicenseLink }}</div>
          <div v-if="this.dataLicense && this.dataLicenseLinkExists()" class="text-body-3">{{ this.labels.dataLicenseEmail }}</div>
          <div v-if="this.dataLicense && this.dataLicenseLinkExists()" class="text-body-3"><a v-bind:href="this.getDataLicenseLink" target="_blank">{{ this.getDataLicenseLink }}</a></div>
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
 * @summary Shows Additional Information (creation, collection and publication dates, data license and summary)
 * @author Rebecca Kurup Buchholz
 *
 * Created        : 2021-08-31
 * Last modified  : 2021-10-12
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import {EDITMETADATA_DATA_INFO, EDITMETADATA_OBJECT_UPDATE, eventBus} from '@/factories/eventBus';
import {renderMarkdown} from '@/factories/stringFactory';


export default {
  name: 'EditDataInfo',
  props: {
    collectionDateStart: {
      type: String,
      default: () => '',
    },
    collectionDateEnd: {
      type: String,
      default: () => '',
    },
    creationDateStart: {
      type: String,
      default: () => '',
    },
    creationDateEnd: {
      type: String,
      default: () => '',
    },
    publicationDateStart: {
      type: String,
      default: () => '',
    },
    publicationDateEnd: {
      type: String,
      default: () => '',
    },
    dataLicense: {
      type: String,
      default: () => '',
    },
  },
  computed: {
    collectionDateStartField: {
      get() {
        return this.collectionDateStart.slice();
      }
    },
    collectionDateEndField: {
      get() {
        return this.collectionDateEnd.slice();
      }
    },
    creationDateStartField: {
      get() {
        return this.creationDateStart.slice();
      }
    },
    creationDateEndField: {
      get() {
        return this.creationDateEnd.slice();
      }
    },
    publicationDateStartField: {
      get() {
        return this.publicationDateStart.slice();
      }
    },
    publicationDateEndField: {
      get() {
        return this.publicationDateEnd.slice();
      }
    },
    dataLicenseField: {
      get() {
        return this.dataLicense.slice();
      }
    },
    dataLicensesNameList() {
      return this.dataLicenses.map(element => element.name);
    },
    getDataLicenseLink() {

      const currentLicense = this.dataLicense;

      if (currentLicense === '') {
        return 'Please select a data license above to view link for more detailed information.';
      }

      for (let i = 0; i < this.dataLicenses.length; i++) {
        if (currentLicense === this.dataLicenses[i].name) {
          return this.dataLicenses[i].link;
        }
      }

      return 'Data license information unavailable.';

    },
    getDataLicenseSummary() {

      const currentLicense = this.dataLicense;

      if (currentLicense === '') {
        return 'Please select a data license above to view data license summary.';
      }

      for (let i = 0; i < this.dataLicenses.length; i++) {
        if (currentLicense === this.dataLicenses[i].name) {
          return this.markdownText(this.dataLicenses[i].summary);
        }
      }

      return 'Data summary information unavailable.';
    },
  },
  methods: {
    dataLicenseLinkExists() {

      const currentLicense = this.dataLicense;

      for (let i = 0; i < this.dataLicenses.length; i++) {
        if (currentLicense === this.dataLicenses[i].name && 'link' in this.dataLicenses[i]) {
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

      eventBus.$emit(EDITMETADATA_OBJECT_UPDATE, {
        object: EDITMETADATA_DATA_INFO,
        data: newDataInfo,
      });
    },
  },
  components: {
  },
  data: () => ({
    labels: {
      cardTitle: 'Additional Information about the Resources',
      instructions: 'Please select dates for collection and/or creation dates.',
      instructionsCollection: '"Collection Date" should be used for data collected from the field.',
      instructionsCreation: '"Creation Date" should be used for data created from models or other sources.',
      dateType: 'Date Type',
      startDate: 'Start Date',
      endDate: 'End Date',
      instructionsLicense: 'Please select a data license from the dropdown list.',
      creationDate: 'Creation Date',
      collectionDate: 'Collection Date',
      publicationDate: 'Publication Date',
      dataLicense: 'Click here to select a data license',
      dataLicenseSummary: 'Click here to view Data License Summary',
      dataLicenseEmail: 'Link for more detailed information about selected Data License:',
    },
    dateTypes: ['Collection Date', 'Creation Date'],
    maxYears: 30,
    dataLicenses: [
      {
        name: 'Open Data Commons Open Database License (ODbL)',
        summary: 'This is a human-readable summary of the ODbL 1.0 license. Please see the disclaimer below.\n'
          + '\n'
          + 'You are free:\n'
          + '\n'
          + '-*To share*: To copy, distribute and use the database.\n'
          + '\n'
          + '-*To create*: To produce works from the database.\n'
          + '\n'
          + '-*To adapt*: To modify, transform and build upon the database.\n'
          + '\n'
          + 'As long as you:\n'
          + '\n'
          + '*-Attribute*: You must attribute any public use of the database, or works produced from the database, in the manner specified in the ODbL. For any use or redistribution of the database, or works produced from it, you must make clear to others the license of the database and keep intact any notices on the original database.\n'
          + '\n'
          + '*-Share-Alike*: If you publicly use any adapted version of this database, or works produced from an adapted database, you must also offer that adapted database under the ODbL.\n'
          + '\n'
          + '-*Keep open*: If you redistribute the database, or an adapted version of it, then you may use technological measures that restrict the work (such as DRM) as long as you also redistribute a version without such measures.\n'
          + '\n'
          + '**Disclaimer**\n'
          + '\n'
          + 'This is not a license. It is simply a handy reference for understanding the ODbL 1.0 — it is a human-readable expression of some of its key terms. This document has no legal value, and its contents do not appear in the actual license. Read the full ODbL 1.0 license text (see link below) for the exact terms that apply.',
        link: 'https://opendatacommons.org/licenses/odbl/1-0/',
      },
      {
        name: 'WSL Data Policy',
        summary: 'The WSL Data Policy kindly asks data users to attribute and precludes data redistribution unless otherwise agreed with data originators.\n'
          + '\n'
          + 'Users may not share WSL research data or place them in data repositories that are accessible to third parties without the prior consent of the WSL data producers. \n'
          + '\n'
          + 'Exclusive rights to reuse or publish WSL research data may not be transferred to commercial publishers or their agents.\n'
          + '\n'
          + 'WSL reserves the right to use its research data itself or make it accessible to third parties for reuse.\n',
        link: 'https://www.envidat.ch/#/about/policies',
      },
      {
        name: 'Creative Commons Attribution Share-Alike (CC-BY-SA)',
        summary: 'This is a human-readable summary of (and not a substitute for) the license.\n'
          + '\n'
          + '**You are free to:**\n'
          + '\n'
          + '*Share*: copy and redistribute the material in any medium or format\n'
          + '\n'
          + '*Adapt*: remix, transform, and build upon the material for any purpose, even commercially.\n'
          + '\n'
          + 'The licensor cannot revoke these freedoms as long as you follow the license terms.\n'
          + '\n'
          + '**Under the following terms:**\n'
          + '\n'
          + '*Attribution*: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.\n'
          + '\n'
          + '*ShareAlike*: If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.\n'
          + '\n'
          + '*No additional restrictions*: You may not apply legal terms or technological measures that legally restrict others from doing anything the license permits.\n'
          + '\n'
          + '**Notices:**\n'
          + '\n'
          + 'You do not have to comply with the license for elements of the material in the public domain or where your use is permitted by an applicable exception or limitation.\n'
          + '\n'
          + 'No warranties are given. The license may not give you all of the permissions necessary for your intended use. For example, other rights such as publicity, privacy, or moral rights may limit how you use the material.',
        link: 'https://creativecommons.org/licenses/by-sa/4.0/legalcode',
      },
      {
        name: 'Creative Commons Universal - No Rights Reserved (CC0 1.0)',
        summary: 'This is a human-readable summary of (and not a substitute for) the license.\n'
          + '\n'
          + '**No Copyright**\n'
          + '\n'
          + 'The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law.\n'
          + '\n'
          + 'You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission. See Other Information below.\n'
          + '\n'
          + '**Other Information**\n'
          + '\n'
          + '- In no way are the patent or trademark rights of any person affected by CC0, nor are the rights that other persons may have in the work or in how the work is used, such as publicity or privacy rights.\n'
          + '\n'
          + '- Unless expressly stated otherwise, the person who associated a work with this deed makes no warranties about the work, and disclaims liability for all uses of the work, to the fullest extent permitted by applicable law.\n'
          + '\n'
          + '- When using or citing the work, you should not imply endorsement by the author or the affirmer.\n',
        link: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode',
      },
      {
        name: 'Other (specified in the description)',
        summary: 'Select Other in order to specify your own license in the description of the dataset.\n',
      },
    ],
  }),
};


</script>
