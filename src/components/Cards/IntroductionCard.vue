<template>
  <v-card color="secondary"
          id="IntroductionCard"
          class="pa-0 theme--dark">

    <v-container fluid class="pa-4">
      <v-row no-gutters>
        <v-col class="text-h5">
          {{ welcomeTitle }}
        </v-col>
      </v-row>

      <v-row no-gutters
              class="pt-2">
        <v-col class="text-body-1 accentLink">
          <div v-html="introductionText"></div>
        </v-col>
      </v-row>

      <v-row no-gutters
              class="pt-2">
        <v-col >
          <v-row no-gutters class="text-h6">
            What can you do here?
          </v-row>

          <v-row v-if="currentLocalDataset"
                 no-gutters>
            <v-col cols="12"
                    class="py-2">
              Continue creating your dataset:
            </v-col>

            <v-col cols="7"
                  class="px-1">
              <MetadataCardLocal v-bind="currentLocalDataset"
                                 @clickedEvent="$emit('localCardClicked')"
              />
            </v-col>

            <v-col cols="5"
                   class="pl-4 pr-1">
              <v-row >
                <v-col align-self="center">
                  Clear your local dataset in creation
                </v-col>

                <v-col class="shrink">
                  <base-icon-button material-icon-name="clear"
                                    :fill-color="$vuetify.theme.themes.light.error"
                                    icon-color="black"
                                    tooltip-text="Delete your local dataset"
                                    @clicked="$emit('clearButtonClicked', $event)"
                  />
                </v-col>
              </v-row>
            </v-col>

          </v-row>

          <v-row v-if="!currentLocalDataset"
                 no-gutters class="pt-3" style="align-items: center;">
            <v-col cols="3" class="text-body-1">
              {{ createText }}
            </v-col>

            <v-col cols="3">
              <base-rectangle-button
                color="accent"
                marginClass="black--text"
                :button-text="createButtonText"
                :disabled="createClickCallback === null"
                @clicked="createClickCallback ? createClickCallback() : ''"
              />
            </v-col>
          </v-row>

          <v-row v-if="editingText"
            no-gutters
            class="pt-3"
            style="align-items: center;"
          >
            <v-col cols="7" class="text-body-1">
              {{ editingText }}
            </v-col>

            <v-col cols="5"
                    class="pl-4">
              <base-rectangle-button
                color="accent"
                marginClass="black--text"
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
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';

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
      return this.userName
        ? `${this.title} ${this.userName} to your Dashboard!`
        : `${this.title} to your Dashboard!`;
    },
    introductionText() {
      let text = this.introText || this.introTextFallback;
      text += this.ckanDashboardText;
      text += this.feedbackText;
      return text;
    },
    ckanDashboardText() {
      return this.oldDashboardUrl
        ? ` And more is to come, the dashboard will change over time, if you can't find
                  a feature you can switch <a href="${this.oldDashboardUrl}" target="_blank">to the legacy dashboard</a>.`
        : '';
    },
    editingText() {
      return this.editingDatasetName
        ? `Are you in the middle of editing "${this.editingDatasetName}" ?`
        : '';
    },
  },
  methods: {},
  data: () => ({
    introTextFallback:
      'Here you can manage your existing datasets, create new ones, have a look at the datasets from your organization(s). <br/>',
    createText: 'Create a dataset',
    createButtonText: 'New Dataset',
    editingButtonText: 'Continue editing',
  }),
  components: {
    BaseRectangleButton,
  },
};
</script>

<style lang="scss" scoped></style>
