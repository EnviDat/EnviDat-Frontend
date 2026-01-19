<template>
  <v-card color="secondary" id="IntroductionCard" class="pa-0 theme--dark">
    <v-container fluid class="pa-4">
      <v-row no-gutters>
        <v-col class="text-h5">
          {{ welcomeTitle }}
        </v-col>
      </v-row>

      <v-row no-gutters class="pt-2">
        <v-col class="text-body-1 accentLink">
          <div v-html="introductionText"></div>
        </v-col>
      </v-row>

      <v-row no-gutters class="pt-2">
        <v-col>
          <v-row v-if="currentLocalDataset" no-gutters>
            <v-col cols="12" md="6" class="py-2"> Continue creating your dataset: </v-col>

            <v-col cols="12" md="6" class="py-2"> Clear your local dataset in creation: </v-col>

            <v-col cols="12" md="6" class="pl-1 pr-4">
              <MetadataCardLocal v-bind="currentLocalDataset" @clickedEvent="$emit('localCardClicked')" />
            </v-col>

            <v-col cols="12" md="6" style="display: inline-flex; justify-content: start">
              <BaseRectangleButton
                color="accent"
                marginClass="text-black"
                :button-text="'Delete your local dataset'"
                @clicked="$emit('clearButtonClicked', $event)"
              />
              <!-- <BaseIconButton
                :icon="mdiClose"
                color="error"
                icon-color="black"
                tooltip-text="Delete your local dataset"
                @clicked="$emit('clearButtonClicked', $event)"
              /> -->
            </v-col>
          </v-row>

          <v-row no-gutters class="pt-3" style="align-items: start">
            <v-col cols="12" md="6" class="pr-4">
              <v-row v-if="!currentLocalDataset" no-gutters class="pt-3" style="align-items: center">
                <v-col cols="auto" class="text-h6">
                  {{ createText }}
                </v-col>
              </v-row>
              <v-row v-if="!currentLocalDataset" no-gutters class="pt-2" style="align-items: center">
                <v-col cols="auto" class="text-body-2">
                  <div v-html="createSubtitleText"></div>
                </v-col>
              </v-row>
              <v-row v-if="!currentLocalDataset" no-gutters class="pt-3" style="align-items: center">
                <v-col cols="auto">
                  <BaseRectangleButton
                    color="accent"
                    marginClass="text-black"
                    :button-text="createButtonText"
                    :disabled="createClickCallback === null"
                    @clicked="createClickCallback ? createClickCallback() : ''"
                  />
                </v-col>
              </v-row>
            </v-col>

            <v-col cols="12" md="6" class="pl-md-4">
              <v-row no-gutters class="pt-3" style="align-items: center">
                <v-col cols="auto" class="text-h6"> {{ doiText }} </v-col>
              </v-row>
              <v-row no-gutters class="pt-2" style="align-items: center">
                <v-col cols="auto" class="text-body-2">
                  <div v-html="doiSubtitleText"></div>
                </v-col>
              </v-row>
              <v-row no-gutters class="pt-3" style="align-items: start">
                <v-col cols="8" class="pr-4 p-0">
                  <v-text-field
                    bg-color="white"
                    v-model="importDoiValue"
                    variant="solo"
                    label="Your DOI"
                  ></v-text-field>
                </v-col>
                <v-col cols="auto">
                  <BaseRectangleButton
                    color="accent"
                    marginClass="text-black"
                    :button-text="doiButtonText"
                    :disabled="importClickCallback === null || importDoiValue.length === 0"
                    @clicked="importClickCallback ? importClickCallback(importDoiValue) : ''"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row v-if="editingText" no-gutters class="pt-3" style="align-items: center">
            <v-col cols="7" class="text-body-1">
              {{ editingText }}
            </v-col>

            <v-col cols="5" class="pl-4">
              <BaseRectangleButton
                color="accent"
                marginClass="text-black"
                :button-text="editingButtonText"
                :disabled="editingClickCallback === null"
                @clicked="editingClickCallback ? editingClickCallback() : ''"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
/**
 * IntroductionCard is used to say hello in the users dashboard.
 *
 * @summary Introduction card for the dashboard
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2020-10-08 16:42:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import { mdiClose } from '@mdi/js';
import MetadataCardLocal from '@/components/Cards/MetadataCardLocal.vue';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
// import BaseIconButton from '@/components/BaseElements/BaseIconButton.vue';

export default {
  name: 'IntroductionCard',
  props: {
    title: {
      type: String,
      default: 'Welcome',
    },
    userName: String,
    introText: {
      type: String,
      default: '',
    },
    createClickCallback: {
      type: Function,
      default: null,
    },
    importClickCallback: {
      type: Function,
      default: null,
    },
    editingClickCallback: {
      type: Function,
      default: null,
    },
    editingDatasetName: {
      type: String,
      default: '',
    },
    feedbackText: {
      type: String,
      default: '',
    },
    oldDashboardUrl: {
      type: String,
      default: '',
    },
    currentLocalDataset: {
      type: Object,
      default: undefined,
    },
  },
  computed: {
    welcomeTitle() {
      return this.userName ? `${this.title} ${this.userName} to your Dashboard!` : `${this.title} to your Dashboard!`;
    },
    introductionText() {
      let text = this.introText || this.introTextFallback;
      text += this.ckanDashboardText;
      text += this.feedbackText;
      return text;
    },
    ckanDashboardText() {
      return this.oldDashboardUrl ? `<a href="${this.oldDashboardUrl}" target="_blank">legacy dashboard</a>` : '';
    },
    editingText() {
      return this.editingDatasetName ? `Are you in the middle of editing "${this.editingDatasetName}" ?` : '';
    },
  },
  methods: {},
  data: () => ({
    mdiClose,
    introTextFallback: 'Manage your datasets and create new ones. <br/>',
    createText: 'Create a dataset',
    createSubtitleText:
      'Create a new dataset from scratch—fill in the details, add resources, and submit for publication',
    doiText: 'Import from DOI',
    doiSubtitleText:
      'You can use a valid DOI from Zenodo, DataCite, or Dryad to import your data. <strong>Please take a moment to review the data before you save it.</strong>',
    createButtonText: 'New Dataset',
    doiButtonText: 'Import',
    editingButtonText: 'Continue editing',
    importDoiValue: '',
  }),
  components: {
    BaseRectangleButton,
    MetadataCardLocal,
    // BaseIconButton,
  },
};
</script>

<style lang="scss" scoped></style>
