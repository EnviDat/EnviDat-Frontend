<template>
  <v-card id="EditAdditionalInformation" class="pa-0" elevation="0">
    <v-container fluid class="pa-4">
      <v-row>
        <v-col cols="8" class="text-h5">{{ labels.title }}</v-col>

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
      </v-row>

      <v-row no-gutters class="pt-4">
        <v-col cols="12" class="text-body-1">{{ labels.instructions }}</v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-alert type="info" closable :icon="false" class="rounded-lg">
            <v-alert-title>Information</v-alert-title>
            Lorem Ipsum
          </v-alert>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="text-h6">{{ labels.cardTitle }}</v-col>
        <v-col cols="12">{{ labels.fundingInformation }}</v-col>
      </v-row>

      <v-row
        v-for="(item, index) in previewFundersWithEmpty"
        :key="index"
        :class="index === 0 ? 'mt-2' : 'py-0'"
        no-gutters
      >
        <v-col cols="12">
          <v-row class="mt-5">
            {{ INSTITUTION }}
            <v-col cols="4" class="pr-2">
              <v-text-field
                :label="labels.institution"
                :model-value="item.institution"
                :readonly="isFieldReadOnly('institution')"
                :hint="readOnlyHint('institution')"
                @keyup.enter="onKeyUp"
                @change="
                  changeInstitution(index, 'institution', $event.target.value)
                "
              />
            </v-col>

            <v-col cols="3" class="px-2">
              <v-text-field
                :label="labels.grantNumber"
                :model-value="item.grantNumber"
                :readonly="isFieldReadOnly('grantNumber')"
                :hint="readOnlyHint('grantNumber')"
                @keyup="onKeyUp"
                @change="
                  changeInstitution(index, 'grantNumber', $event.target.value)
                "
              />
            </v-col>

            <v-col class="flex-grow-1 pl-2">
              <v-text-field
                :label="labels.institutionUrl"
                :model-value="item.institutionUrl"
                :readonly="isFieldReadOnly('institutionUrl')"
                :hint="readOnlyHint('institutionUrl')"
                @keyup="onKeyUp"
                @change="
                  changeInstitution(
                    index,
                    'institutionUrl',
                    $event.target.value,
                  )
                "
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

      <v-col v-if="validationErrors.funders != null">
        <div
          :style="{ color: '#FF847B', fontSize: '0.75rem' }"
          class="error--text text-caption mt-3"
        >
          {{ validationErrors.funders }}
        </div>
      </v-col>

      <v-row>
        <v-col cols="12">
          <v-row class="mt-5">
            <v-col cols="12" class="text-h6">{{
              labelsLicense.cardTitle
            }}</v-col>
            <v-col cols="12" v-html="labelsLicense.instructionsLicense" />
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-select
                v-model="selectedLicenseObj"
                :items="activeLicenses"
                item-text="title"
                return-object
                :label="labelsLicense.dataLicense"
                :readonly="isDataLicenseReadonly"
                hide-details
                persistent-hint
                :hint="dataLicenseReadonlyExplanation"
                :prepend-icon="mdiShieldSearch"
                :menu-icon="mdiArrowDownDropCircleOutline"
                @update:model-value="changeLicense($event)"
              />
            </v-col>
            <v-col v-if="validationErrors.dataLicenseId != null">
              <div
                :style="{ color: '#FF847B', fontSize: '0.75rem' }"
                class="error--text text-caption mt-3"
              >
                {{ validationErrors.dataLicenseId }}
              </div>
            </v-col>

            <v-col cols="12">
              <v-expansion-panels focusable>
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
            <a
              v-if="currentDataLicense?.link"
              :href="currentDataLicense.link"
              target="_blank"
              >{{ currentDataLicense.link }}</a
            >
          </v-col>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import {
  mdiMinusCircleOutline,
  mdiArrowDownDropCircleOutline,
  mdiShieldSearch,
} from '@mdi/js';
import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';
// import BaseStatusLabelView from '@/components/BaseElements/BaseStatusLabelView.vue';
import { isObjectEmpty } from '@/factories/userEditingFactory';

import { isFieldReadOnly, readOnlyHint } from '@/factories/globalMethods';
import {
  getAvailableLicensesForEditing,
  dataLicenses,
} from '@/factories/dataLicense';

export default {
  name: 'EditMetadataHeader',
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
  },

  computed: {
    activeLicenses() {
      return getAvailableLicensesForEditing();
    },
    currentDataLicense() {
      return this.selectedLicenseObj;
    },
    dataSummaryClickInfo() {
      return this.currentDataLicense
        ? `Show a summary of ${this.currentDataLicense.title}`
        : 'Show a summary';
    },
    getDataLicenseSummary() {
      return this.currentDataLicense?.summary || '';
    },
    previewFundersWithEmpty() {
      const last = this.previewFunders[this.previewFunders.length - 1] || {};
      const isEmpty = Object.values(last).every((v) => !v);
      return isEmpty
        ? this.previewFunders
        : [...this.previewFunders, { ...this.emptyEntry }];
    },
  },

  methods: {
    isFieldReadOnly,
    readOnlyHint,

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
      const rowFilled = Object.values(this.previewFunders[idx]).some(
        (v) => v && v.toString().trim() !== '',
      );

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
      this.newDatasetInfo.dataLicenseId = this.selectedLicenseObj?.id;

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

      selectedLicenseObj:
        dataLicenses.find((l) => l.id === this.dataLicenseId) || null,

      newDatasetInfo: {},

      labels: {
        title: 'Research Header Information',
        instructions: 'Header & funding information.',
        cardTitle: 'Funding Information',
        fundingInformation:
          'Provide information about who funded the research efforts.',
        institution: 'Institution',
        grantNumber: 'Grant Number',
        institutionUrl: 'Link',
      },
      labelsLicense: {
        cardTitle: 'Data License',
        instructionsLicense: 'Select a data license reflecting usage terms.',
        dataLicense: 'Select data license',
        dataLicenseUrl: 'More info:',
      },
    };
  },

  components: {
    BaseIconButton,
    // BaseStatusLabelView,
  },
};
</script>
