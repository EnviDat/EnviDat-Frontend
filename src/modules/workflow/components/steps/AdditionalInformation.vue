<template>
  <v-container id="EditAdditionalInformation" fluid class="pa-4">
    <!-- Title box -->
    <v-row class="mb-0">
      <v-col class="text-h5 font-weight-bold" cols="12">
        {{ labels.title }}
      </v-col>
      <!-- <v-col cols="12" class="text-body-1">
        {{ labels.instructions }}
      </v-col> -->
    </v-row>

    <!-- Info Banner -->
    <v-row>
      <v-col class="mb-5 pt-0 pb-0">
        <v-alert type="info" closable :icon="false" class="rounded-lg info-banner">
          <v-alert-title class="mb-2">Information</v-alert-title>

          <p>
            This section includes licensing and funding details that are essential for transparency, reuse, and
            compliance with data sharing policies.
          </p>

          <p><strong>Tips:</strong></p>
          <ol>
            <li>
              - Provide accurate <strong>funding information</strong> by naming the institution and including the grant
              number and a link, if available.
            </li>
            <li>
              - Selecting the correct <strong>data license</strong> is crucial. It defines how others can use, share, or
              build upon your dataset.
            </li>
            <li>
              - If you're unsure which license to choose,
              <strong>Creative Commons Attribution (CC-BY 4.0)</strong> is a widely accepted standard for open data.
            </li>
            <li>
              - Make sure you have the rights to apply the selected license, especially if your dataset includes content
              from third parties.
            </li>
          </ol>

          <p class="mt-2">
            For more details about CC-BY 4.0, visit
            <a href="https://creativecommons.org/licenses/by/4.0/legalcode" target="_blank" rel="noopener">
              the full legal code </a
            >.
          </p>
        </v-alert>
      </v-col>
    </v-row>

    <!-- <v-col v-if="message" cols="4" class="pl-16">
          <BaseStatusLabelView
            status="check"
            statusColor="success"
            :statusText="message"
            :expandedText="messageDetails"
          />
        </v-col>
        <v-col v-if="error" cols="4" class="pl-16">
          <BaseStatusLabelView
            status="error"
            statusColor="error"
            :statusText="error"
            :expandedText="errorDetails"
          />
        </v-col> -->
    <v-row class="mb-5">
      <v-col>
        <div class="font-weight-bold">{{ labels.cardTitle }}</div>
        <div class="text-caption">
          {{ labels.fundingInformation }}
        </div>
      </v-col>
    </v-row>

    <v-row
      data-field="funders"
      v-for="(item, index) in previewFundersWithEmpty"
      :key="index"
      :class="index === 0 ? 'mt-2' : 'py-0'"
      no-gutters
    >
      <v-col cols="12">
        <v-row>
          <v-col cols="4" class="pr-2">
            <v-text-field
              :label="labels.institution"
              :model-value="item.institution"
              :readonly="isReadOnly('institution')"
              :hint="readOnlyHint('institution')"
              persistent-hint
              @keyup.enter="onKeyUp"
              @change="changeInstitution(index, 'institution', $event.target.value)"
            />
          </v-col>

          <v-col cols="3" class="px-2">
            <v-text-field
              :label="labels.grantNumber"
              :model-value="item.grantNumber"
              :readonly="isReadOnly('grantNumber')"
              :hint="readOnlyHint('grantNumber')"
              persistent-hint
              @keyup="onKeyUp"
              @change="changeInstitution(index, 'grantNumber', $event.target.value)"
            />
          </v-col>

          <v-col class="flex-grow-1 pl-2">
            <v-text-field
              :label="labels.institutionUrl"
              :model-value="item.institutionUrl"
              :readonly="isReadOnly('institutionUrl')"
              persistent-hint
              :hint="readOnlyHint('institutionUrl')"
              @keyup="onKeyUp"
              @change="changeInstitution(index, 'institutionUrl', $event.target.value)"
            />
          </v-col>

          <v-col class="flex-grow-0 px-1">
            <BaseIconButton
              :icon="mdiMinusCircleOutline"
              icon-color="red"
              :disabled="index === previewFunders.length - 1"
              @clicked="deleteFundersEntry(index)"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row v-if="validationErrors.funders != null">
      <v-col>
        <v-alert type="error">
          {{ validationErrors.funders }}
        </v-alert>
      </v-col>
    </v-row>

    <v-row class="mb-5">
      <v-col>
        <div class="font-weight-bold">{{ labelOrg.cardTitle }}</div>
        <div class="text-caption">
          {{ labelOrg.orgInformation }}
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-row>
          <Organization :showTitle="false" v-bind="editOrganizationProps" @save="catchOrgChange" />
        </v-row>
      </v-col>
    </v-row>

    <v-col v-if="validationErrors.organizationId != null" cols="12">
      <v-alert type="error">
        {{ validationErrors.organizationId }}
      </v-alert>
    </v-col>

    <v-row>
      <v-col cols="12">
        <v-row class="mb-5">
          <v-col>
            <div class="font-weight-bold">{{ labelsLicense.cardTitle }}</div>
            <div class="text-caption" v-html="labelsLicense.instructionsLicense"></div>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-select
              data-field="dataLicenseId"
              v-model="selectedLicenseObj"
              :items="activeLicenses"
              item-title="title"
              return-object
              :label="labelsLicense.dataLicense"
              :readonly="isReadOnly('license')"
              persistent-hint
              :hint="readOnlyHint('license')"
              :prepend-icon="mdiShieldSearch"
              :menu-icon="mdiArrowDownDropCircleOutline"
              @update:model-value="changeLicense()"
            />
          </v-col>

          <v-col v-if="validationErrors.dataLicenseId != null" cols="12">
            <v-alert type="error">
              {{ validationErrors.dataLicenseId }}
            </v-alert>
          </v-col>

          <v-col cols="12">
            <v-expansion-panels v-model="defaultOpenPanels">
              <v-expansion-panel :title="dataSummaryClickInfo">
                <v-expansion-panel-text>
                  <div v-html="getDataLicenseSummary" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>

        <v-col cols="12" class="text-body-2 mt-5">
          <div>{{ labelsLicense.dataLicenseUrl }}</div>
          <a v-if="currentDataLicense?.link" :href="currentDataLicense.link" target="_blank">{{
            currentDataLicense.link
          }}</a>
        </v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Organization from '@/modules/workflow/components/steps/Organization.vue';
import { mdiMinusCircleOutline, mdiArrowDownDropCircleOutline, mdiShieldSearch } from '@mdi/js';

import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
import { getAvailableLicensesForEditing, dataLicenses } from '@/factories/dataLicense';
import { renderMarkdown } from '@/factories/stringFactory.js';

import { isReadOnlyField, getReadOnlyHint } from '@/modules/workflow/utils/useReadonly';

import { useOrganizationsStore } from '@/modules/organizations/store/organizationsStorePinia';

export default {
  name: 'EditMetadataHeader',
  setup() {
    const orgStore = useOrganizationsStore();
    return { orgStore };
  },
  props: {
    funders: Array,
    dataLicenseId: String,
    loading: Boolean,
    message: String,
    messageDetails: String,
    error: String,
    errorDetails: String,
    readOnlyFields: Array,
    readOnlyExplanation: String,
    validationErrors: { type: Object, default: () => ({}) },
    organizationId: { type: String, default: undefined },
    organizationName: { type: String, default: undefined },
    /* Can be either a single organization object or an array; we normalize it. */
    organization: { type: [Object, Array], default: () => [] },
  },

  computed: {
    activeLicenses() {
      return getAvailableLicensesForEditing();
    },
    currentDataLicense() {
      return this.selectedLicenseObj;
    },
    dataSummaryClickInfo() {
      return this.currentDataLicense ? `Show a summary of ${this.currentDataLicense.title}` : 'Show a summary';
    },
    getDataLicenseSummary() {
      if (!this.currentDataLicense) {
        return 'Please select a data license above to view data license summary.';
      }

      return renderMarkdown(this.currentDataLicense.summary) || 'Data summary information unavailable';
    },
    previewFundersWithEmpty() {
      const last = this.previewFunders[this.previewFunders.length - 1] || {};
      const isEmpty = Object.values(last).every((v) => !v);
      return isEmpty ? this.previewFunders : [...this.previewFunders, { ...this.emptyEntry }];
    },
    editOrganizationProps() {
      return {
        organizationId: this.organizationId,
        organizationName: this.organizationName,
        userOrganizations: this.userOrganizationsList,
        readOnlyFields: this.isReadOnly('organizationId'),
        readOnlyExplanation: this.readOnlyHint('organizationId'),
        flat: true,
      };
    },

    selectedOrganizationId() {
      if (this.organizationId) return this.organizationId;
      const list = this.userOrganizationsList;
      return list.length === 1 ? list[0].id : undefined;
    },

    userOrganizationsList() {
      const storeList = this.orgStore?.userOrganizations;
      if (Array.isArray(storeList) && storeList.length > 0) {
        return storeList;
      }
      return [];
    },
  },

  methods: {
    // isFieldReadOnly,
    // readOnlyHint,
    catchOrgChange(updatedOrg) {
      this.newDatasetInfo.organizationName = updatedOrg.name;
      this.newDatasetInfo.organizationId = updatedOrg.id;
      this.$emit('save', this.newDatasetInfo);
    },
    isReadOnly(dateProperty) {
      return isReadOnlyField(dateProperty);
    },
    readOnlyHint(dateProperty) {
      return getReadOnlyHint(dateProperty);
    },

    deleteFundersEntry(i) {
      this.previewFunders.splice(i, 1);
      this.newDatasetInfo.funders = [...this.previewFunders];
      this.$emit('save', this.newDatasetInfo);
    },

    onKeyUp(keyboardEvent) {
      if (keyboardEvent.key === 'Enter') {
        keyboardEvent.target.blur();
      }
    },

    changeInstitution(idx, prop, val) {
      this.previewFunders[idx][prop] = val;

      const isLast = idx === this.previewFunders.length - 1;
      const rowFilled = Object.values(this.previewFunders[idx]).some((v) => v && v.toString().trim() !== '');

      // add the row only the UI
      if (isLast && rowFilled) {
        this.previewFunders.push({ ...this.emptyEntry });
      }

      // clean the array
      const cleanedFunders = this.previewFunders.filter((f) =>
        Object.values(f).some((v) => v && v.toString().trim() !== ''),
      );

      this.newDatasetInfo.funders = cleanedFunders;
      this.$emit('save', this.newDatasetInfo);
    },

    changeLicense() {
      // this.newDatasetInfo.dataLicenseId = this.selectedLicenseObj?.id;

      const lic = this.selectedLicenseObj || null;
      this.newDatasetInfo.dataLicenseId = lic?.id || '';
      this.newDatasetInfo.dataLicenseTitle = lic?.title || '';
      this.newDatasetInfo.dataLicenseUrl = lic?.link || '';
      this.$emit('save', this.newDatasetInfo);
      //   const payload = {
      //     funders: this.previewFunders,
      //     dataLicenseId: this.selectedLicenseObj?.id || '',
      //   };
      //   this.$emit('validate', payload);
    },
  },

  data() {
    return {
      mdiMinusCircleOutline,
      mdiArrowDownDropCircleOutline,
      mdiShieldSearch,
      emptyEntry: {
        institution: '',
        grantNumber: '',
        institutionUrl: '',
      },

      previewFunders: this.funders?.length
        ? JSON.parse(JSON.stringify(this.funders))
        : [{ institution: '', grantNumber: '', institutionUrl: '' }],

      selectedLicenseObj: dataLicenses.find((l) => l.id === this.dataLicenseId) || null,

      newDatasetInfo: {},

      labels: {
        title: 'Additional Information',
        instructions: 'License and funding information',
        cardTitle: 'Funding Information',
        fundingInformation: 'Provide information about who funded the research efforts.',
        institution: 'Institution',
        grantNumber: 'Grant Number',
        institutionUrl: 'Link',
      },
      labelOrg: {
        cardTitle: 'Organization',
        orgInformation: 'Select your organization. If you belong to only one, it will be selected by default.',
      },
      labelsLicense: {
        cardTitle: 'Data License',
        instructionsLicense: 'Select a data license reflecting usage terms.',
        dataLicense: 'Select data license',
        dataLicenseUrl: 'More info:',
      },
      defaultOpenPanels: [0],
    };
  },

  components: {
    BaseIconButton,
    Organization,
    // BaseStatusLabelView,
  },
};
</script>
