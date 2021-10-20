<template>

  <v-card id="EditDataInfo" class="pa-4">

    <v-container fluid
                 class="pa-0 fill-height" >

    <v-row>

        <v-col cols="12">
          <div class="text-h5">{{ labels.cardTitle }}</div>
        </v-col>

      </v-row>


      <v-row dense>

        <v-col class="pr-4">
          <v-select :items="yearsList"
                    outlined
                    :label="labels.creationDate"
                    required
                    prepend-icon="date_range"
                    append-icon="arrow_drop_down"
                    :value="addInfoFields.creationYear"
                    @input="notifyChange('creationYear', $event)"
          />
        </v-col>

        <v-col >
          <v-select :items="yearsList"
                    outlined
                    :label="labels.collectionDate"
                    required
                    prepend-icon="date_range"
                    append-icon="arrow_drop_down"
                    :value="addInfoFields.collectionYear"
                    @input="notifyChange('collectionYear', $event)"
          />
        </v-col>

      </v-row>


      <v-row dense>

        <v-col cols="6"
               class="pr-4">
          <v-select :items="yearsList"
                    outlined
                    :label="labels.publicationDate"
                    required
                    readonly
                    prepend-icon="date_range"
                    append-icon="arrow_drop_down"
                    :value="addInfoFields.publicationYear"
                    @input="notifyChange('publicationYear', $event)"
          />
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
                    :value="addInfoFields.dataLicense"
                    @input="notifyChange('dataLicense', $event)"
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

            <v-expansion-panel>
              <v-expansion-panel-header prepend-icon="data_usage" expand-icon="arrow_drop_down">{{ this.labels.dataLicenseEmail }}</v-expansion-panel-header>
              <v-expansion-panel-content v-if="!this.addInfoObj.dataLicense">{{ this.getDataLicenseLink }}</v-expansion-panel-content>
              <v-expansion-panel-content v-if="this.addInfoObj.dataLicense"><a v-bind:href="this.getDataLicenseLink" target="_blank">{{ this.getDataLicenseLink }}</a></v-expansion-panel-content>
            </v-expansion-panel>

          </v-expansion-panels>

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
import { EDITMETADATA_DATA_INFO, EDITMETADATA_OBJECT_UPDATE, eventBus } from '@/factories/eventBus';
import { renderMarkdown } from '@/factories/stringFactory';


export default {
  name: 'EditDataInfo',
  props: {
    addInfoObj: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    addInfoFields: {
      get() {
        let addInfoObject = { ...this.addInfoObj };

        if (Object.keys(addInfoObject).length === 0) {
          addInfoObject = {
            creationYear: '',
            collectionYear: '',
            publicationYear: '',
            dataLicense: '',
          };
        }

        return addInfoObject;
      },
    },
    yearsList() {

      const date = new Date();
      let year = date.getFullYear();
      const yearList = [];

      for (let i = 0; i < this.maxYears; i++) {
        yearList[i] = year.toString();
        year--;
      }

      return yearList;
    },
    dataLicensesNameList() {
      return this.dataLicenses.map(element => element.name);
    },
    getDataLicenseLink() {

      const currentLicense = this.addInfoObj.dataLicense;

      if (currentLicense === '') {
        return 'Please select a data license above to view link for more detailed information.';
      }

      for (let i = 0; i < this.dataLicenses.length; i++) {
        if (currentLicense === this.dataLicenses[i].name) {
          return this.dataLicenses[i].link;
          // return '<a v-bind:href="this.getDataLicenseLink" target="_blank">this.dataLicenses[i].link</a>';
        }
      }

      return 'Data license information unavailable.';

    },
    getDataLicenseSummary() {

      const currentLicense = this.addInfoObj.dataLicense;

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
    markdownText(mdText) {
      return renderMarkdown(mdText);
    },
    editEntry(addInfoObject, property, value) {
      addInfoObject[property] = value;
    },
    notifyChange(property, value) {

      const addInfoCopy = { ...this.addInfoObj };

      this.editEntry(addInfoCopy, property, value);

      this.setDataInfo('addInfoObj', addInfoCopy);

    },
    setDataInfo(property, value) {
      const newDataInfo = {
        ...this.$props,
        [property]: value,
      };
      // console.log(newDataInfo);
      // console.log(this.getDataLicenseSummary);
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
      creationDate: 'Creation Date',
      collectionDate: 'Collection Date',
      publicationDate: 'Publication Date',
      dataLicense: 'Click here to select a data license',
      dataLicenseSummary: 'Data License Summary',
      dataLicenseEmail: 'Link for more detailed information about Data License',
    },
    maxYears: 30,
    // TODO finish adding other dataLicense objects
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
        summary: 'TODO',
        link: 'TODO',
      },
    ],
  }),
};


</script>
