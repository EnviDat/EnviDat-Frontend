<template>
  <v-card color="primary"
          dark
          id="WelcomeCard"
          class="pa-0" >

    <v-container fluid class="pa-4">

      <v-row no-gutters>
        <v-col class="text-h5">
          {{ welcomeTitle }}
        </v-col>
      </v-row>

      <v-row >
        <v-col cols="12"
                class="text-body-1" >
          {{ introText }}
        </v-col>
      </v-row>

      <v-row v-if="hasEditing">
        <v-col class="text-body-1" >
          {{ editingText }}
        </v-col>

        <v-col >
          <base-rectangle-button color="accent"
                                  marginClass="black--text"
                                  :button-text="editingButtonText"
                                  :disabled="editingClickCallback === null"
                                  @clicked="editingClickCallback ? editingClickCallback : ''" />
        </v-col>
      </v-row>

      <v-row >
        <v-col class="text-body-1" >
          {{ createText }}
        </v-col>

        <v-col >
          <base-rectangle-button color="accent"
                                  marginClass="black--text"
                                  :isOutlined="hasEditing"
                                  :button-text="createButtonText"
                                  :disabled="createClickCallback === null"
                                  @clicked="createClickCallback ? createClickCallback : ''" />
        </v-col>
      </v-row>

      <v-row v-if="hasUnpublished">
        <v-col class="text-body-1" >
          {{ unpublishedText }}
        </v-col>

        <v-col >
          <base-rectangle-button color="accent"
                                  isOutlined
                                  :button-text="unpublishedButtonText"
                                  :disabled="unpublishedClickCallback === null"
                                  @clicked="unpublishedClickCallback ? unpublishedClickCallback : ''" />
        </v-col>
      </v-row>

      <v-row no-gutters align="center">
        <v-col cols="1">
          <v-icon style="animation: progress-circular-rotate 3s linear infinite" x-large>settings</v-icon>
        </v-col>

        <v-col class="text-h5" cols="11">
          Coming Soon!
        </v-col>

        <v-col class="pt-2 text-body-1">
          This section is still under construction.
        </v-col>
      </v-row>

    </v-container>

  </v-card>

</template>


<script>
/**
 * WelcomeCard is used to say hello in the users dashboard.
 *
 * @summary welcome with intro text
 * @author Dominik Haas-Artho
 *
 * Created at     : 2019-10-02 11:24:00
 * Last modified  : 2020-10-08 16:42:22
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

export default {
  name: 'WelcomeCard',
  props: {
    title: {
      type: String,
      default: 'Welcome back',
    },
    userName: String,
    publishedDatasetCount: {
      type: Number,
      default: 0,
    },
    unpublishedDatasetCount: {
      type: Number,
      default: 0,
    },
    editingDatasetCount: {
      type: Number,
      default: 0,
    },
    createClickCallback: {
      type: Function,
      default: null,
    },
    unpublishedClickCallback: {
      type: Function,
      default: null,
    },
    editingClickCallback: {
      type: Function,
      default: null,
    },
  },
  computed: {
    welcomeTitle() {
      return this.userName ? `${this.title} ${this.userName}!` : `${this.title}!`;
    },
    introText() {
      let intro = `You have ${this.publishedDatasetCount} datasets published.`;

      if (this.unpublishedDatasetCount > 0) {
        intro += ` ${this.unpublishedDatasetCount} datasets are still unpublished.`;
      }

      if (this.editingDatasetCount > 0) {
        intro += ` And ${this.editingDatasetCount} datasets are currently in editing mode.`;
      }

      return intro;
    },
    hasUnpublished() {
      return this.unpublishedDatasetCount > 0;
    },
    hasEditing() {
      return this.editingDatasetCount > 0;
    },
  },
  methods: {
  },
  data: () => ({
    createText: 'Create a new dataset',
    createButtonText: 'New Dataset',
    unpublishedText: 'Edit your unpublished datasets',
    unpublishedButtonText: 'Show unpublished Datasets',
    editingText: 'Are you in the middle of editing?',
    editingButtonText: 'Continue editing',
  }),  
  components: {
    BaseRectangleButton,
  },
};
</script>

<style lang="scss" scoped>
</style>
