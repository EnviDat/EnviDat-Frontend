<template>
  <v-card color="secondary"
          dark
          id="IntroductionCard"
          class="pa-0" >

    <v-container fluid class="pa-4">

      <v-row no-gutters>
        <v-col class="text-h5">
          {{ welcomeTitle }}
        </v-col>
      </v-row>

      <v-row >
        <v-col class="text-body-1 accentLink"
               v-html="introductionText">
        </v-col>
      </v-row>

      <v-row>

        <v-col class="text-body-1" >

          <v-row no-gutters >
            What can you do here?
          </v-row>

          <v-row no-gutters
                 class="pt-3"
                 style="align-items: center;" >

            <v-col cols="3"
                   class="text-body-1" >
              {{ createText }}
<!--
              <v-icon style="animation: progress-circular-rotate 3s linear infinite" >settings</v-icon>
              Coming Soon!
-->

              <!--              <base-rectangle-button color="accent"
                                                   marginClass="black&#45;&#45;text"
                                                   :isOutlined="hasEditing"
                                                   :button-text="createButtonText"
                                                   :disabled="createClickCallback === null"
                                                   @clicked="createClickCallback ? createClickCallback : ''" />
                            -->
            </v-col>

            <v-col cols="3"
                   class="text-body-2">
              <v-icon style="animation: progress-circular-rotate 3s linear infinite" >settings</v-icon>
              Coming Soon!
            </v-col>

            <v-col cols="3" >
             <div class="pb-2">Use the legacy website for now:</div>
            </v-col>

            <v-col cols="3" >
              <base-rectangle-button color="accent"
                                     marginClass="black--text"
                                     :button-text="createButtonText"
                                     :disabled="createClickCallback === null"
                                     @clicked="createClickCallback ? createClickCallback() : ''" />

            </v-col>

          </v-row>

          <v-row no-gutters
                 class="pt-3"
                 style="align-items: center;" >

            <v-col cols="3"
                   class="text-body-1" >
              {{ existingText }}
            </v-col>

            <v-col cols="3" >
              <base-rectangle-button color="accent"
                                     marginClass="black--text"
                                     :button-text="existingButtonText"
                                     :disabled="existingClickCallback === null"
                                     @clicked="existingClickCallback ? existingClickCallback() : ''" />
            </v-col>
          </v-row>

          <v-row v-if="editingText"
                 no-gutters
                 class="pt-3"
                 style="align-items: center;" >

            <v-col cols="6"
                   class="text-body-1" >
              {{ editingText }}
            </v-col>

            <v-col cols="6" >
              <base-rectangle-button color="accent"
                                     marginClass="black--text"
                                     :button-text="editingButtonText"
                                     :disabled="editingClickCallback === null"
                                     @clicked="editingClickCallback ? editingClickCallback() : ''" />
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
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';

export default {
  name: 'IntroductionCard',
  props: {
    title: {
      type: String,
      default: 'Welcome back',
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
    existingClickCallback: {
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
  },
  computed: {
    welcomeTitle() {
      return this.userName ? `${this.title} ${this.userName} to your Dashboard!` : `${this.title} to your Dashboard!`;
    },
    introductionText() {
      let text = this.introText ? this.introText : this.introTextFallback;
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
      return this.editingDatasetName ? `Are you in the middle of editing "${this.editingDatasetName}" ?` : '';
    },
  },
  methods: {
  },
  data: () => ({
    introTextFallback: 'Welcome to your dashboard, manage your existing datasets, create new ones, have a look at the datasets from your organization(s). <br/>',
    createText: 'Create a dataset',
    createButtonText: 'New Dataset',
    existingText: 'Edit your existing datasets',
    existingButtonText: 'Goto Datasets',
    editingButtonText: 'Continue editing',
  }),  
  components: {
    BaseRectangleButton,
  },
};
</script>

<style lang="scss" scoped>
</style>
